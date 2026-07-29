import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Copy, Check, User as UserIcon } from 'lucide-react';
import Logo from './Logo';
import { Image } from '@/components/ui/image';

export default function ChatMessage({ message, isThinking }) {
  const [copied, setCopied] = React.useState(false);
  const isUser = message.role === 'user';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isThinking) {
    return (
      <div className="flex gap-3 px-4 py-6 max-w-3xl mx-auto w-full">
        <div className="flex-shrink-0">
          <Logo size={32} />
        </div>
        <div className="flex items-center gap-1.5 pt-2">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-2 h-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    );
  }

  return (
    <div className="group flex gap-3 px-4 py-5 max-w-3xl mx-auto w-full">
      <div className="flex-shrink-0">
        {isUser ? (
          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white">
            <UserIcon className="w-4 h-4" />
          </div>
        ) : (
          <Logo size={32} />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-slate-700 mb-1">
          {isUser ? 'You' : 'Legend'}
        </div>
        {message.type === 'image' && message.mediaUrl ? (
          <div className="space-y-2">
            {message.content && (
              <p className="text-sm text-slate-600">{message.content}</p>
            )}
            <Image
              src={message.mediaUrl}
              alt="Generated"
              className="rounded-xl max-w-md w-full border border-slate-200 shadow-sm"
            />
          </div>
        ) : message.type === 'video' && message.mediaUrl ? (
          <div className="space-y-2">
            {message.content && (
              <p className="text-sm text-slate-600">{message.content}</p>
            )}
            <video
              src={message.mediaUrl}
              controls
              className="rounded-xl max-w-md w-full border border-slate-200 shadow-sm"
            />
          </div>
        ) : (
          <div className="prose prose-sm prose-slate max-w-none prose-pre:bg-slate-900 prose-pre:text-slate-100 prose-code:text-pink-600 prose-code:before:content-none prose-code:after:content-none">
            <ReactMarkdown
              components={{
                code({ className, children, ...props }) {
                  if (!className) {
                    return (
                      <code className="px-1 py-0.5 rounded bg-slate-100 text-pink-600 text-sm" {...props}>
                        {children}
                      </code>
                    );
                  }
                  return (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
              }}
            >
              {message.content || ''}
            </ReactMarkdown>
          </div>
        )}
        {!isUser && message.content && (
          <button
            onClick={handleCopy}
            className="mt-2 flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 transition-colors opacity-0 group-hover:opacity-100"
          >
            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        )}
      </div>
    </div>
  );
}