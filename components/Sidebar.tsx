import React from 'react';
import { ChatSession } from '../types';
import { IconHistory, IconNew, IconScroll, IconClose } from './Icons';

interface SidebarProps {
  isOpen: boolean;
  sessions: ChatSession[];
  currentSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewSession: () => void;
  onDeleteSession: (e: React.MouseEvent, id: string) => void;
  toggleSidebar: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  sessions,
  currentSessionId,
  onSelectSession,
  onNewSession,
  onDeleteSession,
  toggleSidebar,
}) => {
  return (
    <>
      {/* Mobile overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 z-20 md:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={toggleSidebar}
      />
      
      {/* Sidebar Panel */}
      <div className={`fixed inset-y-0 left-0 z-30 w-72 bg-[#2c1810] text-[#d4b483] transform transition-transform duration-300 ease-in-out border-r-4 border-[#8B4513] shadow-2xl flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static`}>
        
        {/* Header */}
        <div className="p-6 border-b border-[#5c3a21] flex items-center justify-between bg-[#1a0f0a]">
          <div className="flex items-center space-x-3">
            <IconScroll className="w-6 h-6 text-[#c0a060]" />
            <h1 className="text-xl font-bold tracking-widest font-[Zhi Mang Xing]">Imperial Archives</h1>
          </div>
          <button onClick={toggleSidebar} className="md:hidden">
            <IconClose className="w-5 h-5" />
          </button>
        </div>

        {/* New Chat Button */}
        <div className="p-4">
          <button
            onClick={onNewSession}
            className="w-full flex items-center justify-center space-x-2 bg-[#8B0000] hover:bg-[#a50000] text-[#ffd700] py-3 px-4 rounded-sm border-2 border-[#ffd700] transition-colors shadow-lg group"
          >
            <IconNew className="w-5 h-5 group-hover:rotate-90 transition-transform" />
            <span className="font-bold tracking-wide">Draft New Edict</span>
          </button>
        </div>

        {/* Session List */}
        <div className="flex-1 overflow-y-auto scroll-bar-custom p-4 space-y-2">
          {sessions.length === 0 ? (
            <div className="text-center text-[#8b6b4e] mt-10 italic">
              No memorials found in the archive.
            </div>
          ) : (
            sessions.map((session) => (
              <div
                key={session.id}
                onClick={() => onSelectSession(session.id)}
                className={`group relative flex items-center p-3 rounded-sm cursor-pointer border border-transparent transition-all duration-200 ${
                  currentSessionId === session.id
                    ? 'bg-[#3e2723] border-[#c0a060] text-[#ffd700]'
                    : 'hover:bg-[#3e2723]/50 text-[#a89078]'
                }`}
              >
                <IconHistory className="w-4 h-4 mr-3 opacity-70" />
                <div className="truncate text-sm font-medium pr-6 flex-1">
                  {session.title}
                </div>
                <button
                  onClick={(e) => onDeleteSession(e, session.id)}
                  className="absolute right-2 opacity-0 group-hover:opacity-100 hover:text-red-400 transition-opacity"
                  title="Burn Memorial"
                >
                  <IconClose className="w-3 h-3" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#5c3a21] text-xs text-[#5c3a21] text-center font-serif">
          The Grand Secretariat • {new Date().getFullYear()}
        </div>
      </div>
    </>
  );
};