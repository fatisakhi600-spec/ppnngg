import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface ProfilePageProps {
  onToolChange: (tool: string) => void;
}

export function ProfilePage({ onToolChange }: ProfilePageProps) {
  const { user, updateProfile, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'settings' | 'activity'>('overview');
  const [editName, setEditName] = useState(user?.name || '');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!user) return null;

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const toolNames: Record<string, { name: string; icon: string; color: string }> = {
    converter: { name: 'PNG to JPG', icon: '🔄', color: 'bg-blue-100 text-blue-700' },
    compress: { name: 'Compress', icon: '🗜️', color: 'bg-emerald-100 text-emerald-700' },
    resize: { name: 'Resize', icon: '📐', color: 'bg-rose-100 text-rose-700' },
    removebg: { name: 'Remove BG', icon: '✂️', color: 'bg-violet-100 text-violet-700' },
    texttoimage: { name: 'Text to Image', icon: '🎨', color: 'bg-pink-100 text-pink-700' },
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    await new Promise(r => setTimeout(r, 500));
    updateProfile({ name: editName });
    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const joinedDate = new Date(user.joinedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const lastActiveDate = user.stats.lastActive
    ? new Date(user.stats.lastActive).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Never';

  const totalToolUses = Object.values(user.stats.toolsUsed).reduce((a, b) => a + b, 0);
  const mostUsedTool = Object.entries(user.stats.toolsUsed).sort((a, b) => b[1] - a[1])[0];

  const statCards = [
    {
      label: 'Images Processed',
      value: user.stats.imagesProcessed.toString(),
      icon: '🖼️',
      color: 'from-blue-500 to-indigo-500',
    },
    {
      label: 'Total Tool Uses',
      value: totalToolUses.toString(),
      icon: '🛠️',
      color: 'from-purple-500 to-pink-500',
    },
    {
      label: 'Tools Explored',
      value: `${Object.keys(user.stats.toolsUsed).length} / 5`,
      icon: '🎯',
      color: 'from-emerald-500 to-teal-500',
    },
    {
      label: 'Account Type',
      value: user.plan === 'pro' ? 'Pro ⭐' : 'Free',
      icon: '💎',
      color: 'from-amber-500 to-orange-500',
    },
  ];

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: '📊' },
    { id: 'activity' as const, label: 'Activity', icon: '📋' },
    { id: 'settings' as const, label: 'Settings', icon: '⚙️' },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      {/* Profile Header */}
      <div className="relative rounded-3xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-8 md:p-10 mb-8 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Avatar */}
          <div className="relative">
            <img
              src={user.avatar || ''}
              alt={user.name}
              className="h-24 w-24 md:h-28 md:w-28 rounded-3xl ring-4 ring-white/30 shadow-2xl"
            />
            <div className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-green-400 border-4 border-white flex items-center justify-center">
              <svg className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
          </div>

          {/* Info */}
          <div className="text-center md:text-left flex-1">
            <h1 className="text-2xl md:text-3xl font-extrabold text-white">{user.name}</h1>
            <p className="text-sm text-white/70 mt-1">{user.email}</p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-4">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 backdrop-blur-sm px-4 py-1.5">
                <span className="text-xs font-bold text-white">{user.plan === 'pro' ? '⭐ Pro Plan' : '🆓 Free Plan'}</span>
              </div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 backdrop-blur-sm px-4 py-1.5">
                <svg className="h-3.5 w-3.5 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
                <span className="text-xs font-medium text-white/90">Joined {joinedDate}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={logout}
              className="flex items-center gap-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2.5 text-xs font-bold text-white hover:bg-white/20 transition-all"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
              </svg>
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 bg-slate-100 rounded-2xl p-1.5">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-all ${
              activeTab === tab.id
                ? 'bg-white text-slate-900 shadow-md'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {statCards.map(stat => (
              <div key={stat.label} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-2xl mb-2">{stat.icon}</div>
                <p className={`text-2xl font-extrabold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                  {stat.value}
                </p>
                <p className="text-xs text-slate-500 font-medium mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Tool Usage */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Tool Usage Chart */}
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span className="text-lg">📊</span> Tool Usage Breakdown
              </h3>
              {Object.keys(user.stats.toolsUsed).length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-3xl mb-2">🚀</p>
                  <p className="text-sm text-slate-500">No tools used yet. Start exploring!</p>
                  <button
                    onClick={() => { onToolChange('converter'); scrollToTop(); }}
                    className="mt-3 text-xs font-bold text-purple-600 hover:text-purple-700"
                  >
                    Try PNG to JPG Converter →
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {Object.entries(user.stats.toolsUsed)
                    .sort((a, b) => b[1] - a[1])
                    .map(([tool, count]) => {
                      const info = toolNames[tool] || { name: tool, icon: '🔧', color: 'bg-slate-100 text-slate-700' };
                      const percentage = totalToolUses > 0 ? (count / totalToolUses) * 100 : 0;
                      return (
                        <div key={tool}>
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <span className={`inline-flex items-center gap-1 rounded-full ${info.color} px-2.5 py-0.5 text-[10px] font-bold`}>
                                {info.icon} {info.name}
                              </span>
                            </div>
                            <span className="text-xs font-bold text-slate-700">{count} uses</span>
                          </div>
                          <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span className="text-lg">⚡</span> Quick Actions
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {Object.entries(toolNames).map(([id, info]) => (
                  <button
                    key={id}
                    onClick={() => { onToolChange(id); scrollToTop(); }}
                    className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-3 hover:bg-purple-50 hover:border-purple-200 transition-all group text-left"
                  >
                    <span className="text-xl group-hover:scale-110 transition-transform">{info.icon}</span>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-slate-800 group-hover:text-purple-700">{info.name}</p>
                      <p className="text-[10px] text-slate-400">
                        {user.stats.toolsUsed[id] ? `Used ${user.stats.toolsUsed[id]} times` : 'Not used yet'}
                      </p>
                    </div>
                    <svg className="h-4 w-4 text-slate-300 group-hover:text-purple-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Most Used Tool Highlight */}
          {mostUsedTool && (
            <div className="rounded-2xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 p-6 mb-8">
              <div className="flex items-center gap-4">
                <div className="text-4xl">{toolNames[mostUsedTool[0]]?.icon || '🔧'}</div>
                <div>
                  <p className="text-xs font-bold text-purple-600 uppercase tracking-wider">Your Favorite Tool</p>
                  <p className="text-xl font-extrabold text-slate-900">{toolNames[mostUsedTool[0]]?.name || mostUsedTool[0]}</p>
                  <p className="text-sm text-slate-500">Used {mostUsedTool[1]} times</p>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Activity Tab */}
      {activeTab === 'activity' && (
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <span className="text-xl">📋</span> Recent Activity
          </h3>

          <div className="space-y-4">
            {/* Account Created */}
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                  <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                  </svg>
                </div>
                <div className="w-px flex-1 bg-slate-200 mt-2" />
              </div>
              <div className="pb-6">
                <p className="text-sm font-bold text-slate-900">Account Created</p>
                <p className="text-xs text-slate-500 mt-0.5">{joinedDate}</p>
                <p className="text-xs text-slate-400 mt-1">Welcome to ImageTools! Your journey begins.</p>
              </div>
            </div>

            {/* Tool Usage Events */}
            {Object.entries(user.stats.toolsUsed).map(([tool, count]) => {
              const info = toolNames[tool] || { name: tool, icon: '🔧', color: 'bg-slate-100 text-slate-700' };
              return (
                <div key={tool} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                      <span className="text-lg">{info.icon}</span>
                    </div>
                    <div className="w-px flex-1 bg-slate-200 mt-2" />
                  </div>
                  <div className="pb-6">
                    <p className="text-sm font-bold text-slate-900">Used {info.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{count} times total</p>
                  </div>
                </div>
              );
            })}

            {/* Last Active */}
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                  <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Last Active</p>
                <p className="text-xs text-slate-500 mt-0.5">{lastActiveDate}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          {/* Profile Settings */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <svg className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
              Profile Settings
            </h3>

            {/* Success Message */}
            {saveSuccess && (
              <div className="mb-6 flex items-center gap-2 rounded-xl bg-green-50 border border-green-200 p-3">
                <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm font-medium text-green-700">Profile updated successfully!</p>
              </div>
            )}

            <div className="space-y-5">
              {/* Avatar Preview */}
              <div className="flex items-center gap-4">
                <img src={user.avatar || ''} alt={user.name} className="h-16 w-16 rounded-2xl ring-2 ring-purple-100" />
                <div>
                  <p className="text-xs text-slate-500">Your avatar is generated from your name initials.</p>
                  <p className="text-[10px] text-slate-400">Change your name to update the avatar.</p>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Display Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  className="w-full max-w-md rounded-xl border border-slate-200 bg-slate-50 py-3 px-4 text-sm text-slate-900 focus:border-purple-400 focus:bg-white focus:ring-2 focus:ring-purple-100 outline-none transition-all"
                />
              </div>

              {/* Email (read-only) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  value={user.email}
                  readOnly
                  className="w-full max-w-md rounded-xl border border-slate-200 bg-slate-100 py-3 px-4 text-sm text-slate-500 cursor-not-allowed"
                />
                <p className="text-[10px] text-slate-400 mt-1">Email cannot be changed.</p>
              </div>

              {/* Save Button */}
              <button
                onClick={handleSaveProfile}
                disabled={isSaving || editName === user.name}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-purple-200/50 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isSaving ? (
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                )}
                Save Changes
              </button>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="rounded-2xl border border-red-200 bg-red-50/50 p-6">
            <h3 className="text-lg font-bold text-red-800 mb-2 flex items-center gap-2">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              Danger Zone
            </h3>
            <p className="text-sm text-red-700/70 mb-4">
              These actions are irreversible. Please be certain.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to sign out?')) {
                    logout();
                  }
                }}
                className="flex items-center gap-2 rounded-xl border border-red-300 bg-white px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 transition-all"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                </svg>
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
