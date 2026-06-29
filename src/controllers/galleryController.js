import { Op } from 'sequelize';
import { Gallery, Photo, User } from '../models/index.js';
import { ok, fail } from '../utils/apiResponse.js';

const galleryIncludes = [
  { model: User, as: 'owner', attributes: ['id', 'name', 'email'] },
  { model: Photo, as: 'photos', attributes: ['id', 'title', 'description', 'imageUrl', 'createdAt'] }
];

export const getPublicGalleries = async (req, res) => {
  const galleries = await Gallery.findAll({
    where: { visibility: 'public' },
    include: galleryIncludes,
    order: [['createdAt', 'DESC']]
  });
  return ok(res, { galleries }, 'Galerías públicas obtenidas correctamente');
};

export const getMyGalleries = async (req, res) => {
  const galleries = await Gallery.findAll({
    where: { userId: req.user.id },
    include: [{ model: Photo, as: 'photos' }],
    order: [['createdAt', 'DESC']]
  });
  return ok(res, { galleries }, 'Mis galerías obtenidas correctamente');
};

export const getGalleryById = async (req, res) => {
  const gallery = await Gallery.findByPk(req.params.id, { include: galleryIncludes });
  if (!gallery) return fail(res, 'Galería no encontrada', 404);

  const isOwner = req.user && gallery.userId === req.user.id;
  const isAdmin = req.user && req.user.role === 'admin';

  if (gallery.visibility === 'private' && !isOwner && !isAdmin) {
    return fail(res, 'Esta galería es privada', 403);
  }

  return ok(res, { gallery }, 'Galería obtenida correctamente');
};

export const createGallery = async (req, res) => {
  const { title, description, visibility = 'private' } = req.body;
  const gallery = await Gallery.create({ title, description, visibility, userId: req.user.id });
  return ok(res, { gallery }, 'Galería creada correctamente', 201);
};

export const updateGallery = async (req, res) => {
  const gallery = await Gallery.findByPk(req.params.id);
  if (!gallery) return fail(res, 'Galería no encontrada', 404);
  if (gallery.userId !== req.user.id && req.user.role !== 'admin') return fail(res, 'No puedes modificar esta galería', 403);

  const { title, description, visibility } = req.body;
  await gallery.update({
    title: title ?? gallery.title,
    description: description ?? gallery.description,
    visibility: visibility ?? gallery.visibility
  });

  return ok(res, { gallery }, 'Galería actualizada correctamente');
};

export const deleteGallery = async (req, res) => {
  const gallery = await Gallery.findByPk(req.params.id);
  if (!gallery) return fail(res, 'Galería no encontrada', 404);
  if (gallery.userId !== req.user.id && req.user.role !== 'admin') return fail(res, 'No puedes eliminar esta galería', 403);

  await gallery.destroy();
  return ok(res, {}, 'Galería eliminada correctamente');
};
