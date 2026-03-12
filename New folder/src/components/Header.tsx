import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { UserMenu } from './UserMenu';

interface HeaderProps {
  activeTool: 'home' | 'converter' | 'compress' | 'resize' | 'removebg' | 'texttoimage' | 'profile';
  onToolChange: (tool: 'home' | 'converter' | 'compress' | 'resize' | 'removebg' | 'texttoimage' | 'profile') => void;
  onOpenAuth: (mode: 'login' | 'signup') => void;
}

export function Header({ activeTool, onToolChange, onOpenAuth }: HeaderProps) {
  const { user, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const tabs = [
    {
      id: 'home' as const,
      label: 'Home',
      shortLabel: 'Home',
      description: 'Overview of all image tools',
      activeColor: 'border-purple-600 text-purple-700 bg-purple-50/80',
      mobileBg: 'bg-purple-50 border-purple-200',
      mobileText: 'text-purple-700',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
      ),
    },
    {
      id: 'converter' as const,
      label: 'PNG to JPG',
      shortLabel: 'Convert',
      description: 'Convert PNG images to JPG format',
      activeColor: 'border-blue-600 text-blue-700 bg-blue-50/80',
      mobileBg: 'bg-blue-50 border-blue-200',
      mobileText: 'text-blue-700',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182M21.015 4.356v4.992" />
        </svg>
      ),
    },
    {
      id: 'compress' as const,
      label: 'Compress Image',
      shortLabel: 'Compress',
      description: 'Reduce image file size',
      activeColor: 'border-emerald-600 text-emerald-700 bg-emerald-50/80',
      mobileBg: 'bg-emerald-50 border-emerald-200',
      mobileText: 'text-emerald-700',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
        </svg>
      ),
    },
    {
      id: 'resize' as const,
      label: 'Resize Image',
      shortLabel: 'Resize',
      description: 'Change image dimensions',
      activeColor: 'border-rose-600 text-rose-700 bg-rose-50/80',
      mobileBg: 'bg-rose-50 border-rose-200',
      mobileText: 'text-rose-700',
      iconBg: 'bg-rose-100',
      iconColor: 'text-rose-600',
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
        </svg>
      ),
    },
    {
      id: 'removebg' as const,
      label: 'Remove Background',
      shortLabel: 'Remove BG',
      description: 'AI-powered background removal',
      activeColor: 'border-violet-600 text-violet-700 bg-violet-50/80',
      mobileBg: 'bg-violet-50 border-violet-200',
      mobileText: 'text-violet-700',
      iconBg: 'bg-violet-100',
      iconColor: 'text-violet-600',
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
        </svg>
      ),
    },
    {
      id: 'texttoimage' as const,
      label: 'Text to Image',
      shortLabel: 'Generate',
      description: 'AI image generation',
      activeColor: 'border-pink-600 text-pink-700 bg-pink-50/80',
      mobileBg: 'bg-pink-50 border-pink-200',
      mobileText: 'text-pink-700',
      iconBg: 'bg-pink-100',
      iconColor: 'text-pink-600',
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
        </svg>
      ),
    },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl shadow-sm">
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex items-center justify-center gap-4 py-1.5 text-xs text-white/90">
            <div className="flex items-center gap-1.5">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
              <span className="font-medium">100% Free</span>
            </div>
            <span className="hidden sm:inline text-white/40">•</span>
            <div className="hidden sm:flex items-center gap-1.5">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
              <span className="font-medium">Private & Secure</span>
            </div>
            <span className="hidden sm:inline text-white/40">•</span>
            <div className="hidden sm:flex items-center gap-1.5">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
              </svg>
              <span className="font-medium">No Sign-Up Required</span>
            </div>
            <span className="hidden md:inline text-white/40">•</span>
            <div className="hidden md:flex items-center gap-1.5">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
              <span className="font-medium">AI-Powered Tools</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex items-center justify-between py-3">
          {/* Logo */}
          <button
            onClick={() => onToolChange('home')}
            className="flex items-center gap-3 group"
          >
            <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 shadow-lg shadow-purple-200/50 group-hover:shadow-purple-300/60 transition-shadow">
              <svg
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.8}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z"
                />
              </svg>
              <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-green-400 border-2 border-white" />
            </div>
            <div className="text-left">
              <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
                Image<span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Tools</span>
              </h1>
              <p className="text-[10px] font-medium text-slate-400 tracking-wide uppercase">Free Online Image Editor</p>
            </div>
          </button>

          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/60 px-3.5 py-1.5">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-semibold text-green-700">Online</span>
            </div>
            {isAuthenticated && user ? (
              <UserMenu onOpenProfile={() => onToolChange('profile')} />
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenAuth('login')}
                  className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                  </svg>
                  Sign In
                </button>
                <button
                  onClick={() => onOpenAuth('signup')}
                  className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-purple-200/50 hover:shadow-lg hover:shadow-purple-300/50 transition-all"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                  </svg>
                  Sign Up Free
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex items-center justify-center h-10 w-10 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors"
          >
            {mobileMenuOpen ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            )}
          </button>
        </div>

        {/* Desktop Tool Navigation */}
        <div className="hidden md:flex gap-1 -mb-px overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onToolChange(tab.id)}
              className={`flex items-center gap-2 rounded-t-xl px-5 py-2.5 text-sm font-semibold transition-all border-b-2 whitespace-nowrap group ${
                activeTool === tab.id
                  ? `${tab.activeColor} shadow-sm`
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50/80'
              }`}
            >
              <span className={`transition-transform ${activeTool === tab.id ? 'scale-110' : 'group-hover:scale-105'}`}>
                {tab.icon}
              </span>
              <span>{tab.label}</span>
              {(tab.id === 'removebg' || tab.id === 'texttoimage') && (
                <span className={`rounded-full px-1.5 py-0.5 text-[8px] font-bold leading-none ${
                  activeTool === tab.id
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                    : 'bg-slate-100 text-slate-500 group-hover:bg-purple-100 group-hover:text-purple-600'
                }`}>
                  AI
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white shadow-lg">
          <div className="px-4 py-3 space-y-1.5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-2">Tools</p>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  onToolChange(tab.id);
                  setMobileMenuOpen(false);
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-all border ${
                  activeTool === tab.id
                    ? `${tab.mobileBg} ${tab.mobileText}`
                    : 'border-transparent text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                  activeTool === tab.id ? tab.iconBg : 'bg-slate-100'
                }`}>
                  <span className={activeTool === tab.id ? tab.iconColor : 'text-slate-500'}>
                    {tab.icon}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{tab.label}</span>
                    {(tab.id === 'removebg' || tab.id === 'texttoimage') && (
                      <span className="rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-1.5 py-0.5 text-[8px] font-bold text-white">AI</span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400">{tab.description}</p>
                </div>
                {activeTool === tab.id && (
                  <svg className={`h-5 w-5 ${tab.iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75" />
                  </svg>
                )}
              </button>
            ))}
            {/* Mobile Auth Buttons */}
            {isAuthenticated && user ? (
              <div className="mt-3 pt-3 border-t border-slate-100">
                <button
                  onClick={() => { onToolChange('profile'); setMobileMenuOpen(false); }}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100"
                >
                  <img src={user.avatar || ''} alt={user.name} className="h-10 w-10 rounded-full ring-2 ring-purple-200" />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-900">{user.name}</p>
                    <p className="text-[10px] text-slate-500">{user.email}</p>
                  </div>
                  <span className="rounded-full bg-purple-100 px-2 py-0.5 text-[9px] font-bold text-purple-700">
                    {user.plan === 'pro' ? '⭐ Pro' : 'Free'}
                  </span>
                </button>
              </div>
            ) : (
              <div className="mt-3 pt-3 border-t border-slate-100 space-y-2">
                <button
                  onClick={() => { onOpenAuth('login'); setMobileMenuOpen(false); }}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                  </svg>
                  Sign In
                </button>
                <button
                  onClick={() => { onOpenAuth('signup'); setMobileMenuOpen(false); }}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 py-3 text-sm font-bold text-white shadow-md transition-colors"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                  </svg>
                  Sign Up Free
                </button>
              </div>
            )}
            <div className="mt-3 flex items-center justify-center gap-3 pb-1">
              <div className="flex items-center gap-1.5 text-xs text-green-600">
                <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="font-medium">Online</span>
              </div>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-slate-400 font-medium">5 Free Tools</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
