import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { errorPersonalizado } from "./genericMiddleware";

export const validarReceta = (schema: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const data = req.body;

    try {
      schema.parse(data);
    } catch (error) {
      if (error instanceof ZodError) {
        return errorPersonalizado(error.issues[0].message, 400, next);
      }
    }

    next();
  };
};
