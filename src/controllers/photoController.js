import { Gallery, Photo } from '../models/index.js';
import { ok, fail } from '../utils/apiResponse.js';

const canEditGallery = (gallery, user) => gallery.userId === user.id || user.role === 'admin';

export const addPhotoToGallery = async (req, res) => {
  const gallery = await Gallery.findByPk(req.params.galleryId);
  if (!gallery) return fail(res, 'Galería no encontrada', 404);
  if (!canEditGallery(gallery, req.user)) return fail(res, 'No puedes agregar fotos a esta galería', 403);

  let imageUrl = req.body.imageUrl;
  let filename = null;

  if (req.file) {
    filename = req.file.filename;
    imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  }

  if (!imageUrl) return fail(res, 'Debes enviar una imagen o una URL de imagen', 422);

  const photo = await Photo.create({
    title: req.body.title,
    description: req.body.description,
    imageUrl,
    filename,
    galleryId: gallery.id
  });

  return ok(res, { photo }, 'Foto agregada correctamente', 201);
};

export const updatePhoto = async (req, res) => {
  const photo = await Photo.findByPk(req.params.photoId, { include: [{ model: Gallery, as: 'gallery' }] });
  if (!photo) return fail(res, 'Foto no encontrada', 404);
  if (!canEditGallery(photo.gallery, req.user)) return fail(res, 'No puedes modificar esta foto', 403);

  await photo.update({
    title: req.body.title ?? photo.title,
    description: req.body.description ?? photo.description,
    imageUrl: req.body.imageUrl ?? photo.imageUrl
  });

  return ok(res, { photo }, 'Foto actualizada correctamente');
};

export const deletePhoto = async (req, res) => {
  const photo = await Photo.findByPk(req.params.photoId, { include: [{ model: Gallery, as: 'gallery' }] });
  if (!photo) return fail(res, 'Foto no encontrada', 404);
  if (!canEditGallery(photo.gallery, req.user)) return fail(res, 'No puedes eliminar esta foto', 403);

  await photo.destroy();
  return ok(res, {}, 'Foto eliminada correctamente');
};
