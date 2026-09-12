import React, { useEffect, useRef } from 'react';
import { ChatMessage } from '../../types/chat';
import { MessageBubble } from './MessageBubble';
import { Bot } from 'lucide-react';

interface MessageListProps {
  messages: ChatMessage[];
  isTyping: boolean;
  onQuickReplyClick: (reply: string) => void;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  isTyping,
  onQuickReplyClick
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[420px] scrollbar-thin scrollbar-thumb-slate-800">
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          message={message}
          onQuickReplyClick={onQuickReplyClick}
        />
      ))}

      {/* Typing Indicator */}
      {isTyping && (
        <div className="flex items-center gap-2.5 text-xs text-slate-400 animate-in fade-in duration-150">
          <div className="w-7 h-7 rounded-lg bg-brand-600/20 border border-brand-500/30 flex items-center justify-center text-brand-400 shrink-0">
            <Bot className="w-4 h-4" />
          </div>
          <div className="p-2.5 rounded-2xl bg-slate-800 border border-slate-700/60 rounded-bl-xs flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-bounce"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-bounce [animation-delay:0.2s]"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-bounce [animation-delay:0.4s]"></span>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
};
