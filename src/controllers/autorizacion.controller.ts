import { NextFunction, Request, Response } from "express";
import  Autorizacion  from "../models/Autorizacion";
import { IAutorizacion } from '../interfaces/IAutorizacion';
import { SUCCESS_MESSAGES } from "../utils/successMessages";
import { ERROR_MESSAGES } from "../utils/errorMessages";
import { GetAutorizacionesDTO, IdAutorizacionDTO, CommentAutorizacionDTO } from "../dtos/autorizaciones.dto";
import { ApiResponse } from '../types/ApiResponse';
import { IObservacion } from '../interfaces/IObservacion';
import { EstadoTramite } from "../enums/EstadoTramite";
import { nextTick } from "process";

interface IAutorizacionController {
    getAllAutorizaciones: (req: Request, res: Response<ApiResponse>, next: NextFunction) => Promise<void>;
    createAutorizacion: (req: Request, res: Response<ApiResponse>, next: NextFunction) => Promise<void>;
    updateAutorizacion: (req: Request<{id: string}, {}, Partial<UpdatedAutorizacion>>, res: Response<ApiResponse>, next: NextFunction) => Promise<void>;
    deleteAutorizacion: (req: Request<{id: string}>, res: Response<ApiResponse>, next: NextFunction) => Promise<void>;
    commentAutorizacionById: (req: Request<{id: string}>, res: Response<ApiResponse>, next: NextFunction) => Promise<void>;
}

type UpdatedAutorizacion = Omit<IAutorizacion, 'observaciones'> & {
  observaciones: string;
};


const autorizacionController: IAutorizacionController = {
    getAllAutorizaciones : async (req, res, next) => {
        const idsAfiliados = req.familiaresPermitidos;
        try {
            const autorizaciones = await Autorizacion.find({ $and:[{fechaBaja: {$exists: false}} , {idAfiliado: { $in: idsAfiliados }} ]}).populate('idAfiliado', 'rol').sort('-updatedAt');
            if(autorizaciones.length === 0) {
                res.status(204).json({ message: 'No hay autorizaciones.' }); 
                return;
            }
            const autorizacionesDTO = autorizaciones.map(a => new GetAutorizacionesDTO(a));
            res.status(200).json({ data: autorizacionesDTO });
        } catch(error) {
            next(error)
        }
    },
    createAutorizacion : async (req, res, next) => {
        const observacion: IObservacion = {
            idEmisor: req.body.idAfiliado,
            rolEmisor: 'Afiliado',
            descripcion: req.body.observaciones,
            fecha: new Date()
        };
        try {
            const nuevaAutorizacion = await Autorizacion.create({...req.body, observaciones: [observacion]});
            res.status(200).json({ data: new IdAutorizacionDTO(nuevaAutorizacion), message: SUCCESS_MESSAGES.AUTORIZACION.CREATED });
        } catch(error) {
            next(error)
        }
    },
    updateAutorizacion : async (req, res, next) => {
        const descripcionObservacion = req.body.observaciones || '';
        const { id } = req.params;

        try {
          const autorizacion = await Autorizacion.findById(id);
          if (!autorizacion) { 
            res.status(404).json({ message: ERROR_MESSAGES.AUTORIZACION.NOT_FOUND});
            return;
          }

          const updatedObservacion: IObservacion = { // Esta es una única observación
            ...autorizacion?.observaciones[0],
            descripcion: descripcionObservacion,
            rolEmisor: "Afiliado"
          };

          const autorizacionBody = {
            ...req.body,
            observaciones: [updatedObservacion]
          };
          Object.assign(autorizacion!, autorizacionBody);
          const autorizacionActualizada = await autorizacion.save();
          res.status(200).json({ data: new IdAutorizacionDTO(autorizacionActualizada), message: SUCCESS_MESSAGES.AUTORIZACION.UPDATED });
        } catch(error) {
          next(error)
        }
    },
    deleteAutorizacion : async (req, res, next) => {
        try {
            const { id } = req.params;
            const autorizacion = await Autorizacion.findById(id);
            if (!autorizacion) {
                res.status(404).json({ message: ERROR_MESSAGES.AUTORIZACION.NOT_FOUND});
                return;
            }
            autorizacion.fechaBaja = new Date();
            await autorizacion.save();

            res.status(200).json({ data: new IdAutorizacionDTO(autorizacion), message: SUCCESS_MESSAGES.AUTORIZACION.DELETED });
        } catch(error) {
            next(error)
        }
    },
    commentAutorizacionById : async (req, res, next) => {
        const { id } = req.params;
        const { comentario } = req.body;
        const idAfiliado = req.familiaresPermitidos?.[0];
        const observacion: IObservacion = {
            idEmisor: idAfiliado!,
            rolEmisor: 'Afiliado',
            descripcion: comentario,
            fecha: new Date()
        };
       
        try {
          const autorizacion = await Autorizacion.findById(id);
            if (!autorizacion) {
                res.status(404).json({ message: ERROR_MESSAGES.AUTORIZACION.NOT_FOUND });
                return;
            }
            autorizacion.observaciones = [...autorizacion.observaciones, observacion];
            autorizacion.estado = EstadoTramite.EN_ANALISIS;
            const commentedAutorizacion = await autorizacion.save();
            const commentedAutorizacionDTO = new CommentAutorizacionDTO(commentedAutorizacion);
            res.json({ data: commentedAutorizacionDTO, message: SUCCESS_MESSAGES.AUTORIZACION.COMMENTED });
        } catch (error) {
            next(error)//Manejo de errores globales
        }
    }
};

export default autorizacionController;

