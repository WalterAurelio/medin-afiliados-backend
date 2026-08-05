import { Request, Response, NextFunction } from 'express';
// import { getAfiliadoByDocumento, obtenerGrupoFamiliar, registrarCBU } from '../validators/afiliado.validator';

import Afiliado from '../models/Afiliado';
import { ApiResponse } from '../types/ApiResponse';
import { MiCuentaDTO } from '../dtos/miCuenta.dto';
import { ERROR_MESSAGES } from '../utils/errorMessages';

import { DatosActualizados } from '../types/CbuTypes';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    rol?: string;
    nroDocumento?: string;
  };
}

type CBU = {
  tipoDeCuenta: string;
  cuil: string;
  nombre: string;
  apellido: string;
  cbu: string;
};

interface IMiCuentaController {
  getMiCuenta: (req: Request, res: Response<ApiResponse>) => Promise<void>;
  registerCbu: (req: Request<{}, {}, CBU>, res: Response<ApiResponse>) => Promise<void>;
  setMainCbu: (req: Request<{}, {}, { nroCbu: string }>, res: Response<ApiResponse>) => Promise<void>;
  editCbu: (req: Request<{ cbu: string }, {}, DatosActualizados>, res: Response<ApiResponse>, next: NextFunction) => Promise<void>;
  deleteCbu: (req: Request<{ cbu: string }>, res: Response, next: NextFunction) => Promise<void>;
}
export const miCuentaController: IMiCuentaController = {
  getMiCuenta: async (req, res) => {
    const nroDocumento = req.nroDocumento;
    const idsAfiliados = req.familiaresPermitidos;

    try {
      const unAfiliado = await Afiliado.findOne({ nroDocumento }).populate({
        path: 'grupoFamiliar',
        match: { _id: { $in: idsAfiliados } }
      });
      if (!unAfiliado) {
        res.status(404).json({ message: 'No se encontraron datos del afiliado solicitado.' });
        return;
      }

      const miCuentaDTO = new MiCuentaDTO(unAfiliado);
      res.json({ data: miCuentaDTO });
    } catch (error) {
      const message = ERROR_MESSAGES.GENERAL.UNKNOWN(error);
      res.status(500).json({ message });
    }
  },
  registerCbu: async (req, res) => {
    const nroDocumento = req.nroDocumento;

    try {
      const cbuBody = req.body;
      const unAfiliado = await Afiliado.findOne({ nroDocumento });
      if (!unAfiliado) {
        res.status(404).json({ message: 'No se encontraron datos del afiliado solicitado.' });
        return;
      }

      const cbuEnUso = unAfiliado.cbus.some(entry => entry.cbu === cbuBody.cbu);
      if (cbuEnUso) {
        res.status(409).json({ message: 'El CBU ingresado ya se encuentra registrado.' });
        return;
      }

      unAfiliado.cbus = [...unAfiliado.cbus, cbuBody];
      await unAfiliado.save();

      res.json({ message: 'El CBU fue registrado exitosamente.' });
    } catch (error) {
      const message = ERROR_MESSAGES.GENERAL.UNKNOWN(error);
      res.status(500).json({ message });
    }
  },
  setMainCbu: async (req, res) => {
    const nroDocumento = req.nroDocumento;

    try {
      const unAfiliado = await Afiliado.findOne({ nroDocumento });
      if (!unAfiliado) {
        res.status(404).json({ message: 'No se encontraron datos del afiliado solicitado.' });
        return;
      }

      unAfiliado.cbuPrincipal = req.body.nroCbu;
      await unAfiliado.save();

      res.json({ message: 'El CBU se ha establecido como principal.' });
    } catch (error) {
      const message = ERROR_MESSAGES.GENERAL.UNKNOWN(error);
      res.status(500).json({ message });
    }
  },
  editCbu: async (req, res, next) => {
    const { cbu } = req.params;
    const datosActualizados = req.body;
    const nroDocumento = req.nroDocumento;

    try {
      const afiliado = await Afiliado.findOne({ nroDocumento });
      if (!afiliado) {
        res.status(404).json({ message: 'No se encontraron datos del afiliado solicitado.' });
        return;
      }

      const cbuExistente = afiliado.cbus.find(entry => entry.cbu === cbu);
      if (!cbuExistente) {
        res.status(404).json({ message: 'No se encontraron datos del CBU solicitado.' });
        return;
      }

      Object.assign(cbuExistente, datosActualizados);
      const cbuActualizado = await afiliado.save();
      res.json({ data: cbuActualizado, message: 'El CBU fue actualizado correctamente.' });
    } catch (error) {
      next(error);
    }
  },
  deleteCbu: async (req, res, next) => {
    const nroDocumento = req.nroDocumento;
    const { cbu } = req.params;

    try {
      const unAfiliado = await Afiliado.findOne({ nroDocumento });
      if (!unAfiliado) {
        res.status(404).json({ message: 'No se encontraron datos del afiliado solicitado.' });
        return;
      }

      const cbuArrFiltered = unAfiliado.cbus.filter(entry => entry.cbu !== cbu);
      unAfiliado.cbus = [...cbuArrFiltered];
      unAfiliado.cbuPrincipal = undefined;
      await unAfiliado.save();
      res.json({ message: 'El CBU fue eliminado exitosamente.' });
    } catch (error) {
      next(error);
    }
  }
};
