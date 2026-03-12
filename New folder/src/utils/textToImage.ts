import { InferenceClient } from '@huggingface/inference';

// Token loaded from environment variables — never hardcoded
export const HF_DEFAULT_TOKEN = import.meta.env.VITE_HF_TOKEN || '';

export interface GenerationParams {
  prompt: string;
  negativePrompt?: string;
  model: string;
  width: number;
  height: number;
  numInferenceSteps: number;
  guidanceScale: number;
}

export interface GeneratedImage {
  id: string;
  blob: Blob;
  url: string;
  prompt: string;
  negativePrompt?: string;
  model: string;
  width: number;
  height: number;
  steps: number;
  guidanceScale: number;
  timestamp: number;
}

export const MODELS = [
  {
    id: 'stabilityai/stable-diffusion-xl-base-1.0',
    name: 'Stable Diffusion XL',
    shortName: 'SDXL',
    description: 'High quality, versatile image generation',
    icon: '🎨',
    defaultSteps: 30,
    defaultGuidance: 7.5,
    maxWidth: 1024,
    maxHeight: 1024,
    category: 'Popular',
  },
  {
    id: 'runwayml/stable-diffusion-v1-5',
    name: 'Stable Diffusion 1.5',
    shortName: 'SD 1.5',
    description: 'Classic stable diffusion model, fast generation',
    icon: '⚡',
    defaultSteps: 25,
    defaultGuidance: 7.5,
    maxWidth: 768,
    maxHeight: 768,
    category: 'Popular',
  },
  {
    id: 'stabilityai/stable-diffusion-2-1',
    name: 'Stable Diffusion 2.1',
    shortName: 'SD 2.1',
    description: 'Improved quality and resolution support',
    icon: '🖼️',
    defaultSteps: 30,
    defaultGuidance: 7.5,
    maxWidth: 768,
    maxHeight: 768,
    category: 'Popular',
  },
  {
    id: 'black-forest-labs/FLUX.1-schnell',
    name: 'FLUX.1 Schnell',
    shortName: 'FLUX Fast',
    description: 'Ultra-fast generation with great quality',
    icon: '🚀',
    defaultSteps: 4,
    defaultGuidance: 0,
    maxWidth: 1024,
    maxHeight: 1024,
    category: 'Fast',
  },
  {
    id: 'black-forest-labs/FLUX.1-dev',
    name: 'FLUX.1 Dev',
    shortName: 'FLUX Dev',
    description: 'Higher quality FLUX model for development',
    icon: '🔬',
    defaultSteps: 20,
    defaultGuidance: 3.5,
    maxWidth: 1024,
    maxHeight: 1024,
    category: 'Quality',
  },
  {
    id: 'CompVis/stable-diffusion-v1-4',
    name: 'Stable Diffusion 1.4',
    shortName: 'SD 1.4',
    description: 'Original stable diffusion, lightweight',
    icon: '📦',
    defaultSteps: 25,
    defaultGuidance: 7.5,
    maxWidth: 512,
    maxHeight: 512,
    category: 'Classic',
  },
];

export const STYLE_PRESETS = [
  { name: 'None', prefix: '', suffix: '' },
  { name: 'Photorealistic', prefix: 'photorealistic, ultra-detailed photograph of ', suffix: ', 8k uhd, dslr, high quality, film grain, Fujifilm XT3' },
  { name: 'Digital Art', prefix: 'digital art, ', suffix: ', trending on artstation, highly detailed, sharp focus, digital painting' },
  { name: 'Oil Painting', prefix: 'oil painting of ', suffix: ', oil on canvas, masterwork, classical art, rich colors, dramatic lighting' },
  { name: 'Watercolor', prefix: 'watercolor painting of ', suffix: ', watercolor art, soft colors, delicate brushstrokes, paper texture, artistic' },
  { name: 'Anime', prefix: 'anime style, ', suffix: ', studio ghibli, makoto shinkai, cel shading, vibrant colors, detailed illustration' },
  { name: 'Pixel Art', prefix: 'pixel art of ', suffix: ', 16-bit, retro game style, pixelated, nostalgic, clean pixels' },
  { name: '3D Render', prefix: '3D render of ', suffix: ', octane render, cinema 4d, ray tracing, volumetric lighting, photorealistic 3d' },
  { name: 'Fantasy', prefix: 'fantasy art, ', suffix: ', epic fantasy, magical, mystical atmosphere, detailed illustration, fantasy landscape' },
  { name: 'Cinematic', prefix: 'cinematic shot of ', suffix: ', cinematic lighting, anamorphic, lens flare, movie still, dramatic atmosphere' },
  { name: 'Comic Book', prefix: 'comic book art of ', suffix: ', marvel style, bold outlines, dynamic pose, vibrant colors, action scene' },
  { name: 'Minimalist', prefix: 'minimalist illustration of ', suffix: ', clean lines, simple shapes, modern design, flat colors, geometric' },
];

export const DIMENSION_PRESETS = [
  { name: 'Square', width: 512, height: 512, label: '512×512' },
  { name: 'Square HD', width: 1024, height: 1024, label: '1024×1024' },
  { name: 'Portrait', width: 512, height: 768, label: '512×768' },
  { name: 'Portrait HD', width: 768, height: 1024, label: '768×1024' },
  { name: 'Landscape', width: 768, height: 512, label: '768×512' },
  { name: 'Landscape HD', width: 1024, height: 768, label: '1024×768' },
  { name: 'Wide', width: 1024, height: 576, label: '1024×576' },
  { name: 'Tall', width: 576, height: 1024, label: '576×1024' },
];

export async function generateImage(
  token: string,
  params: GenerationParams
): Promise<GeneratedImage> {
  if (!token) {
    throw new Error('Please enter your HuggingFace API token to generate images.');
  }

  const client = new InferenceClient(token);

  const inputParams: Record<string, unknown> = {
    num_inference_steps: params.numInferenceSteps,
    width: params.width,
    height: params.height,
  };

  if (params.guidanceScale > 0) {
    inputParams.guidance_scale = params.guidanceScale;
  }

  if (params.negativePrompt) {
    inputParams.negative_prompt = params.negativePrompt;
  }

  try {
    const result = await client.textToImage({
      model: params.model,
      inputs: params.prompt,
      parameters: inputParams,
    });

    // result can be a Blob or a string depending on the environment
    let blob: Blob;
    const res = result as unknown;
    if (typeof res === 'object' && res !== null && typeof (res as Blob).arrayBuffer === 'function') {
      blob = res as Blob;
    } else {
      // If string (base64 or URL), convert to blob
      const response = await fetch(res as string);
      blob = await response.blob();
    }

    const url = URL.createObjectURL(blob);

    return {
      id: `img_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      blob,
      url,
      prompt: params.prompt,
      negativePrompt: params.negativePrompt,
      model: params.model,
      width: params.width,
      height: params.height,
      steps: params.numInferenceSteps,
      guidanceScale: params.guidanceScale,
      timestamp: Date.now(),
    };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    if (msg.includes('401') || msg.includes('Unauthorized')) {
      throw new Error('Invalid API token. Please check your HuggingFace token and try again.');
    }
    if (msg.includes('503') || msg.includes('loading')) {
      throw new Error('Model is loading, please wait a moment and try again. Some models take 30-60 seconds to warm up.');
    }
    if (msg.includes('429') || msg.includes('rate')) {
      throw new Error('Rate limited. Please wait a few seconds before trying again.');
    }
    throw new Error(`Generation failed: ${msg}`);
  }
}
