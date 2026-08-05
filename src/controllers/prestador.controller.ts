import { Request, Response } from "express";
import { PrestadorDTO } from "../dtos/prestador.dto";
import { Prestador } from "../models/Prestador";



const prestadorController = {
  //  prestadores filtrados por especialidad y/o localidad
  getPrestadores: async (req: Request, res: Response) => {
    try {

      const { especialidad, localidad } = req.query as {
        especialidad?: string;
        localidad?: string;
      };
      console.log({
        buscandoCon: {
          especialidad: especialidad,
          localidad: localidad
        }
      })
      // Este será el objeto de filtro para Mongoose
      const filterQuery: any = {};

      // Si el query param 'especialidad' existe, lo añadimos al filtro
      if (especialidad) {
        filterQuery.especialidad = especialidad;
      }

      // Si el query param 'localidad' existe, lo añadimos al filtro
      // Usamos "dot notation" para el campo anidado
      if (localidad) {
        filterQuery["lugarAtencion.localidad"] = localidad;
      }

      // Ejecutamos la búsqueda en la base de datos
      // find(filterQuery) buscará los prestadores que cumplan con ambos filtros
      const resultado = await Prestador.find(filterQuery);

      // Si no se encuentra nada, el frontend ya maneja el array vacío
      // (Tu código de React tiene: 'filters && prestadores.length ? ...')
      // Así que simplemente devolvemos el array (que estará vacío)
      if (!resultado) {
        return res.status(200).json([]);
      }

      // Mapeamos a DTO como ya lo hacías
      // Es buena práctica usar .toObject() o .lean() antes de mapear
      const result = resultado.map((p) => new PrestadorDTO(p.toObject()));
      res.status(200).json(result);
      
    } catch (error) {
      console.error(" Error en getPrestadores:", error);
      res.status(500).json({ message: "Error al filtrar prestadores" });
    }
  },
};

export default prestadorController;
