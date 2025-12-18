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
  const [scale, setScale] = useState(1);
  const paperRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  
  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Reset position and scale when message opens
  useEffect(() => {
    if (message) {
      setPosition({ x: 0, y: 0 });
      setScale(isMobile ? 0.85 : 1); // 移动端默认缩小以适配
    }
  }, [message, isMobile]);

  if (!message) return null;

  // 鼠标事件处理
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

  // 触摸事件处理（移动端）
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({ 
        x: e.touches[0].clientX - position.x, 
        y: e.touches[0].clientY - position.y 
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging && e.touches.length === 1) {
      e.preventDefault();
      setPosition({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y
      });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md overflow-hidden animate-in fade-in duration-300">
      
      {/* Floating Close Button */}
      <button 
        onClick={onClose}
        className={`absolute z-[60] bg-[#2c1810] text-[#d4b483] border-2 border-[#d4b483] rounded-full hover:bg-[#8B0000] hover:text-white transition-all shadow-lg group ${
          isMobile ? 'top-4 right-4 p-2' : 'top-6 right-6 p-3'
        }`}
      >
        <IconClose className={`group-hover:rotate-90 transition-transform ${
          isMobile ? 'w-5 h-5' : 'w-6 h-6'
        }`} />
      </button>

      {/* Helper Text */}
      <div className={`absolute left-0 right-0 text-center text-[#d4b483]/60 pointer-events-none z-[60] ${
        isMobile ? 'bottom-4 text-xs' : 'bottom-6 text-sm'
      }`}>
        {isMobile ? '拖动查看完整奏折' : '按住奏折拖动 · 左右阅览'}
      </div>

      {/* Draggable Container */}
      <div 
        className={`w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing touch-none`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div 
          ref={paperRef}
          className="relative bg-[#f4ecd8] paper-texture shadow-2xl transition-transform duration-75 border-y-[16px] border-x-[8px] border-[#f4ecd8]"
          style={{ 
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            maxHeight: isMobile ? '80vh' : '85vh',
            // 在移动端限制最大宽度，桌面端允许增长
            width: isMobile ? 'auto' : 'max-content',
            maxWidth: isMobile ? '90vw' : 'none',
          }}
        >
          {/* Decorative Top/Bottom Borders mimicking mounted scroll */}
          <div className="absolute top-[-16px] left-0 right-0 h-[16px] bg-[#5c3a21] border-b-2 border-[#3e2723]"></div>
          <div className="absolute bottom-[-16px] left-0 right-0 h-[16px] bg-[#5c3a21] border-t-2 border-[#3e2723]"></div>

          <div className={`vertical-memorial font-kaiti text-[#2c1810] h-full flex flex-col items-stretch justify-start overflow-hidden ${
            isMobile ? 'p-6 min-h-[60vh] max-h-[80vh]' : 'p-12 md:p-16 min-h-[60vh] max-h-[85vh]'
          }`}>
            
            {/* Header: Rightmost (Start) */}
            <div className={`font-bold text-[#B91C1C] tracking-widest whitespace-nowrap ${
              isMobile ? 'text-xl mb-4' : 'text-3xl mb-8'
            }`} style={{ writingMode: 'vertical-rl' }}>
               微臣叩首：
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-hidden">
              <ReactMarkdown 
                components={{
                  code({node, inline, className, children, ...props}: any) {
                     return !inline ? (
                       <div className={`bg-[#fff] text-[#333] border-2 border-[#8b4513] font-mono shadow-sm ${
                         isMobile ? 'p-2 my-2 text-xs max-w-[200px]' : 'p-4 my-4 text-sm max-w-[300px]'
                       }`} style={{ writingMode: 'horizontal-tb' }}>
                         <div className={`border-b border-[#8b4513]/30 mb-2 pb-1 text-[#8b4513] font-bold ${
                           isMobile ? 'text-[10px]' : 'text-xs'
                         }`}>西洋机关</div>
                         <code {...props}>{children}</code>
                       </div>
                     ) : (
                       <code className={`bg-[#e0d0b0] text-[#8b4513] rounded border border-[#c0b090] ${
                         isMobile ? 'px-0.5 mx-0.5 text-xs' : 'px-1 mx-1'
                       }`} style={{ writingMode: 'horizontal-tb', display: 'inline-block' }} {...props}>{children}</code>
                     )
                  },
                  blockquote({children}) {
                    return <blockquote className={`border-t-4 border-[#8B4513] mt-2 italic text-gray-800 bg-transparent ${
                      isMobile ? 'pt-2' : 'pt-4'
                    }`}>{children}</blockquote>
                  },
                  p({children}) {
                    return <p className={`font-medium leading-loose ${
                      isMobile ? 'mb-6 text-base' : 'mb-10 text-2xl'
                    }`}>{children}</p>
                  },
                  h1: ({children}) => <h1 className={`font-bold text-[#8B0000] ${
                    isMobile ? 'text-2xl mb-6' : 'text-4xl mb-12'
                  }`}>{children}</h1>,
                  h2: ({children}) => <h2 className={`font-bold text-[#5c3a21] ${
                    isMobile ? 'text-xl mb-5' : 'text-3xl mb-10'
                  }`}>{children}</h2>,
                  h3: ({children}) => <h3 className={`font-bold text-[#5c3a21] ${
                    isMobile ? 'text-lg mb-4' : 'text-2xl mb-8'
                  }`}>{children}</h3>,
                  ul: ({children}) => <ul className={`list-disc ${
                    isMobile ? 'ml-2 mb-4' : 'ml-4 mb-8'
                  }`}>{children}</ul>,
                  ol: ({children}) => <ol className={`list-decimal ${
                    isMobile ? 'ml-2 mb-4' : 'ml-4 mb-8'
                  }`}>{children}</ol>,
                  li: ({children}) => <li className={`border-r-2 border-[#8B4513]/20 ${
                    isMobile ? 'mb-2 pl-1 pr-1' : 'mb-4 pl-2 pr-2'
                  }`}>{children}</li>,
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>

             {/* Footer: Leftmost (End) */}
             <div className={`flex items-center opacity-90 ${
               isMobile ? 'mt-8 gap-3' : 'mt-16 gap-6'
             }`} style={{ writingMode: 'vertical-rl' }}>
               <div className={`font-serif tracking-widest ${
                 isMobile ? 'text-sm' : 'text-lg'
               }`}>{new Date(message.timestamp).toLocaleDateString('zh-CN-u-ca-chinese')}</div>
               <div className={`text-[#8B0000] border-4 border-[#8B0000] font-[Zhi Mang Xing] shadow-sm bg-white/20 ${
                 isMobile ? 'p-2 text-2xl' : 'p-3 text-4xl'
               }`}>
                  军机处印
               </div>
             </div>

          </div>
        </div>
      </div>
    </div>
  );
};