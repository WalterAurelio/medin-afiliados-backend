import { Request, Response, NextFunction } from 'express';
import { validateRegisterUser } from '../utils/registerUser.validacion';
import { RegisterBody } from '../types/AuthTypes';

export const validateRegister = (req: Request<{}, {}, RegisterBody>, res: Response, next: NextFunction) => {
  const errores = validateRegisterUser(req.body);

  if (errores.length > 0) {
    res.status(400).json({ errors: errores.join(' ') });
    return;
  }

  next();
};
