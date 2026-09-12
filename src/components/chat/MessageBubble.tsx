import React from 'react';
import { ChatMessage } from '../../types/chat';
import { Bot, User as UserIcon, ArrowRight } from 'lucide-react';
import { useApp, ActivePage } from '../../context/AppContext';

interface MessageBubbleProps {
  message: ChatMessage;
  onQuickReplyClick?: (reply: string) => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  onQuickReplyClick
}) => {
  const { navigateTo } = useApp();
  const isUser = message.sender === 'user';

  // Format simple markdown (bold text and linebreaks) safely
  const renderFormattedContent = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, lineIdx) => {
      // Process bold formatting **text**
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <p key={lineIdx} className={lineIdx > 0 ? 'mt-1.5' : ''}>
          {parts.map((part, partIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return (
                <strong key={partIdx} className="font-semibold text-white">
                  {part.slice(2, -2)}
                </strong>
              );
            }
            if (part.startsWith('`') && part.endsWith('`')) {
              return (
                <code key={partIdx} className="px-1 py-0.5 rounded bg-slate-950 font-mono text-[11px] text-emerald-400 border border-slate-800">
                  {part.slice(1, -1)}
                </code>
              );
            }
            return part;
          })}
        </p>
      );
    });
  };

  return (
    <div className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'} animate-in fade-in duration-200`}>
      {/* Bot Avatar */}
      {!isUser && (
        <div className="w-7 h-7 rounded-lg bg-brand-600/20 border border-brand-500/30 flex items-center justify-center text-brand-400 shrink-0 mt-0.5">
          <Bot className="w-4 h-4" />
        </div>
      )}

      <div className={`max-w-[84%] space-y-1.5`}>
        {/* Message Content Bubble */}
        <div
          className={`p-3 rounded-2xl text-xs leading-relaxed ${
            isUser
              ? 'bg-brand-600 text-white rounded-br-xs shadow-md shadow-brand-500/10'
              : 'bg-slate-800/90 text-slate-200 border border-slate-700/60 rounded-bl-xs'
          }`}
        >
          {renderFormattedContent(message.content)}

          {/* Action Link Button if provided */}
          {message.actionLink && (
            <div className="mt-2.5 pt-2 border-t border-slate-700/60">
              <button
                onClick={() => navigateTo(message.actionLink?.page as ActivePage)}
                className="w-full py-1.5 px-2.5 rounded-lg bg-slate-900 hover:bg-brand-600 text-white text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
              >
                <span>{message.actionLink.label}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        {/* Quick Reply Suggestions */}
        {message.quickReplies && message.quickReplies.length > 0 && onQuickReplyClick && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {message.quickReplies.map((reply, idx) => (
              <button
                key={idx}
                onClick={() => onQuickReplyClick(reply)}
                className="px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 text-[11px] text-brand-300 hover:text-white border border-slate-700/80 transition-colors cursor-pointer"
              >
                {reply}
              </button>
            ))}
          </div>
        )}

        {/* Timestamp */}
        <div className={`text-[10px] text-slate-500 px-1 font-mono ${isUser ? 'text-right' : 'text-left'}`}>
          {message.timestamp}
        </div>
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 mt-0.5">
          <UserIcon className="w-4 h-4" />
        </div>
      )}
    </div>
  );
};
