import multer from 'multer';
import multerS3 from 'multer-s3';
import { S3Client } from '@aws-sdk/client-s3';
import path from 'path';
import { env } from '../config/env.js';

// Conexión a S3 (Asume que la EC2 tiene un Rol IAM asignado o variables de entorno AWS)
const s3 = new S3Client({ region: 'us-east-1' }); 

const imageFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (!allowed.includes(file.mimetype)) return cb(new Error('Solo se permiten imágenes válidas'));
  cb(null, true);
};

export const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'EL_NOMBRE_DE_TU_BUCKET_S3_AQUI', // Reemplaza esto
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      const ext = path.extname(file.originalname).toLowerCase();
      // Guarda los archivos en S3 con un nombre único
      cb(null, `fotos/${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
    }
  }),
  fileFilter: imageFilter,
  limits: { fileSize: env.maxFileSizeMb * 1024 * 1024 }
});