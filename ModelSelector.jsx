import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Lock, Sparkles } from 'lucide-react';
import { MODELS } from '@/lib/lodestone-data';

export default function ModelSelector({ selectedModel, onSelectModel, unlockedModels, onPaidModelClick, user }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = (model) => {
    if (model.id === 'hi_nao') {
      onSelectModel(model);
      setOpen(false);
    } else if (unlockedModels.includes(model.id)) {
      onSelectModel(model);
      setOpen(false);
    } else {
      onPaidModelClick(model);
      setOpen(false);
    }
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-medium hover:bg-slate-100 transition-colors text-slate-600"
      >
        <span
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: selectedModel.accent }}
        />
        <span>{selectedModel.displayName}</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute bottom-full right-0 mb-2 w-72 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden z-50">
          <div className="p-1.5">
            {MODELS.map((model) => {
              const isUnlocked = model.id === 'hi_nao' || unlockedModels.includes(model.id);
              const isSelected = selectedModel.id === model.id;
              return (
                <button
                  key={model.id}
                  onClick={() => handleSelect(model)}
                  className={`w-full flex items-start gap-2.5 p-2.5 rounded-lg transition-colors text-left ${
                    isSelected ? 'bg-slate-100' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {isSelected ? (
                      <Check className="w-4 h-4" style={{ color: model.accent }} />
                    ) : isUnlocked ? (
                      <Sparkles className="w-4 h-4 text-slate-300" />
                    ) : (
                      <Lock className="w-4 h-4 text-slate-300" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className="text-sm font-medium"
                        style={{ color: isSelected ? model.accent : undefined }}
                      >
                        {model.displayName}
                      </span>
                      {model.price > 0 && !isUnlocked && (
                        <span className="text-xs px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">
                          {model.priceLabel}
                        </span>
                      )}
                      {model.price === 0 && (
                        <span className="text-xs px-1.5 py-0.5 rounded bg-green-50 text-green-600">
                          Free
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{model.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}