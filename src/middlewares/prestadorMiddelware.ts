import { Request, Response, NextFunction } from "express"
import { errorPersonalizado } from "./genericMiddleware";
import { Prestador } from "../models/Prestador";


export const validarLocalidad = async (req: Request, res: Response, next: NextFunction) => {
    const { localidad } = req.query
    if (!localidad) {
        return errorPersonalizado('No se envió una localidad', 400, next)
    }
    const localidadesValidas = await Prestador.distinct('lugarAtencion.localidad');
    const existe = localidadesValidas
        .map(l => l.toLowerCase())
        .includes((localidad as string).toLowerCase());
    if (!existe) {
        return errorPersonalizado(`La localidad ${localidad} no existe`, 400, next)
    }
    next();
}


export const validarEspecialidad = async (req: Request, res: Response, next: NextFunction) => {
    const { especialidad } = req.query;
    if (!especialidad) {
        return errorPersonalizado('No se envió una especialidad', 400, next)
    }
    const especialidadesValidas = await Prestador.distinct('especialidad');
    const existe = especialidadesValidas
        .map(e => e.toLowerCase())
        .includes((especialidad as string).toLowerCase());

    if (!existe) {
        return errorPersonalizado(`La especialidad ${especialidad} no existe`, 400, next)
    }
    
    next();
}