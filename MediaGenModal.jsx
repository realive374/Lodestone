import React, { useState } from 'react';
import { X, Sparkles, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Image } from '@/components/ui/image';

export default function MediaGenModal({ type, onClose, onResult, selectedModel }) {
  const [prompt, setPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const isImage = type === 'image';
  const title = isImage ? 'Generate Image' : 'Generate Video';
  const accentColor = isImage ? '#f59e0b' : '#3b82f6';

  const handleGenerate = async () => {
    if (!prompt.trim() || generating) return;
    setGenerating(true);
    setError(null);
    setResult(null);
    try {
      if (isImage) {
        const res = await base44.integrations.Core.GenerateImage({ prompt: prompt.trim() });
        setResult(res.file_url || res.url);
      } else {
        const res = await base44.integrations.Core.GenerateVideo({ prompt: prompt.trim() });
        setResult(res.file_url || res.url);
      }
    } catch (err) {
      console.error('Generation failed:', err);
      setError(err.message || 'Generation failed. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const handleAddToChat = () => {
    onResult({
      content: prompt.trim(),
      mediaUrl: result,
      type: isImage ? 'image' : 'video',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: accentColor + '15' }}
            >
              <Sparkles className="w-5 h-5" style={{ color: accentColor }} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">{title}</h2>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Prompt input */}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">
              Describe what you want to {isImage ? 'see' : 'watch'}
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={
                isImage
                  ? 'A serene mountain lake at sunset with golden reflections...'
                  : 'A cinematic drone shot flying over a misty forest at dawn...'
              }
              rows={3}
              className="w-full px-3 py-2.5 rounded-lg border border-slate-200 outline-none focus:border-slate-400 text-sm resize-none"
            />
          </div>

          {/* Generate button */}
          <button
            onClick={handleGenerate}
            disabled={!prompt.trim() || generating}
            className="w-full py-2.5 rounded-xl text-white font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            style={{
              background: `linear-gradient(135deg, ${accentColor}, ${accentColor}dd)`,
            }}
          >
            {generating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {isImage ? 'Generating image...' : 'Generating video (30-60s)...'}
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate
              </>
            )}
          </button>

          {/* Error */}
          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Result */}
          {result && (
            <div className="space-y-3">
              <div className="rounded-xl overflow-hidden border border-slate-200">
                {isImage ? (
                  <Image src={result} alt="Generated" className="w-full" />
                ) : (
                  <video src={result} controls className="w-full" />
                )}
              </div>
              <button
                onClick={handleAddToChat}
                className="w-full py-2.5 rounded-xl bg-slate-800 text-white font-semibold hover:bg-slate-700 transition-colors"
              >
                Add to Chat
              </button>
            </div>
          )}

          {/* Tips */}
          {!result && !generating && (
            <div className="text-xs text-slate-400 space-y-1">
              <p className="font-medium text-slate-500">Tips for better results:</p>
              {isImage ? (
                <>
                  <p>• Include subject, style, lighting, and mood</p>
                  <p>• Specify aspect ratio or composition preferences</p>
                  <p>• Mention color palette for precise control</p>
                </>
              ) : (
                <>
                  <p>• Describe camera movement and framing</p>
                  <p>• Include pacing and mood details</p>
                  <p>• Mention duration and transitions</p>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}