import { Router } from 'express';
import authRoutes from './authRoutes.js';
import galleryRoutes from './galleryRoutes.js';

const router = Router();

router.get('/health', (req, res) => {
  res.json({ success: true, message: 'API Galería de Fotos funcionando correctamente' });
});

router.use('/auth', authRoutes);
router.use('/galleries', galleryRoutes);

export default router;
