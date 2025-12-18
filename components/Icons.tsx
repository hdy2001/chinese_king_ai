import React from 'react';
import { Scroll, PenTool, History, PlusCircle, Send, ChevronLeft, ChevronRight, X, Music, VolumeX } from 'lucide-react';

export const IconScroll = ({ className }: { className?: string }) => <Scroll className={className} />;
export const IconBrush = ({ className }: { className?: string }) => <PenTool className={className} />;
export const IconHistory = ({ className }: { className?: string }) => <History className={className} />;
export const IconNew = ({ className }: { className?: string }) => <PlusCircle className={className} />;
export const IconSend = ({ className }: { className?: string }) => <Send className={className} />;
export const IconMenuOpen = ({ className }: { className?: string }) => <ChevronRight className={className} />;
export const IconMenuClose = ({ className }: { className?: string }) => <ChevronLeft className={className} />;
export const IconClose = ({ className }: { className?: string }) => <X className={className} />;
export const IconMusic = ({ className }: { className?: string }) => <Music className={className} />;
export const IconMusicOff = ({ className }: { className?: string }) => <VolumeX className={className} />;

// A custom "Seal" icon SVG for the Emperor
export const IconSeal = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <rect x="4" y="4" width="16" height="16" rx="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 8h8v8H8z" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M16 8L8 16" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 8L16 16" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);