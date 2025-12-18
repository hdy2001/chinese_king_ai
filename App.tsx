import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { GenerateContentResponse } from "@google/genai";
import { Sidebar } from './components/Sidebar';
import { MessageItem } from './components/MessageItem';
import { IconBrush, IconSend, IconMenuOpen } from './components/Icons';
import { createChatStream, generateTitle } from './services/geminiService';
import { Message, ChatSession } from './types';

const App: React.FC = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load sessions from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('imperial_chat_sessions');
    if (saved) {
      const parsed = JSON.parse(saved);
      setSessions(parsed);
      if (parsed.length > 0) {
        setCurrentSessionId(parsed[0].id);
      } else {
        createNewSession();
      }
    } else {
      createNewSession();
    }
  }, []);

  // Save sessions to local storage
  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem('imperial_chat_sessions', JSON.stringify(sessions));
    }
  }, [sessions]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentSessionId, sessions, isStreaming]);

  // Adjust textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [input]);

  const getCurrentSession = () => sessions.find(s => s.id === currentSessionId);

  const createNewSession = () => {
    const newSession: ChatSession = {
      id: uuidv4(),
      title: 'New Audience',
      messages: [],
      lastModified: Date.now(),
    };
    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
    if (window.innerWidth < 768) setIsSidebarOpen(false);
  };

  const deleteSession = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const newSessions = sessions.filter(s => s.id !== id);
    setSessions(newSessions);
    localStorage.setItem('imperial_chat_sessions', JSON.stringify(newSessions));
    
    if (currentSessionId === id) {
      if (newSessions.length > 0) {
        setCurrentSessionId(newSessions[0].id);
      } else {
        createNewSession();
      }
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isStreaming || !currentSessionId) return;

    const userMsg: Message = {
      id: uuidv4(),
      role: 'user',
      content: input,
      timestamp: Date.now(),
    };

    // Optimistic update
    setSessions(prev => prev.map(s => {
      if (s.id === currentSessionId) {
        return {
          ...s,
          messages: [...s.messages, userMsg],
          lastModified: Date.now(),
        };
      }
      return s;
    }));

    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    setIsStreaming(true);

    try {
      const currentSession = sessions.find(s => s.id === currentSessionId);
      const history = currentSession ? currentSession.messages : [];
      
      // Update title if it's the first message
      if (history.length === 0) {
        generateTitle(userMsg.content).then(title => {
          setSessions(prev => prev.map(s => 
            s.id === currentSessionId ? { ...s, title } : s
          ));
        });
      }

      const stream = await createChatStream(history, userMsg.content);
      
      const modelMsgId = uuidv4();
      const modelMsg: Message = {
        id: modelMsgId,
        role: 'model',
        content: '',
        timestamp: Date.now(),
        isStreaming: true
      };

      // Add empty model message
      setSessions(prev => prev.map(s => {
        if (s.id === currentSessionId) {
          return { ...s, messages: [...s.messages, modelMsg] };
        }
        return s;
      }));

      let fullResponse = '';

      for await (const chunk of stream) {
        const text = (chunk as GenerateContentResponse).text;
        if (text) {
          fullResponse += text;
          setSessions(prev => prev.map(s => {
            if (s.id === currentSessionId) {
              const newMessages = [...s.messages];
              const lastMsgIndex = newMessages.findIndex(m => m.id === modelMsgId);
              if (lastMsgIndex !== -1) {
                newMessages[lastMsgIndex] = {
                  ...newMessages[lastMsgIndex],
                  content: fullResponse
                };
              }
              return { ...s, messages: newMessages };
            }
            return s;
          }));
        }
      }

      // Finish streaming
      setSessions(prev => prev.map(s => {
        if (s.id === currentSessionId) {
          const newMessages = [...s.messages];
          const lastMsgIndex = newMessages.findIndex(m => m.id === modelMsgId);
          if (lastMsgIndex !== -1) {
            newMessages[lastMsgIndex] = {
              ...newMessages[lastMsgIndex],
              isStreaming: false
            };
          }
          return { ...s, messages: newMessages };
        }
        return s;
      }));

    } catch (error) {
      console.error("Error generating response:", error);
      // Add error message to chat
      setSessions(prev => prev.map(s => {
        if (s.id === currentSessionId) {
          return {
            ...s,
            messages: [...s.messages, {
              id: uuidv4(),
              role: 'model',
              content: "*[The Grand Councilor is silent. The spirits of the network are disturbed.]* \n\n(Error: Failed to fetch response)",
              timestamp: Date.now()
            }]
          };
        }
        return s;
      }));
    } finally {
      setIsStreaming(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const currentMessages = getCurrentSession()?.messages || [];

  return (
    <div className="flex h-screen bg-[#f4ecd8] paper-texture overflow-hidden text-[#2c1810]">
      <Sidebar
        isOpen={isSidebarOpen}
        sessions={sessions}
        currentSessionId={currentSessionId}
        onSelectSession={(id) => { setCurrentSessionId(id); if (window.innerWidth < 768) setIsSidebarOpen(false); }}
        onNewSession={createNewSession}
        onDeleteSession={deleteSession}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <main className="flex-1 flex flex-col relative w-full">
        {/* Top Bar (Mobile) */}
        <header className="md:hidden flex items-center justify-between p-4 bg-[#2c1810] text-[#d4b483] shadow-md z-10">
          <button onClick={() => setIsSidebarOpen(true)}>
            <IconMenuOpen className="w-6 h-6" />
          </button>
          <span className="font-bold font-[Zhi Mang Xing] text-xl">Imperial Review</span>
          <div className="w-6" /> {/* Spacer */}
        </header>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto scroll-bar-custom p-4 md:p-8 relative">
          <div className="max-w-4xl mx-auto min-h-full flex flex-col">
            {currentMessages.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-[#8B4513] opacity-60">
                 <div className="w-24 h-24 border-4 border-[#8B4513] rounded-full flex items-center justify-center mb-6">
                    <span className="font-[Zhi Mang Xing] text-6xl">奏</span>
                 </div>
                 <h2 className="text-3xl font-bold mb-4 font-kaiti">The Court is in Session</h2>
                 <p className="text-lg italic font-kaiti">Awaiting Your Majesty's Vermilion Brush...</p>
                 <p className="text-sm mt-8 max-w-md text-center font-kaiti">
                   Use the input below to draft your edict or query the Grand Council. 
                   The ministers stand ready to advise.
                 </p>
              </div>
            ) : (
              <div className="pb-4">
                {currentMessages.map(msg => (
                  <MessageItem key={msg.id} message={msg} />
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 md:p-6 bg-gradient-to-t from-[#f4ecd8] via-[#f4ecd8] to-transparent z-10">
          <div className="max-w-4xl mx-auto relative">
             <div className="bg-[#fffbeb] border-2 border-[#8B4513] rounded-sm shadow-xl flex items-end p-2 transition-shadow focus-within:ring-2 focus-within:ring-[#B91C1C]/50">
                <div className="pl-3 py-3 text-[#B91C1C]">
                  <IconBrush className="w-6 h-6" />
                </div>
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Draft your imperial edict here..."
                  className="flex-1 max-h-48 bg-transparent border-none focus:ring-0 text-[#B91C1C] placeholder-[#B91C1C]/40 text-lg font-kaiti resize-none py-3 px-4 brush-cursor leading-relaxed"
                  rows={1}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!input.trim() || isStreaming}
                  className={`p-3 rounded-sm m-1 transition-all ${
                    !input.trim() || isStreaming 
                      ? 'bg-[#e5e5e5] text-gray-400 cursor-not-allowed' 
                      : 'bg-[#B91C1C] text-[#FFD700] hover:bg-[#8B0000] shadow-md'
                  }`}
                >
                  <IconSend className="w-5 h-5" />
                </button>
             </div>
             <div className="text-center mt-2 text-xs text-[#8B4513]/60 font-kaiti">
               Remember, the Imperial word is final. (Gemini 3 Flash Preview)
             </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;