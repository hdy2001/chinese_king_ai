import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Message } from '../types';
import { IconSeal } from './Icons';

interface MessageItemProps {
  message: Message;
}

export const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex w-full mb-8 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[85%] md:max-w-[90%] flex ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start gap-3`}>
        
        {/* Avatar / Seal */}
        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border-2 shadow-sm ${
          isUser 
            ? 'bg-[#8B0000] border-[#FFD700] text-[#FFD700]' 
            : 'bg-[#2F4F4F] border-[#A9A9A9] text-white'
        }`}>
          {isUser ? (
            <span className="font-[Zhi Mang Xing] text-lg">朕</span> // "Zhen" (I, the Emperor)
          ) : (
            <span className="font-[Zhi Mang Xing] text-lg">臣</span> // "Chen" (Your subject/minister)
          )}
        </div>

        {/* Message Bubble */}
        <div className={`relative px-6 py-4 rounded-sm shadow-md paper-texture leading-relaxed font-kaiti ${
          isUser 
            ? 'bg-[#fffbeb] border-l-4 border-l-[#B91C1C] text-[#B91C1C] text-lg' // User: Horizontal
            : 'bg-[#fffaf0] border-r-4 border-r-[#2F4F4F] text-gray-900 text-xl' // Model: Vertical, shifted border to right (top in vertical?) visual consistency
        }`}>
           {/* Decorative corner accents */}
           <div className={`absolute top-0 w-2 h-2 border-t border-r ${isUser ? 'right-0 border-[#B91C1C]' : 'left-0 border-[#2F4F4F]'} opacity-50`}></div>
           <div className={`absolute bottom-0 w-2 h-2 border-b border-l ${isUser ? 'left-0 border-[#B91C1C]' : 'right-0 border-[#2F4F4F]'} opacity-50`}></div>

           {/* Name tag */}
           <div className={`text-xs font-bold mb-2 opacity-80 uppercase tracking-widest ${
               isUser ? 'text-right text-[#B91C1C]' : 'text-left text-[#2F4F4F] writing-mode-horizontal' // Ensure name tag is horizontal for readability? Or keep vertical?
             }`}>
             {isUser ? 'His Imperial Majesty' : 'Grand Councilor'}
           </div>

           {/* Content */}
           <div className={`markdown prose prose-stone max-w-none ${isUser ? 'font-medium' : 'vertical-memorial scroll-bar-custom'}`}>
              <ReactMarkdown 
                components={{
                  code({node, inline, className, children, ...props}: any) {
                     return !inline ? (
                       <div className="bg-[#2d2d2d] text-[#e0e0e0] p-3 rounded-sm my-2 border border-[#8b4513] font-mono text-sm relative" style={{ writingMode: 'horizontal-tb' }}>
                         <div className="absolute top-0 right-0 bg-[#8b4513] text-[#ffd700] text-xs px-2 py-0.5">Foreign Script</div>
                         <code {...props}>{children}</code>
                       </div>
                     ) : (
                       <code className="bg-gray-200 text-red-900 px-1 rounded" style={{ writingMode: 'horizontal-tb', display: 'inline-block' }} {...props}>{children}</code>
                     )
                  },
                  blockquote({children}) {
                    return <blockquote className="border-[#8B4513] italic my-2 text-gray-700 bg-gray-50/50 py-1 px-2">{children}</blockquote>
                  },
                  // Override paragraph to ensure spacing in vertical mode
                  p({children}) {
                    return <p className="mb-4 ml-4">{children}</p> // margin-bottom becomes margin-left in vertical-rl
                  }
                }}
              >
                {message.content}
              </ReactMarkdown>
              {message.isStreaming && (
                <span className="inline-block w-2 h-4 ml-1 bg-[#8B4513] animate-pulse align-middle"></span>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};