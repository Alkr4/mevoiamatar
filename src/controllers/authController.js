import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';
import { env } from '../config/env.js';
import { ok, fail } from '../utils/apiResponse.js';

const buildToken = (user) => jwt.sign({ id: user.id, role: user.role }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  const exists = await User.findOne({ where: { email } });
  if (exists) return fail(res, 'El correo ya está registrado', 409);

  const user = await User.create({ name, email, password, role: 'user' });
  const token = buildToken(user);
  return ok(res, { user: user.toSafeJSON(), token }, 'Usuario registrado correctamente', 201);
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user) return fail(res, 'Credenciales inválidas', 401);

  const valid = await user.comparePassword(password);
  if (!valid) return fail(res, 'Credenciales inválidas', 401);

  const token = buildToken(user);
  return ok(res, { user: user.toSafeJSON(), token }, 'Inicio de sesión correcto');
};

export const me = async (req, res) => ok(res, { user: req.user.toSafeJSON() }, 'Perfil obtenido correctamente');
