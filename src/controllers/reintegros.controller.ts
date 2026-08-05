import { NextFunction, Request, Response } from 'express';
import IReintegro from '../interfaces/IReintegro';
import Reintegro from '../models/Reintegro';
import { SUCCESS_MESSAGES } from '../utils/successMessages';
import { ERROR_MESSAGES } from '../utils/errorMessages';
import { CommentReintegroDTO, DeleteReintegroDTO, GetReintegrosDTO, PostReintegroDTO, PutReintegroDTO } from '../dtos/reintegros.dto';
import { ApiResponse } from '../types/ApiResponse';
import { IObservacion } from '../interfaces/IObservacion';
import { EstadoTramite } from '../enums/EstadoTramite';

type UpdatedReintegro = Omit<IReintegro, 'observaciones'> & {
  observaciones: string;
};

interface IReintegroController {
  getAllReintegros: (req: Request, res: Response<ApiResponse>, next: NextFunction) => Promise<void>;
  createReintegro: (req: Request, res: Response<ApiResponse>, next: NextFunction) => Promise<void>;
  updateReintegro: (req: Request<{ id: string }, {}, Partial<UpdatedReintegro>>, res: Response<ApiResponse>, next: NextFunction) => Promise<void>;
  deleteReintegro: (req: Request<{ id: string }>, res: Response<ApiResponse>, next: NextFunction) => Promise<void>;
  commentReintegroById: (req: Request<{ id: string }, {}, { comentario: string }>, res: Response<ApiResponse>, next: NextFunction) => Promise<void>;
}

const reintegroController: IReintegroController = {
  getAllReintegros: async (req, res, next) => {
    const idsAfiliados = req.familiaresPermitidos;

    try {
      const reintegros = await Reintegro.find({ $and: [{ fechaBaja: { $exists: false } }, { idAfiliado: { $in: idsAfiliados } }] })
        .sort('-updatedAt')
        .populate<{ idAfiliado: { rol: string } }>('idAfiliado', 'rol');

      const reintegrosDTO = reintegros.map(reintegro => new GetReintegrosDTO(reintegro));
      res.json({ data: reintegrosDTO });
    } catch (error) {
      next(error);
    }
  },
  createReintegro: async (req, res, next) => {
    // const idAfiliado = req.familiaresPermitidos?.[0]; // El primer id corresponde a quien hizo la petición
    const observacion: IObservacion = {
      idEmisor: req.body.idAfiliado,
      rolEmisor: 'Afiliado',
      descripcion: req.body.observaciones,
      fecha: new Date()
    };
    const reintegroBody = {
      ...req.body,
      cbu: req.body.formaDePago === 'transferencia' ? req.body.cbu : '',
      observaciones: [observacion]
      // idAfiliado
    };

    try {
      const newReintegro = await Reintegro.create(reintegroBody);
      const newReintegroDTO = new PostReintegroDTO(newReintegro);
      res.json({ data: newReintegroDTO, message: SUCCESS_MESSAGES.REINTEGRO.CREATED });
    } catch (error) {
      next(error);
    }
  },
  updateReintegro: async (req, res, next) => {
    const { id } = req.params;
    const descripcionObservacion = req.body.observaciones || '';

    try {
      const unReintegro = await Reintegro.findById(id);
      if (!unReintegro) {
        res.status(404).json({ message: ERROR_MESSAGES.REINTEGRO.NOT_FOUND });
        return;
      }

      const updatedObservacion: IObservacion = {
        ...unReintegro.observaciones[0],
        descripcion: descripcionObservacion
      };

      const reintegroBody = {
        ...req.body,
        cbu: req.body.formaDePago === 'transferencia' ? req.body.cbu : '',
        observaciones: [updatedObservacion]
      };

      Object.assign(unReintegro, reintegroBody);
      const updatedReintegro = await unReintegro.save();
      const updatedReintegroDTO = new PutReintegroDTO(updatedReintegro);
      res.json({ data: updatedReintegroDTO, message: SUCCESS_MESSAGES.REINTEGRO.UPDATED });
    } catch (error) {
      next(error);
    }
  },
  deleteReintegro: async (req, res, next) => {
    const { id } = req.params;

    try {
      const reintegro = await Reintegro.findById(id);
      if (!reintegro) {
        res.status(404).json({ message: ERROR_MESSAGES.REINTEGRO.NOT_FOUND });
        return;
      }
      reintegro.fechaBaja = new Date();
      await reintegro.save();

      const deletedReintegroDTO = new DeleteReintegroDTO(reintegro);
      res.json({ data: deletedReintegroDTO, message: SUCCESS_MESSAGES.REINTEGRO.DELETED });
    } catch (error) {
      next(error);
    }
  },
  commentReintegroById: async (req, res, next) => {
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
      const unReintegro = await Reintegro.findById(id);
      if (!unReintegro) {
        res.status(404).json({ message: ERROR_MESSAGES.REINTEGRO.NOT_FOUND });
        return;
      }

      unReintegro.observaciones = [...unReintegro.observaciones, observacion];
      unReintegro.estado = EstadoTramite.EN_ANALISIS;
      const commentedReintegro = await unReintegro.save();

      const commentedReintegroDTO = new CommentReintegroDTO(commentedReintegro);
      res.json({ data: commentedReintegroDTO, message: SUCCESS_MESSAGES.REINTEGRO.COMMENTED });
    } catch (error) {
      next(error);
    }
  }
};

export default reintegroController;
