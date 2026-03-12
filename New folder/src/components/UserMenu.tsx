import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface UserMenuProps {
  onOpenProfile: () => void;
}

export function UserMenu({ onOpenProfile }: UserMenuProps) {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  const menuItems = [
    {
      label: 'Dashboard',
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
        </svg>
      ),
      onClick: () => { onOpenProfile(); setIsOpen(false); },
    },
    {
      label: 'Settings',
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      onClick: () => { onOpenProfile(); setIsOpen(false); },
    },
  ];

  return (
    <div className="relative" ref={menuRef}>
      {/* Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 hover:bg-slate-50 hover:border-slate-300 transition-all group"
      >
        <img
          src={user.avatar || ''}
          alt={user.name}
          className="h-8 w-8 rounded-full ring-2 ring-purple-100 group-hover:ring-purple-200 transition-all"
        />
        <div className="hidden sm:block text-left">
          <p className="text-xs font-bold text-slate-800 leading-tight">{user.name}</p>
          <p className="text-[10px] text-slate-400 leading-tight">{user.plan === 'pro' ? '⭐ Pro' : 'Free Plan'}</p>
        </div>
        <svg className={`h-3.5 w-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-slate-200/80 bg-white shadow-2xl shadow-slate-200/50 overflow-hidden z-50">
          {/* User Info */}
          <div className="bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-pink-600/5 p-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <img src={user.avatar || ''} alt={user.name} className="h-12 w-12 rounded-full ring-2 ring-white shadow-md" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
                <p className="text-xs text-slate-500 truncate">{user.email}</p>
                <div className="mt-1 inline-flex items-center gap-1 rounded-full bg-purple-100 px-2 py-0.5">
                  <span className="text-[9px] font-bold text-purple-700 uppercase">
                    {user.plan === 'pro' ? '⭐ Pro Plan' : '🆓 Free Plan'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-px bg-slate-100 border-b border-slate-100">
            <div className="bg-white p-3 text-center">
              <p className="text-lg font-extrabold text-purple-600">{user.stats.imagesProcessed}</p>
              <p className="text-[10px] text-slate-400 font-medium">Images Processed</p>
            </div>
            <div className="bg-white p-3 text-center">
              <p className="text-lg font-extrabold text-blue-600">{Object.keys(user.stats.toolsUsed).length}</p>
              <p className="text-[10px] text-slate-400 font-medium">Tools Used</p>
            </div>
          </div>

          {/* Menu Items */}
          <div className="p-2">
            {menuItems.map((item) => (
              <button
                key={item.label}
                onClick={item.onClick}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-purple-700 transition-colors"
              >
                <span className="text-slate-400">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>

          {/* Logout */}
          <div className="border-t border-slate-100 p-2">
            <button
              onClick={() => { logout(); setIsOpen(false); }}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
              </svg>
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
