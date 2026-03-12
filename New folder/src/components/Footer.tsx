interface FooterProps {
  onToolChange: (tool: 'home' | 'converter' | 'compress' | 'resize' | 'removebg' | 'texttoimage' | 'profile') => void;
}

export function Footer({ onToolChange }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const tools = [
    { id: 'converter' as const, name: 'PNG to JPG Converter', desc: 'Convert PNG images to JPG' },
    { id: 'compress' as const, name: 'Compress Image', desc: 'Reduce image file size' },
    { id: 'resize' as const, name: 'Resize Image', desc: 'Change image dimensions' },
    { id: 'removebg' as const, name: 'Remove Background', desc: 'AI background removal' },
    { id: 'texttoimage' as const, name: 'Text to Image', desc: 'AI image generation' },
  ];

  const formats = [
    'JPG / JPEG', 'PNG', 'WebP', 'GIF', 'BMP', 'SVG', 'TIFF',
  ];

  const features = [
    'Batch Processing',
    'Drag & Drop Upload',
    'Quality Control',
    'Custom Dimensions',
    'Social Media Presets',
    'AI-Powered Tools',
    'No Watermarks',
    'Unlimited Usage',
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative border-t border-slate-200/80 bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Wave Divider */}
      <div className="absolute -top-px left-0 right-0 overflow-hidden leading-[0]">
        <svg className="relative block w-full h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 10" preserveAspectRatio="none">
          <path d="M0,10 C150,2 350,0 600,6 C850,12 1050,2 1200,10 L1200,0 L0,0 Z" fill="white" />
        </svg>
      </div>

      {/* Newsletter / CTA Section */}
      <div className="mx-auto max-w-6xl px-4 pt-12 pb-8">
        <div className="rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-8 md:p-10 shadow-xl shadow-purple-200/30 mb-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-xl md:text-2xl font-bold text-white">
                Free Image Tools — No Sign-Up Required
              </h3>
              <p className="mt-2 text-sm text-white/80 max-w-lg">
                Convert, compress, resize, remove backgrounds, and generate images — all in your browser.
                No registration, no limits, no watermarks. Start editing now!
              </p>
            </div>
            <button
              onClick={() => { onToolChange('home'); scrollToTop(); }}
              className="flex items-center gap-2 whitespace-nowrap rounded-xl bg-white px-6 py-3 text-sm font-bold text-purple-700 shadow-lg hover:shadow-xl hover:bg-purple-50 transition-all transform hover:scale-105"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
              </svg>
              Get Started Free
            </button>
          </div>
        </div>

        {/* Main Footer Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {/* About Column */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 shadow-md">
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                </svg>
              </div>
              <div>
                <h4 className="text-base font-extrabold text-slate-900">
                  Image<span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Tools</span>
                </h4>
              </div>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed mb-5">
              Free online image editing suite with AI-powered tools. Convert, compress, resize, remove backgrounds, and generate images — all in your browser.
            </p>
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-1.5 rounded-full bg-green-50 border border-green-200/60 px-3 py-1">
                <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] font-bold text-green-700 uppercase">Online</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-200/60 px-3 py-1">
                <svg className="h-3 w-3 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
                <span className="text-[10px] font-bold text-blue-700 uppercase">Secure</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-full bg-purple-50 border border-purple-200/60 px-3 py-1">
                <svg className="h-3 w-3 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
                <span className="text-[10px] font-bold text-purple-700 uppercase">AI</span>
              </div>
            </div>
          </div>

          {/* Tools Column */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4 flex items-center gap-2">
              <svg className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-5.648-3.014A2.25 2.25 0 013 10.02V6.75m8.42 8.42a2.25 2.25 0 002.16 0l5.648-3.014A2.25 2.25 0 0021 10.02V6.75M12 12.75l8.588-4.587A2.25 2.25 0 0021 6.75V6.75a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6.75v0c0 .832.458 1.596 1.189 1.988L12 12.75z" />
              </svg>
              Our Tools
            </h4>
            <ul className="space-y-2.5">
              {tools.map((tool) => (
                <li key={tool.id}>
                  <button
                    onClick={() => { onToolChange(tool.id); scrollToTop(); }}
                    className="group flex items-start gap-2 text-left"
                  >
                    <svg className="h-4 w-4 mt-0.5 text-slate-300 group-hover:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                    <div>
                      <span className="text-sm text-slate-600 group-hover:text-blue-600 font-medium transition-colors">
                        {tool.name}
                      </span>
                      {(tool.id === 'removebg' || tool.id === 'texttoimage') && (
                        <span className="ml-1.5 inline-block rounded-full bg-purple-100 px-1.5 py-0.5 text-[8px] font-bold text-purple-700 align-middle">AI</span>
                      )}
                      <p className="text-[11px] text-slate-400">{tool.desc}</p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Formats Column */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4 flex items-center gap-2">
              <svg className="h-4 w-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
              Supported Formats
            </h4>
            <ul className="space-y-2">
              {formats.map((format) => (
                <li key={format} className="flex items-center gap-2 text-sm text-slate-500">
                  <svg className="h-3.5 w-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  {format}
                </li>
              ))}
            </ul>
          </div>

          {/* Features Column */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4 flex items-center gap-2">
              <svg className="h-4 w-4 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
              </svg>
              Features
            </h4>
            <ul className="space-y-2">
              {features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm text-slate-500">
                  <svg className="h-3.5 w-3.5 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Tech Stack / Powered By */}
        <div className="mt-12 pt-8 border-t border-slate-200/80">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3">Powered By</p>
              <div className="flex flex-wrap items-center gap-3">
                {[
                  { name: 'Canvas API', icon: '🎨', desc: 'Image Processing' },
                  { name: 'HuggingFace', icon: '🤗', desc: 'AI Generation' },
                  { name: 'remove.bg', icon: '✂️', desc: 'BG Removal' },
                  { name: 'React', icon: '⚛️', desc: 'UI Framework' },
                ].map((tech) => (
                  <div key={tech.name} className="flex items-center gap-2 rounded-lg bg-white border border-slate-200/80 px-3 py-2 shadow-sm">
                    <span className="text-base">{tech.icon}</span>
                    <div>
                      <p className="text-[11px] font-bold text-slate-700">{tech.name}</p>
                      <p className="text-[9px] text-slate-400">{tech.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col items-center md:items-end gap-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Quick Access</p>
              <div className="flex flex-wrap gap-2">
                {tools.map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => { onToolChange(tool.id); scrollToTop(); }}
                    className="rounded-lg bg-white border border-slate-200/80 px-3 py-1.5 text-[11px] font-semibold text-slate-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm"
                  >
                    {tool.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-slate-200/80">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
              <p className="text-xs text-slate-400">
                © {currentYear} <span className="font-semibold text-slate-500">ImageTools</span>. All rights reserved.
              </p>
              <div className="hidden sm:block h-3 w-px bg-slate-200" />
              <p className="text-[11px] text-slate-400">
                Free online image editing tools for everyone.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={scrollToTop}
                className="flex items-center gap-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
                </svg>
                Back to Top
              </button>
            </div>
          </div>

          {/* Privacy Notice */}
          <div className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-blue-50/50 border border-blue-100 px-4 py-3">
            <svg className="h-4 w-4 text-blue-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
            <p className="text-[11px] text-blue-600 font-medium">
              <strong>Privacy First:</strong> Most tools process images directly in your browser. Your files are never stored on our servers.
              AI features (Remove Background &amp; Text to Image) use secure API connections for processing.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
