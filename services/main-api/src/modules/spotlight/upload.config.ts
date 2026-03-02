import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { v4 as uuidv4 } from 'uuid';

// ─── Upload directories ─────────────────────────────────────────────────────

const UPLOAD_BASE = join(process.cwd(), 'uploads');
const UPLOAD_IMAGES = join(UPLOAD_BASE, 'images');
const UPLOAD_VIDEOS = join(UPLOAD_BASE, 'videos');
const UPLOAD_THUMBNAILS = join(UPLOAD_BASE, 'thumbnails');
const UPLOAD_DRIVER_FACES = join(UPLOAD_BASE, 'driver-faces');
const UPLOAD_AVATARS = join(UPLOAD_BASE, 'avatars');
const UPLOAD_DRIVER_DOCUMENTS = join(UPLOAD_BASE, 'driver-documents');
const UPLOAD_CONTENT_IMAGES = join(UPLOAD_BASE, 'content-images');

// Ensure directories exist
[UPLOAD_BASE, UPLOAD_IMAGES, UPLOAD_VIDEOS, UPLOAD_THUMBNAILS, UPLOAD_DRIVER_FACES, UPLOAD_AVATARS, UPLOAD_DRIVER_DOCUMENTS, UPLOAD_CONTENT_IMAGES].forEach(
  (dir) => {
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
  },
);

// ─── Allowed file types ─────────────────────────────────────────────────────

const IMAGE_MIMETYPES = [
  'image/jpeg',
  'image/jpg', // Một số client gửi jpg thay vì jpeg
  'image/png',
  'image/webp',
  'image/gif',
  'application/octet-stream', // React Native/Expo có thể gửi mimetype này
];

const VIDEO_MIMETYPES = ['video/mp4', 'video/webm', 'video/quicktime'];

const ALL_ALLOWED = [...IMAGE_MIMETYPES, ...VIDEO_MIMETYPES];

// ─── Multer config for images ────────────────────────────────────────────────

export const imageUploadConfig = {
  storage: diskStorage({
    destination: (_req: any, _file: any, cb: any) => {
      cb(null, UPLOAD_IMAGES);
    },
    filename: (_req: any, file: any, cb: any) => {
      const ext = file?.originalname ? extname(file.originalname) : '.jpg';
      cb(null, `${uuidv4()}${ext}`);
    },
  }),
  fileFilter: (_req: any, file: any, cb: any) => {
    const mime = file?.mimetype || '';
    const ext = (file?.originalname ? /\.[^.]+$/.exec(file.originalname)?.[0]?.toLowerCase() : '') ?? '';
    const isImageExt = ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext);
    if (IMAGE_MIMETYPES.includes(mime) || (mime === 'application/octet-stream' && isImageExt)) {
      cb(null, true);
    } else {
      cb(new Error(`File không hợp lệ. Chấp nhận: JPEG, PNG, WebP, GIF`), false);
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB per image
    files: 10, // max 10 images
  },
};

// ─── Multer config for videos ────────────────────────────────────────────────

export const videoUploadConfig = {
  storage: diskStorage({
    destination: (_req: any, _file: any, cb: any) => {
      cb(null, UPLOAD_VIDEOS);
    },
    filename: (_req: any, file: any, cb: any) => {
      const ext = file?.originalname ? extname(file.originalname) : '.mp4';
      cb(null, `${uuidv4()}${ext}`);
    },
  }),
  fileFilter: (_req: any, file: any, cb: any) => {
    if (VIDEO_MIMETYPES.includes(file?.mimetype || '')) {
      cb(null, true);
    } else {
      cb(new Error(`File không hợp lệ. Chấp nhận: ${VIDEO_MIMETYPES.join(', ')}`), false);
    }
  },
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB per video
    files: 1, // max 1 video
  },
};

// ─── Multer config for mixed (images + videos) ──────────────────────────────

export const mixedUploadConfig = {
  storage: diskStorage({
    destination: (_req: any, file: any, cb: any) => {
      const m = file?.mimetype || '';
      cb(null, VIDEO_MIMETYPES.includes(m) ? UPLOAD_VIDEOS : UPLOAD_IMAGES);
    },
    filename: (_req: any, file: any, cb: any) => {
      const ext = file?.originalname ? extname(file.originalname) : '.jpg';
      cb(null, `${uuidv4()}${ext}`);
    },
  }),
  fileFilter: (_req: any, file: any, cb: any) => {
    const m = file?.mimetype || '';
    if (ALL_ALLOWED.includes(m)) {
      cb(null, true);
    } else {
      cb(new Error('File không hợp lệ. Chấp nhận ảnh (JPEG, PNG, WebP) và video (MP4, WebM)'), false);
    }
  },
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
    files: 10,
  },
};

// ─── Single image for driver face capture ────────────────────────────────────

export const driverFaceUploadConfig = {
  storage: diskStorage({
    destination: (_req: any, _file: any, cb: any) => {
      cb(null, UPLOAD_DRIVER_FACES);
    },
    filename: (_req: any, file: any, cb: any) => {
      const ext = file?.originalname ? extname(file.originalname) : '.jpg';
      cb(null, `${uuidv4()}${ext}`);
    },
  }),
  fileFilter: (_req: any, file: any, cb: any) => {
    const mime = file?.mimetype || '';
    const ext = (file?.originalname ? /\.[^.]+$/.exec(file.originalname)?.[0]?.toLowerCase() : '') ?? '';
    const isImageExt = ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext);
    if (IMAGE_MIMETYPES.includes(mime) || (mime === 'application/octet-stream' && isImageExt)) {
      cb(null, true);
    } else {
      cb(new Error(`File không hợp lệ. Chấp nhận: JPEG, PNG, WebP, GIF`), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 1,
  },
};

// ─── Single image for driver avatar ───────────────────────────────────────────

export const driverAvatarUploadConfig = {
  storage: diskStorage({
    destination: (_req: any, _file: any, cb: any) => {
      cb(null, UPLOAD_AVATARS);
    },
    filename: (_req: any, file: any, cb: any) => {
      const ext = file?.originalname ? extname(file.originalname) : '.jpg';
      cb(null, `${uuidv4()}${ext}`);
    },
  }),
  fileFilter: (_req: any, file: any, cb: any) => {
    const mime = file?.mimetype || '';
    const ext = (file?.originalname ? /\.[^.]+$/.exec(file.originalname)?.[0]?.toLowerCase() : '') ?? '';
    const isImageExt = ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext);
    if (IMAGE_MIMETYPES.includes(mime) || (mime === 'application/octet-stream' && isImageExt)) {
      cb(null, true);
    } else {
      cb(new Error(`File không hợp lệ. Chấp nhận: JPEG, PNG, WebP, GIF`), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 1,
  },
};

// ─── Content images (news, training) ────────────────────────────────────────

export const contentImagesUploadConfig = {
  storage: diskStorage({
    destination: (_req: any, _file: any, cb: any) => {
      cb(null, UPLOAD_CONTENT_IMAGES);
    },
    filename: (_req: any, file: any, cb: any) => {
      const ext = file?.originalname ? extname(file.originalname) : '.jpg';
      cb(null, `${uuidv4()}${ext}`);
    },
  }),
  fileFilter: (_req: any, file: any, cb: any) => {
    const mime = file?.mimetype || '';
    const ext = (file?.originalname ? /\.[^.]+$/.exec(file.originalname)?.[0]?.toLowerCase() : '') ?? '';
    const isImageExt = ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext);
    if (IMAGE_MIMETYPES.includes(mime) || (mime === 'application/octet-stream' && isImageExt)) {
      cb(null, true);
    } else {
      cb(new Error(`File không hợp lệ. Chấp nhận: JPEG, PNG, WebP, GIF`), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 1,
  },
};

// ─── Driver documents (GPLX, CCCD, đăng ký xe, bảo hiểm, ảnh xe) ─────────────

export const driverDocumentsUploadConfig = {
  storage: diskStorage({
    destination: (_req: any, _file: any, cb: any) => {
      cb(null, UPLOAD_DRIVER_DOCUMENTS);
    },
    filename: (_req: any, file: any, cb: any) => {
      const ext = file?.originalname ? extname(file.originalname) : '.jpg';
      cb(null, `${uuidv4()}${ext}`);
    },
  }),
  fileFilter: (_req: any, file: any, cb: any) => {
    const mime = file?.mimetype || '';
    const ext = (file?.originalname ? /\.[^.]+$/.exec(file.originalname)?.[0]?.toLowerCase() : '') ?? '';
    const isImageExt = ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext);
    if (IMAGE_MIMETYPES.includes(mime) || (mime === 'application/octet-stream' && isImageExt)) {
      cb(null, true);
    } else {
      cb(new Error(`File không hợp lệ. Chấp nhận: JPEG, PNG, WebP, GIF`), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 1,
  },
};
