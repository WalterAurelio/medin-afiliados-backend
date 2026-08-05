import { NextFunction, Request, Response } from "express";
import { errorPersonalizado } from "./genericMiddleware";
import { ZodError } from "zod";

export const validarAutorizacion = (schemaAutorizacion: any) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const data = req.body;    
        try { 
            schemaAutorizacion.parse(data); 
        } catch (error) {
            if(error instanceof ZodError) {
                return errorPersonalizado(error.issues[0].message, 400, next);
            };
        };   
        next();
    }
};