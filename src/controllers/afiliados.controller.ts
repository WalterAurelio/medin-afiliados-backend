import { Request, Response } from 'express';
import Afiliado, { IAfiliadoDocument } from '../models/Afiliado';
import { ApiResponse } from '../types/ApiResponse';
import { ERROR_MESSAGES } from '../utils/errorMessages';
import { GetAfiliadoDTO } from '../dtos/afiliados.dto';

interface IAfiliadoController {
  getAfiliado: (req: Request, res: Response<ApiResponse>) => Promise<void>;
}

const afiliadoController: IAfiliadoController = {
  getAfiliado: async (req, res) => {
    const nroDocumento = req.nroDocumento;
    const idsAfiliados = req.familiaresPermitidos;

    try {
      const unAfiliado = await Afiliado.findOne({ nroDocumento }).populate<{ grupoFamiliar: IAfiliadoDocument[] }>({
        path: 'grupoFamiliar',
        match: { _id: { $in: idsAfiliados } }
      });

      if (!unAfiliado) {
        res.status(404).json({ message: 'No se encontró el afiliado solicitado.' });
        return;
      }

      const unAfiliadoDTO = new GetAfiliadoDTO(unAfiliado);
      res.json({ data: unAfiliadoDTO });
    } catch (error) {
      const message = ERROR_MESSAGES.GENERAL.UNKNOWN(error);
      res.status(500).json({ message });
    }
  }
};
export default afiliadoController;
