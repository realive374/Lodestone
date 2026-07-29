import React, { useState, useRef } from 'react';
import { X, Upload, Check } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function ProfileModal({ user, onClose, onSave }) {
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [description, setDescription] = useState(user?.description || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setAvatar(file_url);
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await base44.auth.updateMe({
        full_name: fullName,
        description: description,
        avatar: avatar,
      });
      onSave({ full_name: fullName, description, avatar });
      onClose();
    } catch (err) {
      console.error('Save failed:', err);
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800">Edit Profile</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Avatar */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 to-blue-500 flex items-center justify-center text-white text-3xl font-bold overflow-hidden">
                {avatar ? (
                  <img src={avatar} alt="" className="w-full h-full object-cover" />
                ) : (
                  fullName?.[0]?.toUpperCase() || 'U'
                )}
              </div>
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors shadow-sm"
              >
                {uploading ? (
                  <div className="w-3.5 h-3.5 border-2 border-slate-300 border-t-slate-700 rounded-full animate-spin" />
                ) : (
                  <Upload className="w-4 h-4 text-slate-600" />
                )}
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
            <button
              onClick={() => fileRef.current?.click()}
              className="text-xs text-slate-500 hover:text-slate-700 mt-2"
            >
              Choose from files
            </button>
          </div>

          {/* Name */}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Display Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your name"
              className="w-full px-3 py-2.5 rounded-lg border border-slate-200 outline-none focus:border-slate-400 text-sm"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell something about yourself..."
              rows={3}
              className="w-full px-3 py-2.5 rounded-lg border border-slate-200 outline-none focus:border-slate-400 text-sm resize-none"
            />
          </div>

          {/* Done button */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full py-2.5 rounded-xl bg-slate-800 text-white font-semibold hover:bg-slate-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Check className="w-4 h-4" />
                Done
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}