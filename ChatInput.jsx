import React, { useState, useRef, useEffect } from 'react';
import { Send, ImageIcon, Video, Square } from 'lucide-react';
import ModelSelector from './ModelSelector';

export default function ChatInput({
  onSend,
  selectedModel,
  onSelectModel,
  unlockedModels,
  onPaidModelClick,
  user,
  onImageGen,
  onVideoGen,
  isGenerating,
  disabled,
}) {
  const [text, setText] = useState('');
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px';
    }
  }, [text]);

  const handleSubmit = () => {
    if (text.trim() && !isGenerating && !disabled) {
      onSend(text.trim());
      setText('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="px-4 pb-4 pt-2">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm focus-within:border-slate-300 transition-colors">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={disabled ? 'Guest session expired — sign in to continue' : 'Message Lodestone...'}
            disabled={disabled}
            rows={1}
            className="w-full px-4 pt-3 pb-1 bg-transparent resize-none outline-none text-sm text-slate-800 placeholder:text-slate-400 disabled:opacity-50"
            style={{ maxHeight: '200px' }}
          />
          <div className="flex items-center justify-between px-2 pb-2 pt-1">
            <div className="flex items-center gap-1">
              <button
                onClick={onImageGen}
                disabled={disabled}
                title="Generate Image (Nano Banana Pro)"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:bg-amber-50 hover:text-amber-600 transition-colors disabled:opacity-40"
              >
                <ImageIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Image</span>
              </button>
              <button
                onClick={onVideoGen}
                disabled={disabled}
                title="Generate Video (Sora AI 2)"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition-colors disabled:opacity-40"
              >
                <Video className="w-4 h-4" />
                <span className="hidden sm:inline">Video</span>
              </button>
            </div>
            <div className="flex items-center gap-2">
              <ModelSelector
                selectedModel={selectedModel}
                onSelectModel={onSelectModel}
                unlockedModels={unlockedModels}
                onPaidModelClick={onPaidModelClick}
                user={user}
              />
              <button
                onClick={handleSubmit}
                disabled={!text.trim() || isGenerating || disabled}
                className="p-2 rounded-lg transition-colors disabled:bg-slate-100 disabled:text-slate-300"
                style={{
                  backgroundColor: text.trim() && !isGenerating && !disabled ? selectedModel.accent : undefined,
                  color: text.trim() && !isGenerating && !disabled ? 'white' : undefined,
                }}
              >
                {isGenerating ? (
                  <Square className="w-4 h-4 fill-current" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
        <p className="text-xs text-slate-400 text-center mt-2">
          Lodestone can make mistakes. Verify important information.
        </p>
      </div>
    </div>
  );
}