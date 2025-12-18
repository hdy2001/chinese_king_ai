import React, { useRef, useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Message } from '../types';
import { IconClose } from './Icons';

interface MemorialModalProps {
  message: Message | null;
  onClose: () => void;
}

export const MemorialModal: React.FC<MemorialModalProps> = ({ message, onClose }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const paperRef = useRef<HTMLDivElement>(null);
  
  // Reset position when message opens
  useEffect(() => {
    if (message) {
      setPosition({ x: 0, y: 0 });
    }
  }, [message]);

  if (!message) return null;

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      e.preventDefault();
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md overflow-hidden animate-in fade-in duration-300">
      
      {/* Floating Close Button */}
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 z-[60] p-3 bg-[#2c1810] text-[#d4b483] border-2 border-[#d4b483] rounded-full hover:bg-[#8B0000] hover:text-white transition-all shadow-lg group"
      >
        <IconClose className="w-6 h-6 group-hover:rotate-90 transition-transform" />
      </button>

      {/* Helper Text */}
      <div className="absolute bottom-6 left-0 right-0 text-center text-[#d4b483]/60 text-sm pointer-events-none z-[60]">
        按住奏折拖动 · 左右阅览
      </div>

      {/* Draggable Container */}
      <div 
        className={`w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div 
          ref={paperRef}
          className="relative bg-[#f4ecd8] paper-texture shadow-2xl transition-transform duration-75 border-y-[16px] border-x-[8px] border-[#f4ecd8]"
          style={{ 
            transform: `translate(${position.x}px, ${position.y}px)`,
            maxHeight: '85vh',
            // Ensure width fits content but allows growing.
            // In vertical-rl, width grows with content.
            width: 'max-content',
            maxWidth: 'none',
          }}
        >
          {/* Decorative Top/Bottom Borders mimicking mounted scroll */}
          <div className="absolute top-[-16px] left-0 right-0 h-[16px] bg-[#5c3a21] border-b-2 border-[#3e2723]"></div>
          <div className="absolute bottom-[-16px] left-0 right-0 h-[16px] bg-[#5c3a21] border-t-2 border-[#3e2723]"></div>

          <div className="vertical-memorial font-kaiti text-[#2c1810] p-12 md:p-16 h-full flex flex-col items-stretch justify-start min-h-[60vh] max-h-[85vh] overflow-visible">
            
            {/* Header: Rightmost (Start) */}
            <div className="font-bold text-[#B91C1C] text-3xl mb-8 tracking-widest whitespace-nowrap" style={{ writingMode: 'vertical-rl' }}>
               微臣叩首：
            </div>

            {/* Content Body */}
            <div className="flex-1">
              <ReactMarkdown 
                components={{
                  code({node, inline, className, children, ...props}: any) {
                     return !inline ? (
                       <div className="bg-[#fff] text-[#333] p-4 my-4 border-2 border-[#8b4513] font-mono text-sm shadow-sm max-w-[300px]" style={{ writingMode: 'horizontal-tb' }}>
                         <div className="border-b border-[#8b4513]/30 mb-2 pb-1 text-[#8b4513] text-xs font-bold">西洋机关</div>
                         <code {...props}>{children}</code>
                       </div>
                     ) : (
                       <code className="bg-[#e0d0b0] text-[#8b4513] px-1 rounded mx-1 border border-[#c0b090]" style={{ writingMode: 'horizontal-tb', display: 'inline-block' }} {...props}>{children}</code>
                     )
                  },
                  blockquote({children}) {
                    return <blockquote className="border-t-4 border-[#8B4513] pt-4 mt-2 italic text-gray-800 bg-transparent">{children}</blockquote>
                  },
                  p({children}) {
                    return <p className="mb-10 text-2xl leading-loose font-medium">{children}</p>
                  },
                  h1: ({children}) => <h1 className="font-bold text-4xl mb-12 text-[#8B0000]">{children}</h1>,
                  h2: ({children}) => <h2 className="font-bold text-3xl mb-10 text-[#5c3a21]">{children}</h2>,
                  h3: ({children}) => <h3 className="font-bold text-2xl mb-8 text-[#5c3a21]">{children}</h3>,
                  ul: ({children}) => <ul className="list-disc ml-4 mb-8">{children}</ul>,
                  ol: ({children}) => <ol className="list-decimal ml-4 mb-8">{children}</ol>,
                  li: ({children}) => <li className="mb-4 pl-2 border-r-2 border-[#8B4513]/20 pr-2">{children}</li>,
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>

             {/* Footer: Leftmost (End) */}
             <div className="mt-16 flex items-center gap-6 opacity-90" style={{ writingMode: 'vertical-rl' }}>
               <div className="text-lg font-serif tracking-widest">{new Date(message.timestamp).toLocaleDateString('zh-CN-u-ca-chinese')}</div>
               <div className="text-[#8B0000] border-4 border-[#8B0000] p-3 font-[Zhi Mang Xing] text-4xl shadow-sm bg-white/20">
                  军机处印
               </div>
             </div>

          </div>
        </div>
      </div>
    </div>
  );
};