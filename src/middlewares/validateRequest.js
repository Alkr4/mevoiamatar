import { validationResult } from 'express-validator';
import { fail } from '../utils/apiResponse.js';

export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return fail(res, 'Datos inválidos', 422, errors.array());
  next();
};
