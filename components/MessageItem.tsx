import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Message } from '../types';
import { IconScroll } from './Icons';

interface MessageItemProps {
  message: Message;
  onView?: (message: Message) => void;
}

export const MessageItem: React.FC<MessageItemProps> = ({ message, onView }) => {
  const isUser = message.role === 'user';

  if (!isUser) {
    // Render Folded Memorial for AI
    return (
      <div className="flex w-full mb-8 justify-start">
         <div className="max-w-[85%] flex flex-row items-start gap-3">
            {/* Avatar */}
            <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border-2 shadow-sm bg-[#2F4F4F] border-[#A9A9A9] text-white">
               <span className="font-[Zhi Mang Xing] text-lg">臣</span>
            </div>

            {/* Folded Memorial Card */}
            <div 
              onClick={() => onView && onView(message)}
              className="group cursor-pointer relative bg-[#fffaf0] hover:bg-[#fff5e0] transition-colors rounded-sm shadow-md border-r-4 border-r-[#2f3e4f] w-64 md:w-80 h-32 flex flex-col items-center justify-center paper-texture overflow-hidden"
            >
               {/* Decorative stripes mimicking a folded booklet */}
               <div className="absolute left-2 top-0 bottom-0 w-1 bg-[#2f3e4f]/10"></div>
               <div className="absolute left-4 top-0 bottom-0 w-1 bg-[#2f3e4f]/10"></div>
               
               {/* Label Strip */}
               <div className="absolute top-0 bottom-0 right-6 w-8 bg-[#8B0000] flex items-center justify-center shadow-sm">
                  <span className="text-[#FFD700] font-[Zhi Mang Xing] text-xl writing-mode-vertical py-2">
                     奏折
                  </span>
               </div>

               {/* Content Hint */}
               <div className="flex flex-col items-center justify-center p-4 pr-16 w-full text-center">
                  <IconScroll className="w-8 h-8 text-[#2f3e4f] mb-2 opacity-80" />
                  <span className="font-kaiti text-[#2c1810] font-bold text-lg">军机处奏折</span>
                  <span className="text-xs text-[#8B4513] mt-1 font-serif group-hover:underline">点击展阅</span>
                  
                  {message.isStreaming && (
                    <span className="text-xs text-[#8B4513] mt-2 animate-pulse">
                      （墨迹未干...）
                    </span>
                  )}
               </div>
            </div>
         </div>
      </div>
    );
  }

  // Render User Message (Standard Horizontal Bubble)
  return (
    <div className="flex w-full mb-8 justify-end">
      <div className="max-w-[85%] md:max-w-[75%] flex flex-row-reverse items-start gap-3">
        
        {/* Avatar */}
        <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border-2 shadow-sm bg-[#8B0000] border-[#FFD700] text-[#FFD700]">
            <span className="font-[Zhi Mang Xing] text-lg">朕</span>
        </div>

        {/* Message Bubble */}
        <div className="relative px-6 py-4 rounded-sm shadow-md paper-texture leading-relaxed font-kaiti bg-[#fffbeb] border-l-4 border-l-[#B91C1C] text-[#B91C1C] text-lg">
           {/* Decorative corner accents */}
           <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#B91C1C] opacity-50"></div>
           <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#B91C1C] opacity-50"></div>

           {/* Name tag */}
           <div className="text-xs font-bold mb-2 opacity-80 uppercase tracking-widest text-right text-[#B91C1C]">
             圣上
           </div>

           {/* Content */}
           <div className="markdown prose prose-stone max-w-none font-medium">
              <ReactMarkdown 
                components={{
                  code({node, inline, className, children, ...props}: any) {
                     return !inline ? (
                       <div className="bg-[#2d2d2d] text-[#e0e0e0] p-3 rounded-sm my-2 border border-[#8b4513] font-mono text-sm relative">
                         <div className="absolute top-0 right-0 bg-[#8b4513] text-[#ffd700] text-xs px-2 py-0.5">洋文</div>
                         <code {...props}>{children}</code>
                       </div>
                     ) : (
                       <code className="bg-gray-200 text-red-900 px-1 rounded" {...props}>{children}</code>
                     )
                  },
                  blockquote({children}) {
                    return <blockquote className="border-l-4 border-[#8B4513] pl-4 italic my-2 text-gray-700 bg-gray-50/50 py-1 pr-2">{children}</blockquote>
                  }
                }}
              >
                {message.content}
              </ReactMarkdown>
           </div>
        </div>
      </div>
    </div>
  );
};