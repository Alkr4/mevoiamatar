import { Router } from 'express';
import { body } from 'express-validator';
import { login, me, register } from '../controllers/authController.js';
import { authRequired } from '../middlewares/auth.js';
import { validateRequest } from '../middlewares/validateRequest.js';

const router = Router();

router.post('/register', [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  body('email').isEmail().withMessage('Correo inválido'),
  body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener mínimo 6 caracteres')
], validateRequest, register);

router.post('/login', [
  body('email').isEmail().withMessage('Correo inválido'),
  body('password').notEmpty().withMessage('La contraseña es obligatoria')
], validateRequest, login);

router.get('/me', authRequired, me);

export default router;
