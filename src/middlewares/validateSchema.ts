import { Request, Response, NextFunction } from 'express';
import { z, ZodObject } from 'zod';

export const validateSchema = (aSchema: ZodObject) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = aSchema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({ errors: z.flattenError(result.error) });
      return;
    }
    next();
  };
};
