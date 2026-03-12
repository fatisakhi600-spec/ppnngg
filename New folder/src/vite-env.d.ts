/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_HF_TOKEN: string;
  readonly VITE_REMOVE_BG_API_KEY: string;
  readonly VITE_GEMINI_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
