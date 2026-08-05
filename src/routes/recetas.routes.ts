import { Router } from "express";
import recetaController from "../controllers/recetas.controller";
import Receta from "../models/Receta";
import {
  logRequest,
  existsModelById,
  validarCamposExactos,
} from "../middlewares/genericMiddleware";
import { filtroAfiliadoActual } from "../middlewares/filtroAfiliadoActual";
import Afiliado from "../models/Afiliado";
import { validarReceta } from "../middlewares/recetaMiddleware";
import { recetaSchema } from "../schemas/receta.schema";

const router = Router();

router.use(logRequest);

router.get(
  "/recetas/:idAfiliado",
  existsModelById(Afiliado, "idAfiliado"),
  filtroAfiliadoActual,
  recetaController.getAllRecetas
);
router.post(
  "/recetas",
  //Middlewares
  validarCamposExactos(Receta),
  validarReceta(recetaSchema),
  recetaController.createReceta
);
router.put(
  "/recetas/:id",
  //Middlewares
  existsModelById(Receta),
  validarCamposExactos(Receta),
  validarReceta(recetaSchema),
  recetaController.updateReceta
);
router.patch(
  "/recetas/:id",
  //MIddlewares
  existsModelById(Receta),
  recetaController.deleteReceta
);
router.post(
  "/recetas/:id",
  existsModelById(Receta),
  recetaController.commentRecetaById
);

router.get(
  "/receta/:id",
  existsModelById(Receta),
  recetaController.getRecetaById
);

export default router;
