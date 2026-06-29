import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { User } from '../models/index.js';
import { fail } from '../utils/apiResponse.js';

export const authRequired = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) return fail(res, 'Token no enviado', 401);

    const token = header.split(' ')[1];
    const payload = jwt.verify(token, env.jwtSecret);
    const user = await User.findByPk(payload.id);

    if (!user) return fail(res, 'Usuario no encontrado', 401);
    req.user = user;
    next();
  } catch {
    return fail(res, 'Token inválido o expirado', 401);
  }
};

export const adminRequired = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') return fail(res, 'Acceso permitido solo para administrador', 403);
  next();
};


export const optionalAuth = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) return next();

    const token = header.split(' ')[1];
    const payload = jwt.verify(token, env.jwtSecret);
    const user = await User.findByPk(payload.id);
    if (user) req.user = user;
    return next();
  } catch {
    return next();
  }
};
