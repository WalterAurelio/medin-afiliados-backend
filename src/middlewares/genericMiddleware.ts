import { Request, Response, NextFunction } from 'express';
import mongoose, { Model } from 'mongoose';
import { observacionSchema } from '../schemas/observaciones.schema';
import { ZodError } from 'zod';

/* ============= LOG DE PETICIONES ============= */
export const logRequest = (req: Request, _: Response, next: NextFunction) => {
  console.log({
    method: req.method,
    url: req.url,
    fechaHora: new Date(),
    body: req.body,
    params: req.params,
  });
  next();
};

/* ============= ERROR PERSONALIZADO ============= */
export const errorPersonalizado = (
  message: string,
  status: number,
  next: NextFunction
) => {
  const err = new Error(message) as Error & { status?: number };
  err.status = status;
  return next(err);
};

/* ============= VERIFICA EXISTENCIA DE UN ID ============= */
export const existsModelById = (
  modelo: Model<any>,
  paramName: string = 'id' // <-- Argumento nuevo
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const idBuscado = req.params[paramName]; //Se debe recibir el nombre del parámetro del id

      if (!idBuscado) {
        return errorPersonalizado(
          `No se encontró el parámetro '${paramName}' en la ruta`,
          400,
          next
        );
      }

      // Validación de ObjectId 
      if (!mongoose.Types.ObjectId.isValid(idBuscado)) {
        return errorPersonalizado(
          `El ID en el parámetro '${paramName}' es inválido`,
          400,
          next
        );
      }

      const data = await modelo.findById(idBuscado);
      if (!data) {
        return errorPersonalizado(
          `${modelo.modelName} con id ${idBuscado} no se encuentra registrado`,
          404,
          next
        );
      }
    } catch (error) {
      return next(error);
    }
    next();
  };
};

/* ============= VERIFICA QUE EXISTA ALGÚN REGISTRO ============= */
export const existsAnyByModel = (modelo: Model<any>) => {
  return async (_: Request, res: Response, next: NextFunction) => {
    try {
      const data = await modelo.findOne();
      if (!data) {
        return errorPersonalizado(
          `No hay ningún ${modelo.modelName} registrado`,
          204,
          next
        );
      }
    } catch (error) {
      return next(error);
    }
    next();
  };
};

/* ============= VALIDAR CAMPOS EXACTOS PARA BODY============= */
export const validarCamposExactos = (modelo: Model<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const camposValidos = Object.keys(modelo.schema.paths);
    const camposRecibidos = Object.keys(req.body);//LOS CAMOS QUE REVISA SON LOS DEL BODY, NO LOS DE QUERY PARAMS
    const camposInvalidos = camposRecibidos.filter(
      (campo) => !camposValidos.includes(campo)
    );

    if (camposInvalidos.length > 0) {
      return errorPersonalizado(`Hay campos inválidos`, 400, next);
    }
    next();
  };
};

/* ============= VALIDAR CAMPOS EXACTOS PARA QUERYPARAMS ============= */
export const validarQueryExactos = (modelo: Model<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const camposValidos = Object.keys(modelo.schema.paths);
    
    const camposRecibidos = Object.keys(req.query); 
    
    const camposInvalidos = camposRecibidos.filter(
      (campo) => !camposValidos.includes(campo)
    );

    if (camposInvalidos.length > 0) {
      return errorPersonalizado(`Hay campos inválidos en el query: ${camposInvalidos.join(', ')}`, 400, next);
    }
    next();
  };
};

/* ============= EXISTE MODELO EN REQUEST BODY ============= */
export const existModelRequest = (modelo: Model<any>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    //Recibe un modelo y lo compara con el body
    const nombreModelo = modelo.modelName;
    const modeloId = req.body[nombreModelo.toLowerCase() + 'Id'];
    if (!modeloId) {
      return errorPersonalizado(
        `El ID del ${modelo.modelName} es requerido`,
        400,
        next
      );
    }
    if (!mongoose.Types.ObjectId.isValid(modeloId)) {
      return errorPersonalizado(
        `El ID del ${modelo.modelName} es inválido`,
        400,
        next
      );
    }
    const aux = await modelo.findById(modeloId);
    if (!aux) {
      return errorPersonalizado(
        `${modelo.modelName} con ID ${modeloId} no encontrado`,
        404,
        next
      );
    }
    next();
  };
};

/* ============= MANEJO GLOBAL DE ERRORES ============= */
export const manejoDeErroresGlobales = (
  err: any,
  _: Request,
  res: Response,
  __: NextFunction
) => {
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e: any) => e.message);
    return res.status(400).json({ error: messages });
  }
  if (err.status) {
    return res.status(err.status).json({ error: err.message });
  }
  return res.status(500).json({ error: 'Error interno del servidor' });
};

export const validarObservacion = (req: Request, res: Response, next: NextFunction) => {
  const data = req.body;    
    try { 
      observacionSchema.parse(data); 
    } catch (error) {
       if(error instanceof ZodError) {
        return errorPersonalizado(
          error.issues[0].message,
          400,
          next
        );
       };
    }
    next();   
};
