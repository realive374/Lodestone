import React, { useState } from 'react';
import { X, Check, Plug } from 'lucide-react';
import { PLUGINS } from '@/lib/lodestone-data';

export default function PluginsModal({ onClose, selectedModel }) {
  const [connected, setConnected] = useState({});

  const togglePlugin = (id) => {
    setConnected((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getAvailablePlugins = () => {
    if (selectedModel.id === 'hi_nao') return [];
    if (selectedModel.id === 'chuanqi') return PLUGINS;
    return PLUGINS.filter((p) => p.tier === 'half');
  };

  const available = getAvailablePlugins();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Plug className="w-5 h-5 text-slate-600" />
            <div>
              <h2 className="text-lg font-bold text-slate-800">Plugins</h2>
              <p className="text-xs text-slate-500">
                Connect your accounts to Lodestone
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {available.length === 0 ? (
            <div className="text-center py-12">
              <Plug className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-sm text-slate-500">
                Plugins are not available on the {selectedModel.displayName} plan.
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Upgrade to Qīn (Pro) or higher to access plugins.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {available.map((plugin) => (
                <div
                  key={plugin.id}
                  className="flex flex-col items-center p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors"
                >
                  <PluginIcon id={plugin.id} color={plugin.color} />
                  <span className="text-sm font-medium text-slate-700 mt-2">{plugin.name}</span>
                  <button
                    onClick={() => togglePlugin(plugin.id)}
                    className={`mt-2 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                      connected[plugin.id]
                        ? 'bg-green-50 text-green-600 border border-green-200'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {connected[plugin.id] ? (
                      <span className="flex items-center gap-1">
                        <Check className="w-3 h-3" /> Connected
                      </span>
                    ) : (
                      'Connect'
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
          {selectedModel.id === 'chuanqi' && (
            <p className="text-center text-xs text-slate-400 mt-4">
              Chuánqí (Legend) includes unlimited plugin access.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function PluginIcon({ id, color }) {
  const common = 'w-10 h-10 rounded-full flex items-center justify-center';

  if (id === 'youtube') {
    return (
      <div className={common} style={{ backgroundColor: color }}>
        <svg viewBox="0 0 24 24" className="w-6 h-4" fill="white">
          <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8zM9.5 15.5v-7l6 3.5-6 3.5z" />
        </svg>
      </div>
    );
  }
  if (id === 'spotify') {
    return (
      <div className={common} style={{ backgroundColor: color }}>
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="white">
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.5 17.3c-.2.4-.7.5-1.1.3-3-1.8-6.8-2.2-11.2-1.2-.4.1-.9-.2-1-.6s.2-.9.6-1c4.9-1.1 9.1-.6 12.4 1.4.4.2.5.7.3 1.1zm1.5-3.3c-.3.4-.8.6-1.2.3-3.5-2.1-8.8-2.7-12.8-1.5-.5.1-1-.1-1.2-.6-.1-.5.1-1 .6-1.2 4.7-1.4 10.5-.7 14.5 1.7.4.2.6.8.3 1.3zm.1-3.4C15.1 8.3 8.7 8 5 9.2c-.6.2-1.2-.2-1.4-.7-.2-.6.2-1.2.7-1.4C8.5 6 15.5 6.3 20.3 9c.5.3.7 1 .4 1.5s-1 .7-1.5.4z" />
        </svg>
      </div>
    );
  }
  if (id === 'github') {
    return (
      <div className={common} style={{ backgroundColor: color }}>
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="white">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.3 3.5 1 .11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.65.25 2.87.12 3.17.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.62-5.49 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58A12 12 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
        </svg>
      </div>
    );
  }
  if (id === 'discord') {
    return (
      <div className={common} style={{ backgroundColor: color }}>
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="white">
          <path d="M20.3 4.37A19.8 19.8 0 0 0 15.4 2.8a14.6 14.6 0 0 0-.65 1.34 18.3 18.3 0 0 0-5.49 0A14.5 14.5 0 0 0 8.6 2.8a19.7 19.7 0 0 0-4.9 1.57C.54 9.23-.33 13.97.1 18.64a19.9 19.9 0 0 0 6.06 3.06c.49-.67.93-1.38 1.3-2.13a12.9 12.9 0 0 1-2.05-.98c.17-.13.34-.26.5-.4a14.2 14.2 0 0 0 12.18 0c.16.14.33.27.5.4a12.9 12.9 0 0 1-2.05.98c.38.75.81 1.46 1.3 2.13a19.9 19.9 0 0 0 6.06-3.06c.5-5.43-.86-10.13-3.6-14.27zM8.02 15.78c-1.18 0-2.16-1.09-2.16-2.42 0-1.34.95-2.43 2.16-2.43s2.18 1.09 2.16 2.43c0 1.33-.96 2.42-2.16 2.42zm7.96 0c-1.18 0-2.16-1.09-2.16-2.42 0-1.34.95-2.43 2.16-2.43s2.18 1.09 2.16 2.43c0 1.33-.95 2.42-2.16 2.42z" />
        </svg>
      </div>
    );
  }
  if (id === 'slack') {
    return (
      <div className={common} style={{ backgroundColor: color }}>
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="white">
          <path d="M5 15a2 2 0 1 1-2-2h2v2zm1 0a2 2 0 0 1 4 0v5a2 2 0 0 1-4 0v-5zm2-8a2 2 0 1 1 2-2v2H8zm0 1a2 2 0 0 1 0 4H3a2 2 0 0 1 0-4h5zm8 2a2 2 0 1 1 2 2h-2v-2zm-1 0a2 2 0 0 1-4 0V3a2 2 0 0 1 4 0v7zm-2 8a2 2 0 1 1-2 2v-2h2zm0-1a2 2 0 0 1 0-4h5a2 2 0 0 1 0 4h-5z" />
        </svg>
      </div>
    );
  }
  if (id === 'notion') {
    return (
      <div className={common} style={{ backgroundColor: color }}>
        <span className="text-white font-bold text-lg">N</span>
      </div>
    );
  }
  if (id === 'twitter') {
    return (
      <div className={common} style={{ backgroundColor: color }}>
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="white">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </div>
    );
  }
  if (id === 'gmail') {
    return (
      <div className={common} style={{ backgroundColor: color }}>
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="white">
          <path d="M24 5.46v13.08A1.46 1.46 0 0 1 22.54 20H20V9.74L12 15 4 9.74V20H1.46A1.46 1.46 0 0 1 0 18.54V5.46A1.46 1.46 0 0 1 1.46 4H2.4L12 11l9.6-7h.94A1.46 1.46 0 0 1 24 5.46z" />
        </svg>
      </div>
    );
  }
  if (id === 'gcal') {
    return (
      <div className={common} style={{ backgroundColor: color }}>
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="white">
          <path d="M19 4h-1V2h-2v2H8V2H6v2H5a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3zm1 15a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-8h16zm0-9H4V7a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1z" />
        </svg>
      </div>
    );
  }
  if (id === 'maps') {
    return (
      <div className={common} style={{ backgroundColor: color }}>
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="white">
          <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" />
        </svg>
      </div>
    );
  }
  if (id === 'reddit') {
    return (
      <div className={common} style={{ backgroundColor: color }}>
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="white">
          <path d="M24 12c0-1.1-.9-2-2-2a2 2 0 0 0-1.5.7c-1.5-1-3.5-1.7-5.7-1.8l1-4.6 3.2.7c0 .7.6 1.3 1.3 1.3a1.3 1.3 0 1 0 0-2.6c-.5 0-.9.3-1.1.6l-3.6-.8a.4.4 0 0 0-.5.3l-1.1 5.1c-2.2.1-4.2.7-5.7 1.8A2 2 0 0 0 2 10a2 2 0 0 0-1.2 3.6c0 .2 0 .5.1.7 0 2.6 3 4.7 6.7 4.7s6.7-2.1 6.7-4.7c0-.2.1-.5.1-.7A2 2 0 0 0 24 12zM7 14a1.3 1.3 0 1 1 2.6 0A1.3 1.3 0 0 1 7 14zm6.8 4.1a4 4 0 0 1-2.8 0 .3.3 0 0 1 .4-.5 3.3 3.3 0 0 0 2 0 .3.3 0 0 1 .4.5zm.6-2.8a1.3 1.3 0 1 1 0-2.6 1.3 1.3 0 0 1 0 2.6z" />
        </svg>
      </div>
    );
  }
  if (id === 'medium') {
    return (
      <div className={common} style={{ backgroundColor: color }}>
        <span className="text-white font-bold text-sm">M</span>
      </div>
    );
  }
  if (id === 'pinterest') {
    return (
      <div className={common} style={{ backgroundColor: color }}>
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="white">
          <path d="M12 0a12 12 0 0 0-4.37 23.17c-.1-.94-.2-2.4.04-3.42.22-.94 1.4-6 .88-6.94a3.7 3.7 0 0 1-3.7-5.58c.3-3.8 3.5-5.8 5.8-5.8 2.3 0 4.6 1.5 4.6 4.8 0 3.3-1.8 6-3.6 6a1.7 1.7 0 0 1-1.7-2.1c.3-1.3.9-2.7.9-3.6a1.3 1.3 0 0 0-1.3-1.5c-1.2 0-2.1 1.2-2.1 2.8 0 1 .3 1.7.3 1.7s-1.2 5-1.4 5.9c-.2.8-.3 1.7-.2 2.5A12 12 0 1 0 12 0z" />
        </svg>
      </div>
    );
  }
  if (id === 'twitch') {
    return (
      <div className={common} style={{ backgroundColor: color }}>
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="white">
          <path d="M4 2L2 6v14h5v2h3l2-2h4l4-4V2H4zm15 11l-3 3h-4l-2 2v-2H7V4h12v9zm-3-5h-2v5h2V8zm-5 0H9v5h2V8z" />
        </svg>
      </div>
    );
  }
  if (id === 'linkedin') {
    return (
      <div className={common} style={{ backgroundColor: color }}>
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="white">
          <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.8 0 0 .78 0 1.74v20.5C0 23.22.8 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.76V1.74C24 .78 23.2 0 22.22 0z" />
        </svg>
      </div>
    );
  }
  if (id === 'googledrive') {
    return (
      <div className={common} style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0' }}>
        <svg viewBox="0 0 24 24" className="w-5 h-5">
          <path d="M9 3h6l6 10h-6L9 3z" fill="#FFC107" />
          <path d="M3 13l3-5 6 10H6L3 13z" fill="#1976D2" />
          <path d="M15 13l3 5H6l3-5h6z" fill="#4CAF50" />
        </svg>
      </div>
    );
  }
  return (
    <div className={common} style={{ backgroundColor: color }}>
      <span className="text-white font-bold text-sm">
        {id[0].toUpperCase()}
      </span>
    </div>
  );
}