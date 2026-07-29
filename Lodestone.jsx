import React, { useState, useEffect, useRef, useCallback } from 'react';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { SYSTEM_PROMPT, MODELS } from '@/lib/lodestone-data';
import { MessageSquare, Sparkles, Code, Video, ImageIcon } from 'lucide-react';
import Logo from '@/components/lodestone/Logo';
import ChatSidebar from '@/components/lodestone/ChatSidebar';
import ChatMessage from '@/components/lodestone/ChatMessage';
import ChatInput from '@/components/lodestone/ChatInput';
import PaymentModal from '@/components/lodestone/PaymentModal';
import PluginsModal from '@/components/lodestone/PluginsModal';
import ProfileModal from '@/components/lodestone/ProfileModal';
import MediaGenModal from '@/components/lodestone/MediaGenModal';

export default function Lodestone() {
  const { user: authUser } = useAuth();
  const [user, setUser] = useState(authUser);
  const isSignedIn = !!user;

  const [conversations, setConversations] = useState([]);
  const [currentConvId, setCurrentConvId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [selectedModel, setSelectedModel] = useState(MODELS[0]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Modals
  const [paymentModel, setPaymentModel] = useState(null);
  const [showPlugins, setShowPlugins] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [mediaGenType, setMediaGenType] = useState(null);

  // Sidebar
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Guest timer
  const [guestTimeLeft, setGuestTimeLeft] = useState(50 * 60);
  const [guestExpired, setGuestExpired] = useState(false);

  // Unlocked models
  const [unlockedModels, setUnlockedModels] = useState(() => {
    const saved = localStorage.getItem('lodestone_unlocked');
    return saved ? JSON.parse(saved) : ['hi_nao'];
  });

  const messagesEndRef = useRef(null);

  // Sync user from auth
  useEffect(() => {
    if (authUser) {
      setUser(authUser);
    }
  }, [authUser]);

  // Load conversations for signed-in users
  useEffect(() => {
    if (user) {
      const saved = localStorage.getItem(`lodestone_convs_${user.id}`);
      if (saved) {
        const convs = JSON.parse(saved);
        setConversations(convs);
      }
    }
  }, [user]);

  // Save conversations for signed-in users
  useEffect(() => {
    if (user && conversations.length >= 0) {
      localStorage.setItem(`lodestone_convs_${user.id}`, JSON.stringify(conversations));
    }
  }, [conversations, user]);

  // Save unlocked models
  useEffect(() => {
    localStorage.setItem('lodestone_unlocked', JSON.stringify(unlockedModels));
  }, [unlockedModels]);

  // Guest timer
  useEffect(() => {
    if (!isSignedIn) {
      const storedStart = sessionStorage.getItem('lodestone_guest_start');
      if (!storedStart) {
        sessionStorage.setItem('lodestone_guest_start', Date.now().toString());
      }
      const interval = setInterval(() => {
        const start = parseInt(sessionStorage.getItem('lodestone_guest_start') || Date.now().toString());
        const elapsed = (Date.now() - start) / 1000;
        const remaining = Math.max(0, 50 * 60 - elapsed);
        setGuestTimeLeft(remaining);
        if (remaining <= 0) {
          setGuestExpired(true);
          clearInterval(interval);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isSignedIn]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isGenerating]);

  const updateConversation = useCallback((convId, updatedMessages, modelId) => {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === convId
          ? {
              ...c,
              messages: updatedMessages,
              title: updatedMessages[0]?.content?.slice(0, 40) || c.title,
              model_id: modelId || c.model_id,
            }
          : c
      )
    );
  }, []);

  const handleSend = async (text) => {
    if (guestExpired) return;

    const userMessage = { role: 'user', content: text, type: 'text' };
    let convId = currentConvId;
    let newMessages;

    if (!convId) {
      const newConv = {
        id: `conv_${Date.now()}`,
        title: text.slice(0, 40),
        messages: [userMessage],
        model_id: selectedModel.id,
      };
      convId = newConv.id;
      newMessages = [userMessage];
      setConversations((prev) => [newConv, ...prev]);
      setCurrentConvId(convId);
    } else {
      newMessages = [...messages, userMessage];
    }

    setMessages(newMessages);
    updateConversation(convId, newMessages, selectedModel.id);
    setIsGenerating(true);

    try {
      const conversationContext = newMessages
        .map((m) => {
          if (m.type === 'image' || m.type === 'video') {
            return `${m.role === 'user' ? 'User' : 'Assistant'}: [Generated ${m.type}: ${m.content}]`;
          }
          return `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`;
        })
        .join('\n\n');

      const fullPrompt = `${SYSTEM_PROMPT}\n\n--- Conversation ---\n${conversationContext}\n\nAssistant:`;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt: fullPrompt,
        model: selectedModel.llmModel,
      });

      const responseText = typeof response === 'string' ? response : response?.response || JSON.stringify(response);

      const assistantMessage = {
        role: 'assistant',
        content: responseText,
        type: 'text',
      };

      const finalMessages = [...newMessages, assistantMessage];
      setMessages(finalMessages);
      updateConversation(convId, finalMessages, selectedModel.id);
    } catch (err) {
      console.error('LLM error:', err);
      const errorMsg = {
        role: 'assistant',
        content: `I encountered an error: ${err.message || 'Something went wrong'}. Please try again.`,
        type: 'text',
      };
      const finalMessages = [...newMessages, errorMsg];
      setMessages(finalMessages);
      updateConversation(convId, finalMessages, selectedModel.id);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNewChat = () => {
    setCurrentConvId(null);
    setMessages([]);
  };

  const handleSelectConv = (convId) => {
    const conv = conversations.find((c) => c.id === convId);
    if (conv) {
      setCurrentConvId(convId);
      setMessages(conv.messages || []);
      const model = MODELS.find((m) => m.id === conv.model_id);
      if (model) setSelectedModel(model);
    }
  };

  const handleDeleteConv = (convId) => {
    setConversations((prev) => prev.filter((c) => c.id !== convId));
    if (currentConvId === convId) {
      setCurrentConvId(null);
      setMessages([]);
    }
  };

  const handleSelectModel = (model) => {
    setSelectedModel(model);
    if (currentConvId) {
      updateConversation(currentConvId, messages, model.id);
    }
  };

  const handlePaidModelClick = (model) => {
    setPaymentModel(model);
  };

  const handlePay = (modelId) => {
    setUnlockedModels((prev) => [...prev, modelId]);
    const model = MODELS.find((m) => m.id === modelId);
    if (model) setSelectedModel(model);
  };

  const handleMediaResult = (result) => {
    const assistantMessage = {
      role: 'assistant',
      content: result.content,
      type: result.type,
      mediaUrl: result.mediaUrl,
    };
    const newMessages = [...messages, assistantMessage];
    setMessages(newMessages);

    if (currentConvId) {
      updateConversation(currentConvId, newMessages, selectedModel.id);
    } else {
      const newConv = {
        id: `conv_${Date.now()}`,
        title: `${result.type === 'image' ? 'Image' : 'Video'}: ${result.content.slice(0, 30)}`,
        messages: newMessages,
        model_id: selectedModel.id,
      };
      setConversations((prev) => [newConv, ...prev]);
      setCurrentConvId(newConv.id);
    }
  };

  const handleProfileSave = (data) => {
    setUser((prev) => ({ ...prev, ...data }));
  };

  const examplePrompts = [
    { icon: Code, text: 'Write a Python script to scrape a website', color: '#3b82f6' },
    { icon: Sparkles, text: 'Generate a cyberpunk city image', color: '#f59e0b' },
    { icon: Video, text: 'Storyboard a 15-second coffee ad', color: '#8b5cf6' },
    { icon: MessageSquare, text: 'Let\'s role-play a fantasy adventure', color: '#ec4899' },
  ];

  return (
    <div className="flex h-screen w-full bg-white overflow-hidden">
      {/* Sidebar */}
      <ChatSidebar
        conversations={conversations}
        currentConvId={currentConvId}
        onSelectConv={handleSelectConv}
        onNewChat={handleNewChat}
        onDeleteConv={handleDeleteConv}
        user={user}
        onOpenProfile={() => setShowProfile(true)}
        onOpenPlugins={() => setShowPlugins(true)}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        guestTimeLeft={guestTimeLeft}
        isGuest={!isSignedIn}
      />

      {/* Main chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            {!sidebarOpen && (
              <button onClick={() => setSidebarOpen(true)} className="p-1.5 rounded-lg hover:bg-slate-100">
                <MessageSquare className="w-5 h-5 text-slate-500" />
              </button>
            )}
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: selectedModel.accent }}
              />
              <span className="text-sm font-medium text-slate-700">{selectedModel.displayName}</span>
            </div>
          </div>
          {!isSignedIn && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Guest mode</span>
            </div>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center px-4">
              <Logo size={72} className="mb-4" />
              <h1 className="text-3xl font-bold mb-2" style={{ background: 'linear-gradient(135deg, #f59e0b, #8b5cf6, #2563eb)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Lodestone
              </h1>
              <p className="text-slate-400 text-sm mb-8 text-center max-w-md">
                Your true north for building, creating, and playing — seven expert tools in one.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl">
                {examplePrompts.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(prompt.text)}
                    disabled={guestExpired}
                    className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all text-left disabled:opacity-50"
                  >
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: prompt.color + '15' }}
                    >
                      <prompt.icon className="w-4 h-4" style={{ color: prompt.color }} />
                    </div>
                    <span className="text-sm text-slate-600">{prompt.text}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="py-4">
              {messages.map((msg, i) => (
                <ChatMessage key={i} message={msg} />
              ))}
              {isGenerating && <ChatMessage message={{ role: 'assistant' }} isThinking />}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Guest expired overlay */}
        {guestExpired && !isSignedIn && (
          <div className="px-4 pb-4">
            <div className="max-w-3xl mx-auto p-4 rounded-xl bg-amber-50 border border-amber-200 text-center">
              <p className="text-sm text-amber-700 font-medium">
                Your 50-minute guest session has ended. Sign in to continue chatting with unlimited time.
              </p>
            </div>
          </div>
        )}

        {/* Input */}
        <ChatInput
          onSend={handleSend}
          selectedModel={selectedModel}
          onSelectModel={handleSelectModel}
          unlockedModels={unlockedModels}
          onPaidModelClick={handlePaidModelClick}
          user={user}
          onImageGen={() => setMediaGenType('image')}
          onVideoGen={() => setMediaGenType('video')}
          isGenerating={isGenerating}
          disabled={guestExpired && !isSignedIn}
        />
      </div>

      {/* Modals */}
      {paymentModel && (
        <PaymentModal
          model={paymentModel}
          onClose={() => setPaymentModel(null)}
          onPay={handlePay}
        />
      )}
      {showPlugins && (
        <PluginsModal
          onClose={() => setShowPlugins(false)}
          selectedModel={selectedModel}
        />
      )}
      {showProfile && user && (
        <ProfileModal
          user={user}
          onClose={() => setShowProfile(false)}
          onSave={handleProfileSave}
        />
      )}
      {mediaGenType && (
        <MediaGenModal
          type={mediaGenType}
          onClose={() => setMediaGenType(null)}
          onResult={handleMediaResult}
          selectedModel={selectedModel}
        />
      )}
    </div>
  );
}