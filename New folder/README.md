# 🖼️ ImageTools Pro

> A free, privacy-first, browser-based image editing suite with AI-powered tools. No sign-up required.

[![Built with React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-7-purple?logo=vite)](https://vite.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?logo=tailwindcss)](https://tailwindcss.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6?logo=typescript)](https://www.typescriptlang.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 🚀 Features

ImageTools Pro provides **5 powerful image editing tools** — all running directly in your browser:

| Tool | Description | Engine |
|------|-------------|--------|
| 🔄 **PNG to JPG** | Convert PNG images to JPG format with adjustable quality and background color | Canvas API |
| 🗜️ **Compress Image** | Reduce image file size while maintaining quality (JPG, PNG, WebP) | Canvas API |
| 📐 **Resize Image** | Resize images by pixels, percentage, or presets (30+ social/print presets) | Canvas API |
| ✂️ **Remove Background** | AI-powered background removal with manual fallback | [remove.bg API](https://www.remove.bg/api) + Canvas |
| 🎨 **Text to Image** | Generate images from text prompts using AI models | [HuggingFace Inference](https://huggingface.co/inference-api) |

### ✨ Key Highlights

- **🔒 Privacy First** — Client-side processing; images never leave your browser (except AI features)
- **⚡ Lightning Fast** — Instant processing using the Canvas API
- **📦 Batch Processing** — Upload and process multiple images at once
- **🤖 AI-Powered** — Remove.bg for background removal, HuggingFace for image generation
- **📱 Fully Responsive** — Works on desktop, tablet, and mobile
- **🆓 100% Free** — No sign-up, no watermarks, no limits
- **🌐 No Installation** — Works entirely in the browser

---

## 📁 Project Structure

```
imagetools-pro/
├── public/                     # Static assets
├── src/
│   ├── components/
│   │   ├── Header.tsx          # Navigation bar with tool tabs
│   │   ├── Footer.tsx          # Multi-column footer with links
│   │   ├── HomePage.tsx        # SEO-optimized landing page
│   │   ├── PngToJpg.tsx        # PNG → JPG converter tool
│   │   ├── CompressImage.tsx   # Image compression tool
│   │   ├── ResizeImage.tsx     # Image resize tool
│   │   ├── RemoveBackground.tsx# Background removal tool
│   │   ├── TextToImage.tsx     # AI text-to-image generator
│   │   ├── DropZone.tsx        # Drag & drop file upload component
│   │   ├── QualitySlider.tsx   # Quality/settings slider component
│   │   └── FileCard.tsx        # Individual file result card
│   ├── utils/
│   │   ├── converter.ts        # PNG → JPG conversion engine
│   │   ├── compressor.ts       # Image compression engine
│   │   ├── resizer.ts          # Image resize engine
│   │   ├── backgroundRemover.ts# Background removal engine (API + Canvas)
│   │   ├── textToImage.ts      # HuggingFace text-to-image wrapper
│   │   └── cn.ts               # Tailwind class merge utility
│   ├── App.tsx                 # Root app component with routing
│   ├── main.tsx                # React entry point
│   ├── index.css               # Global styles + Tailwind imports
│   ├── types.ts                # Shared TypeScript types
│   └── vite-env.d.ts           # Vite environment type declarations
├── tests/
│   ├── utils/
│   │   ├── converter.test.ts   # Converter utility tests
│   │   ├── compressor.test.ts  # Compressor utility tests
│   │   └── resizer.test.ts     # Resizer utility tests
│   └── setup.ts                # Test setup file
├── .env.example                # Environment variables template
├── .gitignore                  # Git ignore rules
├── index.html                  # HTML entry point with SEO meta tags
├── package.json                # Dependencies and scripts
├── tsconfig.json               # TypeScript configuration
├── vite.config.ts              # Vite build configuration
└── README.md                   # This file
```

---

## 🛠️ Getting Started

### Prerequisites

- **Node.js** 18+ (recommended: 20 LTS)
- **npm** 9+

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/imagetools-pro.git
cd imagetools-pro

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env and add your API keys (see Environment Variables below)

# 4. Start the development server
npm run dev

# 5. Open in browser
# → http://localhost:5173
```

### Build for Production

```bash
npm run build
# Output: dist/index.html (single-file bundle)
```

### Preview Production Build

```bash
npm run preview
```

---

## 🔑 Environment Variables

Create a `.env` file in the project root (copy from `.env.example`):

| Variable | Required | Description | Get it from |
|----------|----------|-------------|-------------|
| `VITE_HF_TOKEN` | For Text-to-Image | HuggingFace API token | [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens) |
| `VITE_REMOVE_BG_API_KEY` | For AI BG removal | remove.bg API key | [remove.bg/api](https://www.remove.bg/api) |
| `VITE_GEMINI_API_KEY` | Reserved | Google Gemini API key | [aistudio.google.com](https://aistudio.google.com/app/apikey) |

> ⚠️ **Security Note**: Never commit `.env` files with real API keys. The `.gitignore` is configured to exclude them.

> 💡 **Without API keys**: PNG to JPG, Compress, and Resize tools work 100% offline. Remove Background falls back to client-side processing. Text to Image requires a HuggingFace token.

---

## 🧰 Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| [React](https://react.dev) | 19.x | UI framework |
| [Vite](https://vite.dev) | 7.x | Build tool & dev server |
| [Tailwind CSS](https://tailwindcss.com) | 4.x | Utility-first CSS |
| [TypeScript](https://typescriptlang.org) | 5.9 | Type safety |
| [@huggingface/inference](https://www.npmjs.com/package/@huggingface/inference) | 4.x | AI image generation |
| [vite-plugin-singlefile](https://www.npmjs.com/package/vite-plugin-singlefile) | 2.x | Single HTML output |
| [Vitest](https://vitest.dev) | 3.x | Unit testing |

---

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Coverage

| Module | Tests |
|--------|-------|
| `converter.ts` | Format conversion, quality settings, background color |
| `compressor.ts` | Compression ratio, output formats, dimension limits |
| `resizer.ts` | Pixel resize, percentage, fit/fill modes, aspect ratio |

---

## 🔧 Available Tools — Details

### 🔄 PNG to JPG Converter
- Drag & drop or browse PNG files
- Adjustable JPG quality (1–100%)
- Custom background color for transparent areas
- Batch conversion with zip download
- Shows file size savings percentage

### 🗜️ Image Compressor
- Supports JPG, PNG, WebP, GIF, BMP input
- Quality slider with visual size preview
- Output format selection (auto/JPEG/PNG/WebP)
- Optional max width/height with aspect ratio lock
- Total savings summary bar

### 📐 Image Resizer
- **4 modes**: By Pixels, By Percentage, Fit Within, Fill & Crop
- Aspect ratio lock/unlock toggle
- **30+ presets**: Instagram, Facebook, Twitter, YouTube, LinkedIn, Print sizes (A4, Letter, 4×6, etc.)
- Quick percentage buttons (25%, 50%, 75%, 100%, 150%, 200%)
- Batch resize all images to same dimensions

### ✂️ Background Remover
- **AI Mode** (default): Uses remove.bg API for professional results
- **Auto Detect**: Client-side edge sampling + flood fill
- **Manual Pick**: Click on the image to select background color
- Tolerance, edge softness, and refinement sliders
- Connected-only toggle for precise removal
- Before/After comparison view

### 🎨 Text to Image Generator
- **6 AI models**: SDXL, SD 1.5, SD 2.1, FLUX.1 Schnell, FLUX.1 Dev, SD 1.4
- **12 style presets**: Photorealistic, Anime, Oil Painting, Cyberpunk, etc.
- **8 dimension presets**: Square, Portrait, Landscape, Wide, Tall
- Negative prompt support
- Adjustable inference steps and guidance scale
- Image gallery with full-size preview

---

## 🌐 SEO

The app includes comprehensive SEO optimization:

- **Meta tags**: Title, description, keywords, robots, canonical URL
- **Open Graph**: Facebook/social sharing tags
- **Twitter Card**: Large image summary card
- **JSON-LD**: WebApplication structured data schema
- **Semantic HTML**: Proper heading hierarchy, landmark elements
- **FAQ section**: Expandable Q&A for featured snippet targeting

---

## 📝 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📬 Support

- 🐛 **Bug Reports**: [Open an issue](https://github.com/your-username/imagetools-pro/issues)
- 💡 **Feature Requests**: [Open a discussion](https://github.com/your-username/imagetools-pro/discussions)
- 📧 **Contact**: support@imagetools.app

---

<p align="center">
  Made with ❤️ using React, Vite, and Tailwind CSS
</p>
