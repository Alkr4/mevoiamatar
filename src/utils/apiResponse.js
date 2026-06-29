export const ok = (res, data = {}, message = 'Operación realizada correctamente', status = 200) => {
  return res.status(status).json({ success: true, message, data });
};

export const fail = (res, message = 'Error en la solicitud', status = 400, errors = null) => {
  return res.status(status).json({ success: false, message, errors });
};
