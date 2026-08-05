import { Router } from "express";
import autorizacionController from "../controllers/autorizacion.controller";
import Autorizacion from "../models/Autorizacion";
import { logRequest, existsModelById, validarCamposExactos, validarObservacion } from "../middlewares/genericMiddleware";
import { filtroAfiliadoActual } from "../middlewares/filtroAfiliadoActual";
import Afiliado from "../models/Afiliado";
import { autorizacionSchema } from "../schemas/autorizacion.schema";
import { validarAutorizacion } from '../middlewares/autorizacionMiddleware';
const router = Router();

router.use(logRequest);

router.get(
  "/autorizaciones/:idAfiliado",
  //Middleware genérico
  existsModelById(Afiliado, 'idAfiliado'),
  filtroAfiliadoActual,
  autorizacionController.getAllAutorizaciones
);

router.post(
  "/autorizaciones",
  validarCamposExactos(Autorizacion),
  validarAutorizacion(autorizacionSchema),
  autorizacionController.createAutorizacion
);

router
  .route("/autorizaciones/:id")
  .put(
    //Middleware genérico
    existsModelById(Autorizacion), 
    validarCamposExactos(Autorizacion),
    validarAutorizacion(autorizacionSchema),
    autorizacionController.updateAutorizacion
  )
  .patch(
    existsModelById(Autorizacion), //Middleware genérico
    autorizacionController.deleteAutorizacion
  )
  .post(
    existsModelById(Autorizacion),
    validarObservacion,
    autorizacionController.commentAutorizacionById);

export default router