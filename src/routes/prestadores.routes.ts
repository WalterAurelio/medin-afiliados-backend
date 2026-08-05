import { Router } from "express";
import prestadorController from "../controllers/prestador.controller";
import { validarEspecialidad, validarLocalidad } from "../middlewares/prestadorMiddelware";

const router = Router();

router.get("/prestadores",
    //Verificar que exista la especialidad
    validarEspecialidad,
    //Verificar que exista la localidad
    validarLocalidad,
    prestadorController.getPrestadores);

export default router;
