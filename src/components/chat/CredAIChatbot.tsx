import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { ChatMessage } from '../../types/chat';
import { ChatButton } from './ChatButton';
import { ChatWindow } from './ChatWindow';
import { sendChatMessage } from '../../services/ai/aiService';
import { buildChatContext } from '../../services/ai/contextBuilder';

export type ChatState = 'idle' | 'loading' | 'success' | 'error';

export const CredAIChatbot: React.FC = () => {
  const {
    currentUser,
    currentPage,
    teams,
    attempts
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [, setChatState] = useState<ChatState>('idle');

  const isRecruiter = Boolean(
    currentUser?.id === 'user-rohan' ||
    (currentUser?.role && (currentUser.role.toLowerCase().includes('lead') || currentUser.role.toLowerCase().includes('recruiter')))
  );

  // Initial welcome message
  const getInitialMessage = (): ChatMessage => ({
    id: 'welcome-msg',
    sender: 'ai',
    content: `Hi! I’m **CredAI**, your RecruitCred Assistant 👋\n\nI can help you understand your credibility profile, skill verification, assessments, project evidence, and campus recruitment readiness.\n\nHow can I help you today?`,
    timestamp: 'Just now',
    quickReplies: [
      'Improve My Profile',
      'Understand My Credibility Score',
      'Prepare for Verification',
      'Find Relevant Opportunities',
      'Find Teammates'
    ]
  });

  const [messages, setMessages] = useState<ChatMessage[]>(() => [getInitialMessage()]);
  const activeRequestRef = useRef<number>(0);

  // Listen for open-credai global events from navigation or buttons
  useEffect(() => {
    const handleOpenCredAI = () => setIsOpen(true);
    window.addEventListener('open-credai', handleOpenCredAI);
    return () => window.removeEventListener('open-credai', handleOpenCredAI);
  }, []);

  // If user switches persona, ensure conversation is fresh and updated
  useEffect(() => {
    setMessages(prev => {
      if (prev.length <= 1) {
        return [getInitialMessage()];
      }
      return prev;
    });
  }, [currentUser?.id]);

  const handleSendMessage = async (userText: string) => {
    const cleanText = userText.trim();
    if (!cleanText || isTyping) return;

    const requestId = ++activeRequestRef.current;
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      sender: 'user',
      content: cleanText,
      timestamp: timeStr
    };

    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);
    setChatState('loading');

    const context = buildChatContext(
      currentUser,
      currentPage,
      teams?.length || 0,
      attempts?.length || 0
    );

    try {
      // Guarantee maximum 9-second timeout race to prevent infinite loading
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('REQUEST_TIMEOUT')), 9000)
      );

      // Add minimum delay for natural conversational rhythm (300ms)
      const fetchPromise = Promise.all([
        sendChatMessage({
          userMessage: cleanText,
          context,
          history: messages
        }),
        new Promise(resolve => setTimeout(resolve, 300))
      ]).then(([res]) => res);

      const responseResult = await Promise.race([fetchPromise, timeoutPromise]);

      // Only apply if this is still the active request
      if (requestId === activeRequestRef.current) {
        const aiMsg: ChatMessage = {
          id: `ai-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          sender: 'ai',
          content: responseResult.content,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          quickReplies: responseResult.quickReplies,
          actionLink: responseResult.actionLink
        };

        setMessages(prev => [...prev, aiMsg]);
        setChatState('success');
      }
    } catch (err) {
      console.error('[CredAI] Error processing chat message:', err);
      if (requestId === activeRequestRef.current) {
        setChatState('error');
        const errorMsg: ChatMessage = {
          id: `ai-err-${Date.now()}`,
          sender: 'ai',
          content: `CredAI is temporarily unavailable or experiencing connectivity latency. You can still explore the guided topics below:`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          quickReplies: [
            'Improve My Profile',
            'Understand My Credibility Score',
            'Prepare for Verification',
            'Find Relevant Opportunities'
          ]
        };
        setMessages(prev => [...prev, errorMsg]);
      }
    } finally {
      if (requestId === activeRequestRef.current) {
        setIsTyping(false);
      }
    }
  };

  const handleClearChat = () => {
    activeRequestRef.current++;
    setIsTyping(false);
    setChatState('idle');
    setMessages([getInitialMessage()]);
  };

  return (
    <>
      <ChatButton
        isOpen={isOpen}
        onClick={() => setIsOpen(!isOpen)}
      />

      <ChatWindow
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        messages={messages}
        isTyping={isTyping}
        onSendMessage={handleSendMessage}
        onClearChat={handleClearChat}
        isRecruiter={isRecruiter}
        currentPage={currentPage}
      />
    </>
  );
};
