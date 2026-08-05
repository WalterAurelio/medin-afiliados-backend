import { Request, Response, NextFunction } from 'express';
import { validateLoginUser } from '../utils/login.validacion';
import { LoginBody } from '../types/AuthTypes';

export const validateLogin = (req: Request<{}, {}, LoginBody>, res: Response, next: NextFunction) => {
  const { nroDocumento, password } = req.body;

  const errores = validateLoginUser(nroDocumento, password);
  if (errores.length > 0) {
    res.status(400).json({ errors: errores.join(' ') });
    return;
  }

  next();
};
