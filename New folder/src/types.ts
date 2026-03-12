export interface ConvertedFile {
  id: string;
  originalFile: File;
  originalSize: number;
  originalPreview: string;
  convertedBlob: Blob | null;
  convertedSize: number;
  convertedPreview: string;
  status: 'pending' | 'converting' | 'done' | 'error';
  error?: string;
}
