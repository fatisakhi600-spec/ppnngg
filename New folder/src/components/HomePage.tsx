interface HomePageProps {
  onToolChange: (tool: 'converter' | 'compress' | 'resize' | 'removebg' | 'texttoimage' | 'profile') => void;
}

export function HomePage({ onToolChange }: HomePageProps) {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const tools = [
    {
      id: 'converter' as const,
      title: 'PNG to JPG Converter',
      desc: 'Convert PNG images to high-quality JPG format instantly. Adjust quality, set custom background colors for transparency, and batch convert multiple files at once.',
      icon: '🔄',
      gradient: 'from-blue-500 to-indigo-600',
      lightBg: 'bg-blue-50',
      lightBorder: 'border-blue-100',
      iconBg: 'bg-blue-100',
      textColor: 'text-blue-700',
      features: ['Adjustable Quality', 'Batch Convert', 'Custom BG Color', 'Instant Download'],
    },
    {
      id: 'compress' as const,
      title: 'Compress Image',
      desc: 'Reduce image file sizes by up to 90% without visible quality loss. Smart compression algorithms analyze your images and find the perfect balance between size and quality.',
      icon: '🗜️',
      gradient: 'from-emerald-500 to-teal-600',
      lightBg: 'bg-emerald-50',
      lightBorder: 'border-emerald-100',
      iconBg: 'bg-emerald-100',
      textColor: 'text-emerald-700',
      features: ['Up to 90% Smaller', 'Multi-Format', 'Quality Control', 'Resize Option'],
    },
    {
      id: 'resize' as const,
      title: 'Resize Image',
      desc: 'Resize JPG, PNG, SVG or GIF by defining new height and width pixels. Choose from 30+ presets for social media, print, and web, or set custom dimensions with aspect ratio lock.',
      icon: '📐',
      gradient: 'from-rose-500 to-orange-600',
      lightBg: 'bg-rose-50',
      lightBorder: 'border-rose-100',
      iconBg: 'bg-rose-100',
      textColor: 'text-rose-700',
      features: ['30+ Presets', 'Aspect Ratio Lock', 'Percentage Scale', 'Bulk Resize'],
    },
    {
      id: 'removebg' as const,
      title: 'Remove Background',
      desc: 'Cut out image backgrounds with exceptional quality using AI. Perfect for product photos, portraits, and design work. Get clean, transparent PNG output in seconds.',
      icon: '✂️',
      gradient: 'from-violet-500 to-purple-600',
      lightBg: 'bg-violet-50',
      lightBorder: 'border-violet-100',
      iconBg: 'bg-violet-100',
      textColor: 'text-violet-700',
      features: ['AI-Powered', 'Pixel-Perfect Edges', 'Transparent PNG', 'Multiple Modes'],
      ai: true,
    },
    {
      id: 'texttoimage' as const,
      title: 'Text to Image',
      desc: 'Generate stunning images from text descriptions using state-of-the-art AI models. Choose from SDXL, FLUX, and more with 12 style presets and full creative control.',
      icon: '🎨',
      gradient: 'from-pink-500 to-rose-600',
      lightBg: 'bg-pink-50',
      lightBorder: 'border-pink-100',
      iconBg: 'bg-pink-100',
      textColor: 'text-pink-700',
      features: ['6 AI Models', '12 Style Presets', 'Custom Dimensions', 'Negative Prompts'],
      ai: true,
    },
  ];

  const stats = [
    { value: '5', label: 'Free Tools', icon: '🛠️' },
    { value: '7+', label: 'Formats Supported', icon: '📁' },
    { value: '100%', label: 'Free Forever', icon: '💎' },
    { value: '0', label: 'Sign-ups Required', icon: '🚀' },
  ];

  const features = [
    {
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
        </svg>
      ),
      title: 'Privacy First',
      desc: 'Most tools process images entirely in your browser. Your files are never uploaded to any server — what happens on your device stays on your device.',
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
        </svg>
      ),
      title: 'Lightning Fast',
      desc: 'No waiting for uploads or server processing. Client-side tools deliver instant results using your device\'s computing power. AI tools use optimized APIs for speed.',
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
    {
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
        </svg>
      ),
      title: 'AI-Powered',
      desc: 'Advanced AI models power our background removal and image generation tools. Get professional results with the intelligence of machine learning behind every pixel.',
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
    {
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0l4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0l-5.571 3-5.571-3" />
        </svg>
      ),
      title: 'Batch Processing',
      desc: 'Process multiple images at once. Upload a batch, configure your settings once, and convert, compress, or resize them all simultaneously. Save hours of repetitive work.',
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
        </svg>
      ),
      title: 'Full Control',
      desc: 'Fine-tune every aspect of your output. Adjust quality, dimensions, format, compression level, and more. Professional-grade controls with a beginner-friendly interface.',
      color: 'text-rose-600',
      bg: 'bg-rose-50',
    },
    {
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
        </svg>
      ),
      title: 'Works Everywhere',
      desc: 'Use ImageTools on any device — desktop, tablet, or mobile. Our responsive design adapts to your screen. No app downloads, no plugins. Just open your browser and go.',
      color: 'text-cyan-600',
      bg: 'bg-cyan-50',
    },
  ];

  const faqs = [
    {
      q: 'Is ImageTools really free?',
      a: 'Yes! ImageTools is 100% free to use with no hidden costs, no watermarks, and no usage limits. All tools are available without creating an account.',
    },
    {
      q: 'Are my images safe and private?',
      a: 'Absolutely. Most of our tools (Convert, Compress, Resize) process images entirely in your browser — your files never leave your device. AI-powered tools (Remove Background, Text to Image) use encrypted API connections and do not store your images.',
    },
    {
      q: 'What image formats are supported?',
      a: 'We support all major formats including JPG/JPEG, PNG, WebP, GIF, BMP, SVG, and TIFF. Output options include JPG, PNG, and WebP depending on the tool.',
    },
    {
      q: 'Can I process multiple images at once?',
      a: 'Yes! All tools support batch processing. Upload multiple images, configure your settings once, and process them all simultaneously. You can download files individually or all at once.',
    },
    {
      q: 'How does the AI background removal work?',
      a: 'Our AI background remover uses the remove.bg API powered by advanced machine learning models. It can handle complex backgrounds, hair, fur, and semi-transparent objects with pixel-perfect accuracy. We also offer offline client-side modes for simpler backgrounds.',
    },
    {
      q: 'What AI models power the Text to Image generator?',
      a: 'We offer 6 AI models via HuggingFace including Stable Diffusion XL, FLUX.1 Schnell (ultra-fast), FLUX.1 Dev (high quality), SD 2.1, SD 1.5, and SD 1.4. Each model has unique strengths for different styles and use cases.',
    },
    {
      q: 'Do I need to install anything?',
      a: 'No installation required! ImageTools runs entirely in your web browser. Works on Chrome, Firefox, Safari, Edge, and any modern browser on desktop or mobile devices.',
    },
    {
      q: 'Is there a file size limit?',
      a: 'There\'s no strict file size limit for client-side tools. For AI-powered tools, images are optimized before sending to APIs. Generally, images up to 25MB work perfectly.',
    },
  ];

  const useCases = [
    {
      title: 'E-commerce & Product Photos',
      desc: 'Remove backgrounds, resize for marketplaces, and compress for fast loading.',
      icon: '🛍️',
    },
    {
      title: 'Social Media Content',
      desc: 'Resize to platform dimensions, compress for quick uploads, generate AI art.',
      icon: '📱',
    },
    {
      title: 'Web Development',
      desc: 'Optimize images for web performance with compression and format conversion.',
      icon: '💻',
    },
    {
      title: 'Graphic Design',
      desc: 'Remove backgrounds, convert formats, and resize for design projects.',
      icon: '🎨',
    },
    {
      title: 'Photography',
      desc: 'Batch resize photo collections, compress for storage, convert RAW exports.',
      icon: '📷',
    },
    {
      title: 'Marketing & Ads',
      desc: 'Create ad-sized images, generate AI visuals, and optimize for campaigns.',
      icon: '📣',
    },
  ];

  const formats = [
    { name: 'JPG / JPEG', desc: 'Most common photo format', color: 'bg-blue-100 text-blue-700' },
    { name: 'PNG', desc: 'Lossless with transparency', color: 'bg-green-100 text-green-700' },
    { name: 'WebP', desc: 'Modern web format', color: 'bg-purple-100 text-purple-700' },
    { name: 'GIF', desc: 'Animated images', color: 'bg-pink-100 text-pink-700' },
    { name: 'BMP', desc: 'Bitmap image format', color: 'bg-orange-100 text-orange-700' },
    { name: 'SVG', desc: 'Scalable vector graphics', color: 'bg-cyan-100 text-cyan-700' },
    { name: 'TIFF', desc: 'High-quality print format', color: 'bg-amber-100 text-amber-700' },
  ];

  return (
    <div>
      {/* ═══════════════════════ HERO SECTION ═══════════════════════ */}
      <section className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl" />
          <div className="absolute top-20 right-1/4 w-80 h-80 bg-purple-200/30 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-pink-200/20 rounded-full blur-3xl" />
        </div>

        <div className="mx-auto max-w-6xl px-4 pt-16 pb-20 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 border border-purple-200/40 px-5 py-2 mb-8">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-semibold text-purple-700">Free Online Image Tools — No Sign-Up Required</span>
            <svg className="h-4 w-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
            The Complete{' '}
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Image Toolkit
            </span>
            <br />
            <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-slate-700">
              Right in Your Browser
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mt-6 max-w-3xl text-lg sm:text-xl text-slate-500 leading-relaxed">
            Convert, compress, resize, remove backgrounds, and generate images with AI — all for free.
            No downloads, no sign-ups, no watermarks. Professional image editing made simple.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => { onToolChange('converter'); scrollToTop(); }}
              className="group flex items-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 px-8 py-4 text-base font-bold text-white shadow-xl shadow-purple-300/30 hover:shadow-2xl hover:shadow-purple-400/40 transition-all transform hover:scale-105"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
              </svg>
              Start Editing — It's Free
              <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </button>
            <a
              href="#tools"
              className="flex items-center gap-2 rounded-2xl border-2 border-slate-200 bg-white px-8 py-4 text-base font-bold text-slate-700 shadow-sm hover:border-purple-200 hover:bg-purple-50/50 hover:text-purple-700 transition-all"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9zm3.75 11.625a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
              Explore All Tools
            </a>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-400">
            {[
              { icon: '🔒', text: 'Secure & Private' },
              { icon: '⚡', text: 'Instant Processing' },
              { icon: '📦', text: 'Batch Support' },
              { icon: '🤖', text: 'AI-Powered' },
              { icon: '💯', text: 'No Watermarks' },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-1.5">
                <span>{item.icon}</span>
                <span className="font-medium">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════ STATS BAR ═══════════════════════ */}
      <section className="border-y border-slate-200/80 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl mb-1">{stat.icon}</div>
                <div className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm font-medium text-slate-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════ TOOLS SHOWCASE ═══════════════════════ */}
      <section id="tools" className="mx-auto max-w-6xl px-4 py-20">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 border border-blue-100 px-4 py-1.5 mb-4">
            <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-5.648-3.014A2.25 2.25 0 013 10.02V6.75m8.42 8.42a2.25 2.25 0 002.16 0l5.648-3.014A2.25 2.25 0 0021 10.02V6.75M12 12.75l8.588-4.587A2.25 2.25 0 0021 6.75V6.75a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6.75v0c0 .832.458 1.596 1.189 1.988L12 12.75z" />
            </svg>
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">Our Tools</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            Everything You Need for{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Image Editing
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-500">
            Five powerful tools, one simple interface. Whether you need to convert formats, reduce file sizes,
            change dimensions, remove backgrounds, or create AI art — we've got you covered.
          </p>
        </div>

        <div className="space-y-6">
          {tools.map((tool, index) => (
            <div
              key={tool.id}
              className={`group relative rounded-2xl border ${tool.lightBorder} ${tool.lightBg} p-6 md:p-8 hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden`}
              onClick={() => { onToolChange(tool.id); scrollToTop(); }}
            >
              {/* Background gradient accent */}
              <div className={`absolute top-0 ${index % 2 === 0 ? 'right-0' : 'left-0'} w-64 h-64 bg-gradient-to-br ${tool.gradient} opacity-5 rounded-full blur-3xl -z-0 group-hover:opacity-10 transition-opacity`} />

              <div className={`relative flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-6 md:gap-10`}>
                {/* Icon Section */}
                <div className="flex-shrink-0">
                  <div className={`flex h-20 w-20 md:h-28 md:w-28 items-center justify-center rounded-3xl bg-gradient-to-br ${tool.gradient} shadow-lg text-4xl md:text-5xl`}>
                    {tool.icon}
                  </div>
                </div>

                {/* Content Section */}
                <div className="flex-1 text-center md:text-left">
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-3">
                    <h3 className="text-xl md:text-2xl font-bold text-slate-900">{tool.title}</h3>
                    {tool.ai && (
                      <span className="rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-3 py-1 text-[10px] font-bold text-white uppercase tracking-wider shadow-sm">
                        AI Powered
                      </span>
                    )}
                  </div>
                  <p className="text-sm md:text-base text-slate-600 leading-relaxed mb-5 max-w-xl">
                    {tool.desc}
                  </p>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-5">
                    {tool.features.map((feature) => (
                      <span
                        key={feature}
                        className={`flex items-center gap-1.5 rounded-full ${tool.iconBg} px-3 py-1.5 text-xs font-semibold ${tool.textColor}`}
                      >
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        {feature}
                      </span>
                    ))}
                  </div>
                  <button
                    className={`inline-flex items-center gap-2 rounded-xl bg-gradient-to-r ${tool.gradient} px-6 py-3 text-sm font-bold text-white shadow-md hover:shadow-lg transition-all transform group-hover:scale-105`}
                  >
                    Use {tool.title.split(' ').slice(0, -1).join(' ')} Tool
                    <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════ WHY CHOOSE US ═══════════════════════ */}
      <section className="border-y border-slate-200/80 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 rounded-full bg-purple-50 border border-purple-100 px-4 py-1.5 mb-4">
              <svg className="h-4 w-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
              </svg>
              <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">Why Choose Us</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Built for{' '}
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Speed, Privacy & Quality
              </span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-slate-500">
              We believe image editing should be fast, free, and private. That's why we built ImageTools
              to run primarily in your browser with no compromises.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="rounded-2xl border border-slate-100 bg-slate-50/50 p-6 hover:bg-white hover:shadow-lg hover:border-slate-200 transition-all duration-300">
                <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${feature.bg} ${feature.color}`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════ HOW IT WORKS ═══════════════════════ */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-100 px-4 py-1.5 mb-4">
            <svg className="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">How It Works</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            Three Simple Steps to{' '}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Perfect Images
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-500">
            No learning curve. Upload, adjust, download. It's that easy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              step: '01',
              title: 'Upload Your Image',
              desc: 'Drag and drop your image files or click to browse. We support JPG, PNG, WebP, GIF, BMP, SVG, and TIFF. Upload one file or batch upload multiple files at once.',
              icon: (
                <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
              ),
              color: 'from-blue-500 to-indigo-600',
              bg: 'bg-blue-50',
            },
            {
              step: '02',
              title: 'Choose Your Settings',
              desc: 'Select the tool you need and configure options. Adjust quality, dimensions, format, compression level, or let AI do the work automatically with smart defaults.',
              icon: (
                <svg className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              ),
              color: 'from-purple-500 to-pink-600',
              bg: 'bg-purple-50',
            },
            {
              step: '03',
              title: 'Download Results',
              desc: 'Your processed images are ready instantly. Download individually or all at once as separate files. Compare before and after to see the results side by side.',
              icon: (
                <svg className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
              ),
              color: 'from-emerald-500 to-teal-600',
              bg: 'bg-emerald-50',
            },
          ].map((item) => (
            <div key={item.step} className="relative text-center">
              {/* Step number */}
              <div className={`inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br ${item.color} text-xl font-black text-white shadow-xl mb-6`}>
                {item.step}
              </div>
              <div className={`mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl ${item.bg}`}>
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════ SUPPORTED FORMATS ═══════════════════════ */}
      <section className="border-y border-slate-200/80 bg-gradient-to-br from-slate-50 to-blue-50/30">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 border border-amber-100 px-4 py-1.5 mb-4">
              <span className="text-sm">📁</span>
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Format Support</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Works With All Major{' '}
              <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                Image Formats
              </span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-slate-500">
              Import and export in the formats you need. From web-optimized WebP to print-ready TIFF,
              we handle them all seamlessly.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {formats.map((format) => (
              <div key={format.name} className="rounded-2xl bg-white border border-slate-100 p-5 text-center shadow-sm hover:shadow-md hover:border-slate-200 transition-all">
                <div className={`inline-flex rounded-xl ${format.color} px-3 py-2 text-sm font-black mb-3`}>
                  {format.name.split(' ')[0]}
                </div>
                <h4 className="text-sm font-bold text-slate-800">{format.name}</h4>
                <p className="text-[11px] text-slate-400 mt-1">{format.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════ USE CASES ═══════════════════════ */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 rounded-full bg-rose-50 border border-rose-100 px-4 py-1.5 mb-4">
            <span className="text-sm">🎯</span>
            <span className="text-xs font-bold text-rose-700 uppercase tracking-wider">Use Cases</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            Perfect for{' '}
            <span className="bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
              Every Industry
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-500">
            From e-commerce to social media, our tools serve professionals and hobbyists alike.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {useCases.map((useCase) => (
            <div key={useCase.title} className="group rounded-2xl border border-slate-100 bg-white p-6 hover:shadow-lg hover:border-slate-200 transition-all duration-300">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{useCase.icon}</div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{useCase.title}</h3>
              <p className="text-sm text-slate-500">{useCase.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════ COMPARISON TABLE ═══════════════════════ */}
      <section className="border-y border-slate-200/80 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 border border-indigo-100 px-4 py-1.5 mb-4">
              <span className="text-sm">⚡</span>
              <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">Why ImageTools?</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              How We{' '}
              <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                Compare
              </span>
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b-2 border-slate-200">
                  <th className="text-left py-4 px-4 text-sm font-bold text-slate-900">Feature</th>
                  <th className="py-4 px-4 text-center">
                    <div className="inline-flex flex-col items-center gap-1">
                      <span className="rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-1.5 text-sm font-bold text-white shadow-md">ImageTools</span>
                    </div>
                  </th>
                  <th className="py-4 px-4 text-sm font-bold text-slate-400 text-center">Other Tools</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { feature: 'Price', us: 'Free Forever', them: 'Freemium / Paid' },
                  { feature: 'Sign-Up Required', us: 'No', them: 'Usually Yes' },
                  { feature: 'Privacy (Client-Side)', us: '✓ Most Tools', them: 'Rarely' },
                  { feature: 'AI-Powered Tools', us: '✓ Remove BG + Generate', them: 'Limited' },
                  { feature: 'Batch Processing', us: '✓ All Tools', them: 'Premium Only' },
                  { feature: 'Watermarks', us: 'Never', them: 'Common' },
                  { feature: 'Format Support', us: '7+ Formats', them: '2-3 Formats' },
                  { feature: 'Mobile Friendly', us: '✓ Fully Responsive', them: 'Varies' },
                ].map((row) => (
                  <tr key={row.feature} className="hover:bg-blue-50/30 transition-colors">
                    <td className="py-3.5 px-4 text-sm font-semibold text-slate-700">{row.feature}</td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 border border-green-200 px-3 py-1 text-xs font-bold text-green-700">
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        {row.us}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center text-xs text-slate-400 font-medium">{row.them}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ═══════════════════════ FAQ SECTION ═══════════════════════ */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 rounded-full bg-teal-50 border border-teal-100 px-4 py-1.5 mb-4">
            <span className="text-sm">❓</span>
            <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">FAQ</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            Frequently Asked{' '}
            <span className="bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
              Questions
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-500">
            Got questions? We've got answers. Here's everything you need to know about ImageTools.
          </p>
        </div>

        <div className="mx-auto max-w-3xl space-y-4">
          {faqs.map((faq, index) => (
            <details
              key={index}
              className="group rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden"
            >
              <summary className="flex cursor-pointer items-center justify-between p-5 md:p-6 text-left hover:bg-slate-50 transition-colors">
                <h3 className="text-sm md:text-base font-bold text-slate-900 pr-4">{faq.q}</h3>
                <div className="flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 group-open:bg-purple-100 transition-colors">
                  <svg className="h-4 w-4 text-slate-500 group-open:text-purple-600 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </div>
              </summary>
              <div className="px-5 md:px-6 pb-5 md:pb-6 pt-0">
                <p className="text-sm text-slate-500 leading-relaxed">{faq.a}</p>
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* ═══════════════════════ FINAL CTA ═══════════════════════ */}
      <section className="border-t border-slate-200/80 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
        <div className="mx-auto max-w-6xl px-4 py-20 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight">
            Ready to Transform<br />Your Images?
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-white/80">
            Join thousands of users who edit images for free every day. No sign-up needed.
            Start using any of our 5 professional tools right now.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            {[
              { id: 'converter' as const, label: '🔄 Convert', desc: 'PNG to JPG' },
              { id: 'compress' as const, label: '🗜️ Compress', desc: 'Reduce Size' },
              { id: 'resize' as const, label: '📐 Resize', desc: 'Any Dimension' },
              { id: 'removebg' as const, label: '✂️ Remove BG', desc: 'AI Powered' },
              { id: 'texttoimage' as const, label: '🎨 Generate', desc: 'Text to Image' },
            ].map((tool) => (
              <button
                key={tool.id}
                onClick={() => { onToolChange(tool.id); scrollToTop(); }}
                className="group flex flex-col items-center rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 px-6 py-4 hover:bg-white/20 transition-all hover:scale-105 min-w-[130px]"
              >
                <span className="text-lg mb-1">{tool.label.split(' ')[0]}</span>
                <span className="text-sm font-bold text-white">{tool.label.split(' ').slice(1).join(' ')}</span>
                <span className="text-[11px] text-white/60 mt-0.5">{tool.desc}</span>
              </button>
            ))}
          </div>
          <p className="mt-8 text-sm text-white/50">
            100% Free • No Watermarks • No Sign-Up • Works on All Devices
          </p>
        </div>
      </section>

      {/* ═══════════════════════ SEO CONTENT SECTION ═══════════════════════ */}
      <section className="bg-slate-50/50 border-t border-slate-200/80">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-4">Free Online Image Editor — No Software Required</h2>
              <p className="text-sm text-slate-500 leading-relaxed mb-4">
                ImageTools is a comprehensive, free online image editing suite that works entirely in your web browser.
                Unlike traditional desktop software like Photoshop or GIMP, there's nothing to download or install.
                Simply open the website, choose your tool, and start editing. It's perfect for quick edits, batch processing,
                and professional image optimization.
              </p>
              <p className="text-sm text-slate-500 leading-relaxed">
                Whether you need to convert PNG files to JPG format, compress large images for email or web,
                resize photos for social media platforms, remove backgrounds for product photography, or generate
                creative AI artwork from text descriptions — ImageTools has you covered with five powerful,
                easy-to-use tools.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-4">Privacy-First Image Processing</h2>
              <p className="text-sm text-slate-500 leading-relaxed mb-4">
                Your privacy matters. That's why our core tools — PNG to JPG converter, image compressor,
                and image resizer — process everything locally in your browser using the HTML5 Canvas API.
                Your images are never uploaded to any server, making ImageTools one of the most secure image
                editing solutions available online.
              </p>
              <p className="text-sm text-slate-500 leading-relaxed">
                For our AI-powered features like background removal (powered by remove.bg) and text-to-image
                generation (powered by HuggingFace), we use encrypted API connections. Your images are processed
                in real-time and are never stored permanently. We don't track your usage, require registration,
                or sell your data. Ever.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
