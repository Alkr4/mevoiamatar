import { Router } from 'express';
import { body } from 'express-validator';
import {
  createGallery,
  deleteGallery,
  getGalleryById,
  getMyGalleries,
  getPublicGalleries,
  updateGallery
} from '../controllers/galleryController.js';
import { addPhotoToGallery, deletePhoto, updatePhoto } from '../controllers/photoController.js';
import { authRequired, optionalAuth } from '../middlewares/auth.js';
import { upload } from '../middlewares/upload.js';
import { validateRequest } from '../middlewares/validateRequest.js';

const router = Router();

router.get('/public', getPublicGalleries);
router.get('/my', authRequired, getMyGalleries);
router.get('/:id', optionalAuth, getGalleryById);

router.post('/', authRequired, [
  body('title').trim().isLength({ min: 3, max: 120 }).withMessage('El título debe tener entre 3 y 120 caracteres'),
  body('visibility').optional().isIn(['public', 'private']).withMessage('La visibilidad debe ser public o private')
], validateRequest, createGallery);

router.put('/:id', authRequired, [
  body('title').optional().trim().isLength({ min: 3, max: 120 }).withMessage('El título debe tener entre 3 y 120 caracteres'),
  body('visibility').optional().isIn(['public', 'private']).withMessage('La visibilidad debe ser public o private')
], validateRequest, updateGallery);

router.delete('/:id', authRequired, deleteGallery);

router.post('/:galleryId/photos', authRequired, upload.single('image'), [
  body('title').trim().isLength({ min: 2, max: 120 }).withMessage('El título de la foto debe tener entre 2 y 120 caracteres'),
  body('imageUrl').optional().isURL().withMessage('La URL de imagen no es válida')
], validateRequest, addPhotoToGallery);

router.put('/:galleryId/photos/:photoId', authRequired, [
  body('title').optional().trim().isLength({ min: 2, max: 120 }).withMessage('El título de la foto debe tener entre 2 y 120 caracteres'),
  body('imageUrl').optional().isURL().withMessage('La URL de imagen no es válida')
], validateRequest, updatePhoto);

router.delete('/:galleryId/photos/:photoId', authRequired, deletePhoto);

export default router;
