import { fail } from '../utils/apiResponse.js';

export const notFound = (req, res) => fail(res, 'Ruta no encontrada', 404);

export const errorHandler = (err, req, res, next) => {
  console.error(err);
  return fail(res, err.message || 'Error interno del servidor', err.status || 500);
};
