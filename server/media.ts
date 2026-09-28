import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

const allowedMimeTypes: Record<string, string[]> = {
  jpg: ['image/jpeg'],
  jpeg: ['image/jpeg'],
  png: ['image/png'],
  webp: ['image/webp'],
  gif: ['image/gif'],
  svg: ['image/svg+xml'],
  mp4: ['video/mp4'],
  webm: ['video/webm'],
  mov: ['video/quicktime'],
  pdf: ['application/pdf'],
  docx: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  xlsx: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
  pptx: ['application/vnd.openxmlformats-officedocument.presentationml.presentation'],
  txt: ['text/plain'],
  csv: ['text/csv', 'application/csv'],
};

const maxFileSizeBytes = 25 * 1024 * 1024;

export const validateUpload = (filename: string, mimeType: string, sizeBytes: number) => {
  const suspicious = /[<>:"/\\|?*]|\.\.|\s{2,}/.test(filename);
  if (suspicious) {
    throw new Error('Invalid filename.');
  }

  const ext = path.extname(filename).replace('.', '').toLowerCase();
  const allowed = allowedMimeTypes[ext];
  if (!allowed) {
    throw new Error('File type is not allowed.');
  }

  if (!allowed.includes(mimeType)) {
    throw new Error('File MIME type does not match the allowed list.');
  }

  if (sizeBytes > maxFileSizeBytes) {
    throw new Error('File exceeds the 25 MB limit.');
  }

  return true;
};

export const generateSafeStorageName = (originalName: string) => {
  const randomPart = crypto.randomBytes(16).toString('hex');
  const ext = path.extname(originalName).toLowerCase();
  return `${Date.now()}-${randomPart}${ext}`;
};

export const sanitizeSvg = async (filePath: string) => {
  const raw = await fs.readFile(filePath, 'utf8');
  const suspiciousPatterns = ['<script', 'onload=', 'javascript:', 'data:text/html'];
  const matches = suspiciousPatterns.some((pattern) => raw.toLowerCase().includes(pattern));
  if (matches) {
    throw new Error('Unsafe SVG content detected.');
  }

  return raw.replace(/<\?xml[^>]*\?>/gi, '').trim();
};
