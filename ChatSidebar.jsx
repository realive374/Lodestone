import React from 'react';
import { Plus, MessageSquare, Trash2, PanelLeftClose, PanelLeft, User, Puzzle, Clock, LogIn } from 'lucide-react';
import Logo from './Logo';
import { Link } from 'react-router-dom';

export default function ChatSidebar({
  conversations,
  currentConvId,
  onSelectConv,
  onNewChat,
  onDeleteConv,
  user,
  onOpenProfile,
  onOpenPlugins,
  sidebarOpen,
  onToggleSidebar,
  guestTimeLeft,
  isGuest,
}) {
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  if (!sidebarOpen) {
    return (
      <button
        onClick={onToggleSidebar}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg hover:bg-slate-100 transition-colors"
      >
        <PanelLeft className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="w-72 h-full flex flex-col bg-slate-50 border-r border-slate-200">
      {/* Header */}
      <div className="p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Logo size={32} />
          <span className="font-semibold text-lg" style={{ background: 'linear-gradient(135deg, #f59e0b, #8b5cf6, #2563eb)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Lodestone
          </span>
        </div>
        <button onClick={onToggleSidebar} className="p-1.5 rounded-lg hover:bg-slate-200 transition-colors">
          <PanelLeftClose className="w-5 h-5 text-slate-500" />
        </button>
      </div>

      {/* New Chat */}
      <div className="px-3 pb-2">
        <button
          onClick={onNewChat}
          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          New Chat
        </button>
      </div>

      {/* Guest timer */}
      {isGuest && (
        <div className="px-3 pb-2">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-700">
            <Clock className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Guest session: {formatTime(guestTimeLeft)} remaining</span>
          </div>
        </div>
      )}

      {/* Conversations */}
      <div className="flex-1 overflow-y-auto px-2">
        {conversations.length === 0 ? (
          <p className="text-xs text-slate-400 text-center mt-8 px-4">
            No conversations yet. Start a new chat!
          </p>
        ) : (
          conversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => onSelectConv(conv.id)}
              className={`group flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors mb-0.5 ${
                currentConvId === conv.id
                  ? 'bg-slate-200/70 text-slate-900'
                  : 'hover:bg-slate-100 text-slate-600'
              }`}
            >
              <MessageSquare className="w-4 h-4 flex-shrink-0 opacity-60" />
              <span className="text-sm truncate flex-1">{conv.title}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteConv(conv.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-slate-300 transition-all"
              >
                <Trash2 className="w-3.5 h-3.5 text-slate-500" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Bottom section */}
      <div className="border-t border-slate-200 p-2 space-y-1">
        <button
          onClick={onOpenPlugins}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors text-sm text-slate-600"
        >
          <Puzzle className="w-4 h-4" />
          Plugins
        </button>
        {user ? (
          <button
            onClick={onOpenProfile}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors text-sm text-slate-600"
          >
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 to-blue-500 flex items-center justify-center text-white text-xs font-bold overflow-hidden">
              {user.avatar ? (
                <img src={user.avatar} alt="" className="w-full h-full object-cover" />
              ) : (
                user.full_name?.[0]?.toUpperCase() || 'U'
              )}
            </div>
            <span className="truncate">{user.full_name || user.email || 'Profile'}</span>
          </button>
        ) : (
          <Link
            to="/login"
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors text-sm text-slate-600"
          >
            <LogIn className="w-4 h-4" />
            Sign In
          </Link>
        )}
      </div>
    </div>
  );
}