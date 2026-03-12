import { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './components/HomePage';
import { PngToJpg } from './components/PngToJpg';
import { CompressImage } from './components/CompressImage';
import { ResizeImage } from './components/ResizeImage';
import { RemoveBackground } from './components/RemoveBackground';
import { TextToImage } from './components/TextToImage';
import { AuthModal } from './components/AuthModal';
import { ProfilePage } from './components/ProfilePage';

type Tool = 'home' | 'converter' | 'compress' | 'resize' | 'removebg' | 'texttoimage' | 'profile';

function AppContent() {
  const [activeTool, setActiveTool] = useState<Tool>('home');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  const openAuth = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50/30">
      <Header activeTool={activeTool} onToolChange={setActiveTool} onOpenAuth={openAuth} />
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} initialMode={authMode} />

      <main>
        {/* ─── Homepage ─── */}
        {activeTool === 'home' && (
          <HomePage onToolChange={setActiveTool} />
        )}

        {/* ─── Profile/Dashboard ─── */}
        {activeTool === 'profile' && (
          <ProfilePage onToolChange={(tool) => setActiveTool(tool as Tool)} />
        )}

        {/* ─── Tool Pages Container ─── */}
        {activeTool !== 'home' && (
        <div className="mx-auto max-w-6xl px-4 py-10">
        {/* ─── PNG to JPG Converter ─── */}
        {activeTool === 'converter' && (
          <>
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
                Convert <span className="text-blue-600">PNG</span> to{' '}
                <span className="text-indigo-600">JPG</span> Online
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-base text-slate-500">
                Fast, free, and private. Your images never leave your browser — all conversion
                happens right on your device. No uploads, no servers, no limits.
              </p>
              <div className="mt-5 flex flex-wrap items-center justify-center gap-3 text-sm text-slate-500">
                {[
                  { icon: '🔒', text: 'Private & Secure' },
                  { icon: '⚡', text: 'Instant Conversion' },
                  { icon: '📦', text: 'Batch Support' },
                  { icon: '🎨', text: 'Custom Quality' },
                ].map((feature) => (
                  <div
                    key={feature.text}
                    className="flex items-center gap-1.5 rounded-full bg-white px-4 py-2 shadow-sm border border-slate-100"
                  >
                    <span>{feature.icon}</span>
                    <span className="font-medium">{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <PngToJpg />

            <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100">
                  <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-slate-800">100% Private</h3>
                <p className="mt-1 text-sm text-slate-500">Your images are processed entirely in your browser. Nothing is ever uploaded to any server.</p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100">
                  <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-slate-800">Lightning Fast</h3>
                <p className="mt-1 text-sm text-slate-500">No waiting for uploads or downloads. Conversion is instant using your device's processing power.</p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100">
                  <svg className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-slate-800">Full Control</h3>
                <p className="mt-1 text-sm text-slate-500">Adjust JPG quality, set custom background colors for transparency, and batch convert multiple files.</p>
              </div>
            </div>

            <div className="mt-16 mb-12">
              <h3 className="text-center text-xl font-bold text-slate-800 mb-8">How It Works</h3>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
                {[
                  { step: '1', title: 'Upload', desc: 'Drop or select PNG files' },
                  { step: '2', title: 'Adjust', desc: 'Set quality & options' },
                  { step: '3', title: 'Convert', desc: 'Click convert button' },
                  { step: '4', title: 'Download', desc: 'Save your JPG files' },
                ].map((item) => (
                  <div key={item.step} className="flex items-center gap-4 sm:flex-col sm:gap-2 sm:text-center">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-sm font-bold text-white shadow-md">
                      {item.step}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">{item.title}</p>
                      <p className="text-xs text-slate-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ─── Compress Image ─── */}
        {activeTool === 'compress' && (
          <>
            <div className="mb-8 text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-1.5 mb-4">
                <svg className="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
                </svg>
                <span className="text-xs font-semibold text-emerald-700">Image Compressor</span>
              </div>
              <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
                <span className="text-emerald-600">Compress</span>{' '}
                <span className="text-teal-600">Images</span> Online
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-base text-slate-500">
                Reduce image file sizes without losing quality. Supports JPG, PNG, WebP, and more.
                All compression happens locally in your browser — your images never leave your device.
              </p>
              <div className="mt-5 flex flex-wrap items-center justify-center gap-3 text-sm text-slate-500">
                {[
                  { icon: '🗜️', text: 'Smart Compression' },
                  { icon: '📐', text: 'Resize Options' },
                  { icon: '🔄', text: 'Format Conversion' },
                  { icon: '📦', text: 'Batch Processing' },
                ].map((feature) => (
                  <div key={feature.text} className="flex items-center gap-1.5 rounded-full bg-white px-4 py-2 shadow-sm border border-slate-100">
                    <span>{feature.icon}</span>
                    <span className="font-medium">{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <CompressImage />

            <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100">
                  <svg className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-slate-800">Smart Compression</h3>
                <p className="mt-1 text-sm text-slate-500">Advanced compression algorithms reduce file size while maintaining visual quality.</p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-teal-100">
                  <svg className="h-6 w-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 3.75H6A2.25 2.25 0 003.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0120.25 6v1.5m0 9V18A2.25 2.25 0 0118 20.25h-1.5m-9 0H6A2.25 2.25 0 013.75 18v-1.5M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-slate-800">Resize & Convert</h3>
                <p className="mt-1 text-sm text-slate-500">Optionally resize images and convert between JPG, PNG, and WebP formats.</p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-100">
                  <svg className="h-6 w-6 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-slate-800">100% Private</h3>
                <p className="mt-1 text-sm text-slate-500">Your images never leave your device. All compression is done locally — no server uploads, ever.</p>
              </div>
            </div>

            <div className="mt-16 mb-12">
              <h3 className="text-center text-xl font-bold text-slate-800 mb-8">How It Works</h3>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
                {[
                  { step: '1', title: 'Upload', desc: 'Drop or select any image' },
                  { step: '2', title: 'Configure', desc: 'Set quality & dimensions' },
                  { step: '3', title: 'Compress', desc: 'Click compress button' },
                  { step: '4', title: 'Download', desc: 'Save compressed files' },
                ].map((item) => (
                  <div key={item.step} className="flex items-center gap-4 sm:flex-col sm:gap-2 sm:text-center">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-600 to-teal-600 text-sm font-bold text-white shadow-md">
                      {item.step}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">{item.title}</p>
                      <p className="text-xs text-slate-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ─── Resize Image ─── */}
        {activeTool === 'resize' && (
          <>
            <div className="mb-8 text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-rose-100 px-4 py-1.5 mb-4">
                <svg className="h-4 w-4 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                </svg>
                <span className="text-xs font-semibold text-rose-700">Image Resizer</span>
              </div>
              <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
                <span className="text-rose-600">Resize</span>{' '}
                <span className="text-orange-600">Images</span> Online
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-base text-slate-500">
                Resize JPG, PNG, SVG or GIF by defining new height and width pixels.
                Change image dimensions in bulk. All processing happens in your browser — fast, free, and private.
              </p>
              <div className="mt-5 flex flex-wrap items-center justify-center gap-3 text-sm text-slate-500">
                {[
                  { icon: '📐', text: 'Custom Dimensions' },
                  { icon: '📊', text: 'Resize by Percentage' },
                  { icon: '🖼️', text: 'Social Presets' },
                  { icon: '📦', text: 'Bulk Resize' },
                ].map((feature) => (
                  <div key={feature.text} className="flex items-center gap-1.5 rounded-full bg-white px-4 py-2 shadow-sm border border-slate-100">
                    <span>{feature.icon}</span>
                    <span className="font-medium">{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <ResizeImage />

            <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-rose-100">
                  <svg className="h-6 w-6 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-slate-800">Flexible Resize Modes</h3>
                <p className="mt-1 text-sm text-slate-500">Resize by exact pixels, percentage, fit within bounds, or fill & crop. Lock or unlock aspect ratio as needed.</p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100">
                  <svg className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-slate-800">Ready-Made Presets</h3>
                <p className="mt-1 text-sm text-slate-500">One-click presets for Instagram, Facebook, Twitter, YouTube, HD, 4K, print sizes, and more.</p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100">
                  <svg className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12H9.75m0 0l2.25-2.25M9.75 18l2.25 2.25M3.375 7.5A2.625 2.625 0 016 4.875h2.25A2.625 2.625 0 0110.875 7.5v1.875a2.625 2.625 0 01-2.625 2.625H6A2.625 2.625 0 013.375 9.375V7.5z" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-slate-800">Batch Processing</h3>
                <p className="mt-1 text-sm text-slate-500">Upload multiple images and resize them all at once to the same dimensions. Download individually or all at once.</p>
              </div>
            </div>

            <div className="mt-16 mb-12">
              <h3 className="text-center text-xl font-bold text-slate-800 mb-8">How It Works</h3>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
                {[
                  { step: '1', title: 'Upload', desc: 'Drop or select images' },
                  { step: '2', title: 'Set Size', desc: 'Choose dimensions or preset' },
                  { step: '3', title: 'Resize', desc: 'Click resize button' },
                  { step: '4', title: 'Download', desc: 'Save resized images' },
                ].map((item) => (
                  <div key={item.step} className="flex items-center gap-4 sm:flex-col sm:gap-2 sm:text-center">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-rose-600 to-orange-600 text-sm font-bold text-white shadow-md">
                      {item.step}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">{item.title}</p>
                      <p className="text-xs text-slate-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ─── Remove Background ─── */}
        {activeTool === 'removebg' && (
          <>
            <div className="mb-8 text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-100 to-purple-100 px-4 py-1.5 mb-4">
                <svg className="h-4 w-4 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
                </svg>
                <span className="text-xs font-semibold text-violet-700">AI Background Remover</span>
                <span className="rounded-full bg-gradient-to-r from-violet-600 to-purple-600 px-2 py-0.5 text-[9px] font-bold text-white">
                  AI POWERED
                </span>
              </div>
              <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
                <span className="text-violet-600">Remove</span>{' '}
                <span className="text-purple-600">Background</span> Online
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-base text-slate-500">
                Cut out image backgrounds with exceptional quality. Uses AI-powered remove.bg API for
                professional results, plus client-side tools for offline use. Supports JPG, PNG, and WebP.
              </p>
              <div className="mt-5 flex flex-wrap items-center justify-center gap-3 text-sm text-slate-500">
                {[
                  { icon: '🤖', text: 'AI-Powered' },
                  { icon: '✂️', text: 'Pixel-Perfect Edges' },
                  { icon: '🖼️', text: 'Transparent PNG' },
                  { icon: '📦', text: 'Batch Processing' },
                ].map((feature) => (
                  <div key={feature.text} className="flex items-center gap-1.5 rounded-full bg-white px-4 py-2 shadow-sm border border-slate-100">
                    <span>{feature.icon}</span>
                    <span className="font-medium">{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <RemoveBackground />

            <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100">
                  <svg className="h-6 w-6 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-slate-800">AI-Powered Removal</h3>
                <p className="mt-1 text-sm text-slate-500">Professional AI handles complex backgrounds, hair, fur, and semi-transparent objects with pixel-perfect edges.</p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100">
                  <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-slate-800">Multiple Modes</h3>
                <p className="mt-1 text-sm text-slate-500">Choose AI mode for best results, auto-detect for solid backgrounds, or manual pick for precise color selection.</p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-fuchsia-100">
                  <svg className="h-6 w-6 text-fuchsia-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-slate-800">Transparent PNG Output</h3>
                <p className="mt-1 text-sm text-slate-500">Download results as transparent PNG files, ready for use in designs, presentations, and e-commerce listings.</p>
              </div>
            </div>

            <div className="mt-16 mb-12">
              <h3 className="text-center text-xl font-bold text-slate-800 mb-8">How It Works</h3>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
                {[
                  { step: '1', title: 'Upload', desc: 'Drop or select an image' },
                  { step: '2', title: 'Choose Mode', desc: 'AI, Auto, or Manual' },
                  { step: '3', title: 'Process', desc: 'Background is removed' },
                  { step: '4', title: 'Download', desc: 'Save transparent PNG' },
                ].map((item) => (
                  <div key={item.step} className="flex items-center gap-4 sm:flex-col sm:gap-2 sm:text-center">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-purple-600 text-sm font-bold text-white shadow-md">
                      {item.step}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">{item.title}</p>
                      <p className="text-xs text-slate-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ─── Text to Image ─── */}
        {activeTool === 'texttoimage' && (
          <>
            <div className="mb-8 text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-100 to-rose-100 px-4 py-1.5 mb-4">
                <svg className="h-4 w-4 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
                </svg>
                <span className="text-xs font-semibold text-pink-700">AI Image Generator</span>
                <span className="rounded-full bg-gradient-to-r from-pink-600 to-rose-600 px-2 py-0.5 text-[9px] font-bold text-white">
                  HUGGINGFACE
                </span>
              </div>
              <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
                <span className="text-pink-600">Text</span> to{' '}
                <span className="text-rose-600">Image</span> Generator
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-base text-slate-500">
                Generate stunning images from text descriptions using AI. Powered by HuggingFace with
                multiple models including Stable Diffusion XL and FLUX. Describe anything and watch AI bring it to life.
              </p>
              <div className="mt-5 flex flex-wrap items-center justify-center gap-3 text-sm text-slate-500">
                {[
                  { icon: '🤖', text: 'Multiple AI Models' },
                  { icon: '🎨', text: 'Style Presets' },
                  { icon: '📐', text: 'Custom Dimensions' },
                  { icon: '⚡', text: 'Fast Generation' },
                ].map((feature) => (
                  <div key={feature.text} className="flex items-center gap-1.5 rounded-full bg-white px-4 py-2 shadow-sm border border-slate-100">
                    <span>{feature.icon}</span>
                    <span className="font-medium">{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <TextToImage />

            <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-pink-100">
                  <svg className="h-6 w-6 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-slate-800">Multiple AI Models</h3>
                <p className="mt-1 text-sm text-slate-500">Choose from SDXL, FLUX.1 Schnell, FLUX.1 Dev, SD 2.1, SD 1.5, and more for different styles and speeds.</p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-rose-100">
                  <svg className="h-6 w-6 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 003.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008z" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-slate-800">Style Presets</h3>
                <p className="mt-1 text-sm text-slate-500">12 built-in style presets including Photorealistic, Digital Art, Anime, Oil Painting, and more.</p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100">
                  <svg className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-slate-800">Full Control</h3>
                <p className="mt-1 text-sm text-slate-500">Customize dimensions, inference steps, guidance scale, and negative prompts for precise control over your output.</p>
              </div>
            </div>

            <div className="mt-16 mb-12">
              <h3 className="text-center text-xl font-bold text-slate-800 mb-8">How It Works</h3>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
                {[
                  { step: '1', title: 'Describe', desc: 'Type what you want to see' },
                  { step: '2', title: 'Customize', desc: 'Pick model, style & size' },
                  { step: '3', title: 'Generate', desc: 'AI creates your image' },
                  { step: '4', title: 'Download', desc: 'Save your creation' },
                ].map((item) => (
                  <div key={item.step} className="flex items-center gap-4 sm:flex-col sm:gap-2 sm:text-center">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-pink-600 to-rose-600 text-sm font-bold text-white shadow-md">
                      {item.step}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">{item.title}</p>
                      <p className="text-xs text-slate-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Available Models */}
            <div className="mb-12 rounded-2xl border border-pink-100 bg-gradient-to-br from-pink-50/50 to-rose-50/50 p-6">
              <h3 className="text-center text-lg font-bold text-slate-800 mb-6">🤖 Available AI Models</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: 'Stable Diffusion XL', desc: 'High-quality, versatile generation up to 1024×1024', icon: '🎨', tag: 'Popular' },
                  { name: 'FLUX.1 Schnell', desc: 'Ultra-fast generation in just 4 steps', icon: '🚀', tag: 'Fastest' },
                  { name: 'FLUX.1 Dev', desc: 'Higher quality FLUX with more detail', icon: '🔬', tag: 'Quality' },
                  { name: 'SD 2.1', desc: 'Improved quality and better compositions', icon: '🖼️', tag: 'Reliable' },
                  { name: 'SD 1.5', desc: 'Classic model with vast community support', icon: '⚡', tag: 'Classic' },
                  { name: 'SD 1.4', desc: 'Lightweight original stable diffusion', icon: '📦', tag: 'Legacy' },
                ].map((model) => (
                  <div key={model.name} className="rounded-xl bg-white/80 border border-white p-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">{model.icon}</span>
                      <h4 className="text-sm font-bold text-slate-800">{model.name}</h4>
                      <span className="rounded-full bg-pink-100 px-2 py-0.5 text-[9px] font-bold text-pink-700">{model.tag}</span>
                    </div>
                    <p className="text-xs text-slate-500">{model.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div className="mb-12 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <h3 className="text-center text-lg font-bold text-slate-800 mb-6">💡 Tips for Better Results</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { title: 'Be Descriptive', desc: 'The more detail in your prompt, the better. Describe subjects, lighting, style, colors, and atmosphere.' },
                  { title: 'Use Style Presets', desc: 'Style presets add quality-boosting keywords automatically. Try "Photorealistic" or "Digital Art" for better results.' },
                  { title: 'Try FLUX for Speed', desc: 'FLUX.1 Schnell generates in just 4 steps — perfect for quick iterations and testing prompt ideas.' },
                  { title: 'Use Negative Prompts', desc: 'Tell the AI what to avoid. Common negatives: blurry, low quality, watermark, deformed, ugly.' },
                  { title: 'Adjust Guidance Scale', desc: 'Higher values (7-12) follow your prompt more strictly. Lower values (3-5) give more creative freedom.' },
                  { title: 'Experiment with Models', desc: 'Each model has strengths. SDXL for quality, SD 1.5 for variety, FLUX for speed and modern aesthetics.' },
                ].map((tip) => (
                  <div key={tip.title} className="flex gap-3 rounded-xl bg-pink-50/50 border border-pink-100 p-4">
                    <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-pink-100">
                      <svg className="h-3.5 w-3.5 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-800">{tip.title}</h4>
                      <p className="mt-1 text-xs text-slate-500">{tip.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
        </div>
        )}
      </main>

      <Footer onToolChange={setActiveTool} />
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
