import React from 'react';
import { ChatMessage } from '../../types/chat';
import { MessageList } from './MessageList';
import { QuickActions } from './QuickActions';
import { ChatInput } from './ChatInput';
import { Bot, X, RotateCcw, Sparkles } from 'lucide-react';

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  isTyping: boolean;
  onSendMessage: (text: string) => void;
  onClearChat: () => void;
  isRecruiter: boolean;
  currentPage: string;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  isOpen,
  onClose,
  messages,
  isTyping,
  onSendMessage,
  onClearChat,
  isRecruiter,
  currentPage
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-label="CredAI Chatbot"
      className="fixed bottom-20 right-4 sm:right-6 z-40 w-[calc(100vw-2rem)] sm:w-[380px] max-h-[580px] bg-[#171A2B] border border-[#252A46] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200"
    >
      {/* Header with subtle signature gradient */}
      <div className="p-3.5 bg-gradient-to-r from-[#171A2B] via-[#252A46] to-[#171A2B] border-b border-[#252A46] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#6C63FF]/20 border border-[#6C63FF]/40 flex items-center justify-center text-[#8B7CFF]">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-xs font-bold text-white flex items-center gap-1">
                CredAI
                <Sparkles className="w-2.5 h-2.5 text-[#8B7CFF]" />
              </h3>
              <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Online
              </span>
            </div>
            <p className="text-[10px] text-[#9498AB] font-medium">Your RecruitCred Assistant</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {/* Clear Conversation */}
          <button
            onClick={onClearChat}
            title="Reset conversation"
            aria-label="Reset conversation"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#252A46] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Close Window */}
          <button
            onClick={onClose}
            title="Close chat"
            aria-label="Close chat"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#252A46] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Message List */}
      <MessageList
        messages={messages}
        isTyping={isTyping}
        onQuickReplyClick={onSendMessage}
      />

      {/* Quick Action Pills */}
      <QuickActions
        isRecruiter={isRecruiter}
        onSelectAction={onSendMessage}
        currentPage={currentPage}
      />

      {/* Input Area */}
      <ChatInput
        onSendMessage={onSendMessage}
        disabled={isTyping}
      />
    </div>
  );
};
