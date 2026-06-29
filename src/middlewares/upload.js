import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { env } from '../config/env.js';

if (!fs.existsSync(env.uploadDir)) fs.mkdirSync(env.uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, env.uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  }
});

const imageFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (!allowed.includes(file.mimetype)) return cb(new Error('Solo se permiten imágenes JPG, PNG, WEBP o GIF'));
  cb(null, true);
};

export const upload = multer({
  storage,
  fileFilter: imageFilter,
  limits: { fileSize: env.maxFileSizeMb * 1024 * 1024 }
});
