export const ERROR_MESSAGES = {
  GENERAL: {
    UNKNOWN: (error: unknown) => `Ha ocurrido un error inesperado. ${error instanceof Error && error.message}`
  },
  USER: {
    NOT_FOUND: 'No se encontró un usuario con este número de documento.',
    ALREADY_EXISTS: 'Ya existe un usuario registrado con este número de documento.',
    NOT_REGISTERED: 'El usuario con este número de documento aún no fue registrado.',
    INVALID_PASSWORD: 'La contraseña ingresada es incorrecta.'
  },
  REINTEGRO: {
    NOT_FOUND: 'No se encontró el reintegro solicitado.'
  },
  RECETA: {
    NOT_FOUND: 'Receta no encontrada'
  },
  AUTORIZACION: {
    NOT_FOUND: 'Autorización no encontrada'
  }
};
