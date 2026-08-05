import { NextFunction, Request, Response } from "express";
import Receta from "../models/Receta";
import { IReceta } from "../interfaces/IReceta";
import { SUCCESS_MESSAGES } from "../utils/successMessages";
import { ERROR_MESSAGES } from "../utils/errorMessages";
import {
  GetRecetasDTO,
  IdRecetaDTO,
  CommentRecetaDTO,
} from "../dtos/recetas.dto";
import { ApiResponse } from "../types/ApiResponse";
import { IObservacion } from "../interfaces/IObservacion";
import Afiliado from "../models/Afiliado";
import { EstadoTramite } from "../enums/EstadoTramite";
import { errorPersonalizado } from "../middlewares/genericMiddleware";

interface IRecetaController {
  getAllRecetas(
    req: Request,
    res: Response<ApiResponse>,
    next: NextFunction
  ): Promise<void>;
  createReceta(
    req: Request,
    res: Response<ApiResponse>,
    next: NextFunction
  ): Promise<void>;
  updateReceta: (
    req: Request<{ id: string }>,
    res: Response<ApiResponse>,
    next: NextFunction
  ) => Promise<void>;
  deleteReceta(
    req: Request<{ id: string }>,
    res: Response<ApiResponse>,
    next: NextFunction
  ): Promise<void>;

  commentRecetaById: (
    req: Request<{ id: string }, {}, { comentario: string }>,
    res: Response<ApiResponse>,
    next: NextFunction
  ) => Promise<void>;
  getRecetaById(
    req: Request,
    res: Response<ApiResponse>,
    next: NextFunction
  ): Promise<void>;
}
type UpdatedReceta = Omit<IReceta, "observaciones"> & {
  observaciones: string;
};

const recetaController: IRecetaController = {
  getAllRecetas: async (req, res, next) => {
    const idsAfiliados = req.familiaresPermitidos;
    console.log("BODY RECIBIDO:", req.body);
    try {
      const recetas = await Receta.find({
        $and: [
          { idAfiliado: { $in: idsAfiliados } },
          { fechaBaja: { $exists: false } },
        ],
      }).populate<{ idAfiliado: { rol: string, nroAfiliado: string } }>("idAfiliado", "rol nroAfiliado").sort('-updatedAt');
      if (recetas.length === 0) {
        res.status(204).json({ message: "No hay recetas." });
        return;
      }
      const recetasDTO = recetas.map((receta) => new GetRecetasDTO(receta));
      console.log(recetasDTO);
      res.json({ data: recetasDTO });
    } catch (error) {
      console.log("ERROR AL CREAR RECETA:", error);
      next(error);
    }
  },
  createReceta: async (req, res, next) => {
    //const idAfiliado = req.familiaresPermitidos?.[0];
    const observacion: IObservacion = {
      idEmisor: req.body.idAfiliado,
      rolEmisor: "Afiliado",
      descripcion: req.body.observaciones,
      fecha: new Date(),
    };
    const recetaBody = {
      ...req.body,
      // idAfiliado,
      // nroAfiliado: unAfiliado.nroAfiliado,
      observaciones: [observacion],
    };

    try {
      /*const unAfiliado = await Afiliado.findById(idAfiliado);
      if (!unAfiliado) {
        return errorPersonalizado("No se encontró el afiliado", 404, next);*/
        const newReceta = await Receta.create(recetaBody);
      const newRecetaDTO = new IdRecetaDTO(newReceta);
      res.json({
        data: newRecetaDTO,
        message: SUCCESS_MESSAGES.RECETA.CREATED,
      });
    } catch (error) {
      next(error);
    }
  },

  updateReceta: async (req, res, next) => {
    const descripcionObservacion = req.body.observaciones || "";
    const { id } = req.params;

    try {
      console.log(req.body);
      const receta = await Receta.findById(id);
      if (!receta) {
        res.status(404).json({ message: ERROR_MESSAGES.RECETA.NOT_FOUND });
        return;
      }
      if (!Array.isArray(receta.observaciones)) {
        receta.observaciones = [];
      }
      const updatedReceta: IObservacion = {
        ...(receta.observaciones[0] ?? {}),
        descripcion: descripcionObservacion,
        rolEmisor: "Afiliado",
        //fecha: new Date(),
      };

      const recetaBody = {
        ...req.body,
        observaciones: [updatedReceta],
      };
      Object.assign(receta, recetaBody);
      const recetaActualizada = await receta.save();
      res.status(200).json({
        data: new IdRecetaDTO(recetaActualizada),
        message: SUCCESS_MESSAGES.RECETA.UPDATED,
      });
    } catch (error) {
      next(error);
    }
  },

  deleteReceta: async (req, res, next) => {
    try {
      const { id } = req.params;
      const receta = await Receta.findById(id);
      if (!receta) {
        res.status(404).json({ message: ERROR_MESSAGES.RECETA.NOT_FOUND });
        return;
      }
      receta.fechaBaja = new Date();
      await receta.save();

      res.status(200).json({
        data: new IdRecetaDTO(receta),
        message: SUCCESS_MESSAGES.RECETA.DELETED,
      });
    } catch (error) {
      next(error);
    }
  },

  commentRecetaById: async (req, res, next) => {
    const { id } = req.params;
    const { comentario } = req.body;
    const idAfiliado = req.familiaresPermitidos?.[0];

    const observacion: IObservacion = {
      idEmisor: idAfiliado!,
      rolEmisor: "Afiliado",
      descripcion: comentario,
      fecha: new Date(),
    };

    try {
      const unaReceta = await Receta.findById(id);
      if (!unaReceta) {
        res.status(404).json({ message: ERROR_MESSAGES.RECETA.NOT_FOUND });
        return;
      }
      unaReceta.observaciones = [...unaReceta.observaciones, observacion];
      unaReceta.estado = EstadoTramite.EN_ANALISIS;
      const commentedReceta = await unaReceta.save();
      const commentedRecetaDTO = new CommentRecetaDTO(commentedReceta);
      res.json({
        data: commentedRecetaDTO,
        message: SUCCESS_MESSAGES.RECETA.COMMENTED,
      });
    } catch (error) {
      next(error);
    }
  },
  getRecetaById: async (req, res, next) => {
    const { id } = req.params;

    try {
      const receta = await Receta.findById(id);

      if (!receta) {
        res.status(404).json({ message: ERROR_MESSAGES.RECETA.NOT_FOUND });
        return;
      }

      res.status(200).json({ data: new GetRecetasDTO(receta) });
    } catch (error) {
      next(error);
    }
  },
};
export default recetaController;
