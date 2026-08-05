import { NextFunction, Request, Response } from 'express';
import { runSeed } from '../seed/runSeed';

export const resetDemoDatabase = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await runSeed();

    return res.status(200).json({
      message: 'La base de datos de demo fue restablecida correctamente.'
    });
  } catch (error) {
    next(error);
  }
};
