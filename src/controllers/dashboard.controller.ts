import { Request, Response } from "express";
import { ERROR_MESSAGES } from '../utils/errorMessages';
import Turno from "../models/Turno";
import Autorizacion from "../models/Autorizacion";
import Receta from "../models/Receta";
import Reintegro from "../models/Reintegro";
import { AutorizacionesDashboardDTO, RecetasDashboardDTO, ReintegrosDashboardDTO } from "../dtos/dashboard.dto";
import { SUCCESS_MESSAGES } from "../utils/successMessages";

export type TurnoDTO = {
  idTurno: string;
  especialidad: string;
  prestador: string;
  afiliado: string;
  fechaTurno: Date;
  lugarAtencion: string;
  direccion: string;
  telefono: string;
  localidad: string;
}

type ApiResponse = {
  message?: string;
  dataTramites?: object;
  dataTurnos?: object;
  accessToken?: string;
};

interface IDashboardController {
    getLatestTurnos: (req: Request, res: Response<ApiResponse>) => Promise<void>;
    getLatestTramites: (req: Request, res: Response<ApiResponse>) => Promise<void>;
}

const dashboardController : IDashboardController = {
    getLatestTurnos: async (req, res) => {
        const idsAfiliados = req.familiaresPermitidos;
        try {
            const turnos = await Turno.find({ $and:[{fechaTurno: {$gte: new Date()}},{idAfiliado: { $in: idsAfiliados }}] })
                .select('_id idPrestador fechaTurno')
                .populate('idPrestador', 'nombre especialidad lugarAtencion')
                .populate('idAfiliado', 'nombre apellido')
                .sort('fechaTurno').limit(4)
                .lean(); // traer como objeto plano

            const turnosDto: TurnoDTO[] = turnos.map((turno: any) => {
                const prestador = turno.idPrestador;
                const afiliado = turno.idAfiliado;

                return {
                idTurno: String(turno._id),
                especialidad: prestador?.especialidad ?? '',
                prestador: prestador?.nombre ?? '',
                idAfiliado: String(afiliado?._id) ?? '',
                afiliado: `${afiliado.nombre ?? ''} ${afiliado.apellido ?? ''}`,
                fechaTurno: turno.fechaTurno,
                lugarAtencion: prestador?.lugarAtencion?.nombre ?? '',
                direccion: `${prestador?.lugarAtencion?.calle ?? ''} ${prestador?.lugarAtencion?.numero ?? ''}`,
                telefono: prestador?.lugarAtencion?.telefono ?? '',
                localidad: prestador?.lugarAtencion?.localidad ?? ''
                };
            });

            if(!turnos.length) {
                res.status(204).json({ message: 'No hay turnos registrados' }); 
                return;
            }
            res.status(200).json({ dataTurnos: turnosDto });
            } catch(error) {
                const message = ERROR_MESSAGES.GENERAL.UNKNOWN(error)
                res.status(500).json({ message });
            }
    },

    getLatestTramites: async (req, res) => {
        const idsAfiliados = req.familiaresPermitidos;
        const condicionTramite = { $and:[{fechaBaja: {$exists: false}} , {idAfiliado: { $in: idsAfiliados }} ]}

        try {
            const [ultimasRecetas, ultimaAutorizacion, ultimoReintegro] = await Promise.all([
                Receta.find(condicionTramite).sort('-updatedAt').limit(2),
                Autorizacion.find(condicionTramite).sort('-updatedAt').limit(1),
                Reintegro.find(condicionTramite).sort('-updatedAt').limit(1),
            ]);

            if(!ultimaAutorizacion.length && !ultimasRecetas.length && !ultimoReintegro.length) {
                res.status(204).json({ message: SUCCESS_MESSAGES.TRAMITES.NO_CONTENT});
                return
            }

            const [receta1DTO, receta2DTO] = ultimasRecetas.map(r => new RecetasDashboardDTO(r));
            const [autorizacionDTO] = ultimaAutorizacion.map(a => new AutorizacionesDashboardDTO(a));
            const [reintegroDTO] = ultimoReintegro.map(r => new ReintegrosDashboardDTO(r));

            res.status(200).json({ dataTramites: [receta1DTO, receta2DTO, autorizacionDTO, reintegroDTO ]});
            } catch(error) {
                const message = ERROR_MESSAGES.GENERAL.UNKNOWN(error)
                res.status(500).json({ message });
            }
    }
}

export default dashboardController;