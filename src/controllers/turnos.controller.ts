import { Request, Response } from "express";
import Turno from "../models/Turno"; 
import { EstadoTurno } from "../enums/EstadoTurno";
import mongoose from "mongoose";

type TurnoDTO= {//Data Transfer Object
  idTurno: string;
  especialidad: string;
  prestador: string;
  fechaTurno: Date;
  lugarAtencion: string;
  direccion: string;
  telefono: string;
  localidad: string;
}
//Get para los filtros en la búsqueda de turnos

const turnosDisponibles = async (): Promise<TurnoDTO[]> => {
  const now = new Date();

  // Traemos solo lo necesario de Turno y del Prestador
  const turnos = await Turno.find({
    estado: EstadoTurno.DISPONIBLE,
    fechaTurno: { $gte: now }
  })
    .select('_id idPrestador fechaTurno')
    .populate('idPrestador', 'nombre especialidad lugarAtencion') // <--- solo campos que necesitamos
    .sort({ fechaTurno: 1 })
    .lean(); // traer como objeto plano

  const dto: TurnoDTO[] = turnos.map((turno: any) => {
    const prestador = turno.idPrestador;
    return {
      idTurno: String(turno._id),
      especialidad: prestador?.especialidad ?? '',
      prestador: prestador?.nombre ?? '',
      fechaTurno: turno.fechaTurno,
      lugarAtencion: prestador?.lugarAtencion?.nombre ?? '',
      direccion: `${prestador?.lugarAtencion?.calle ?? ''} ${prestador?.lugarAtencion?.numero ?? ''}`,
      telefono: prestador?.lugarAtencion?.telefono ?? '',
      localidad: prestador?.lugarAtencion?.localidad ?? ''
    };
  });

  return dto;
};

const especialidadesDisponibles = async (req: Request, res: Response) => {
  //De los turnos disponibles, devolver las especialidades únicas.
  const turnos = await turnosDisponibles();

  const especialidades = [...new Set(turnos.map(turno => turno.especialidad))].sort();
  
  res.json(especialidades)
}

const localidadesPorEspecialidad = async (req: Request, res:Response) => {
  const {especialidad } = req.query;
  const turnos = await turnosDisponibles();

  const localidades = [
    ...new Set(
      turnos
        .filter(turno => turno.especialidad === especialidad)//Filtrar los turnos que coincidan con la especialidad
        .map(turno => turno.localidad)//Guardar la localidad de los turnos filtrados
    )
  ].sort();

  res.json(localidades);
}

const prestadoresPorEspecialidadYLocalidad = async (req: Request, res: Response) => {
  const {especialidad, localidad} = req.query;
  const turnos = await turnosDisponibles();

  const prestadores = [
    ...new Set(
      turnos
        .filter(turno => turno.especialidad === especialidad && turno.localidad === localidad)
        .map(turno => turno.prestador)
    )
  ].sort();
  prestadores.push('Todos');
  res.json(prestadores)
}

const turnosFiltrados = async (req: Request, res: Response) => {
  const {especialidad, localidad, prestador } = req.query;
  const turnos = await turnosDisponibles();

  const filtrados = turnos.filter( turno => 
    turno.especialidad === especialidad &&
    turno.localidad === localidad &&
    (!prestador || prestador === "Todos" || turno.prestador === prestador)
  );
  res.json(filtrados)
}


//Para manejar el afiliado

//Reservar un turno

const reservarTurno = async (req: Request, res: Response) => {
  try {
    const {idTurno, idAfiliado} = req.query;

    if (!idTurno || !idAfiliado) {
      return res.status(400).json({error: "Debe especificar idTurno e idAfiliado"})
    }

    const turno = await Turno.findById(idTurno);

    if (!turno) {
      return res.status(404).json({error:  'Turno no encontrado'})
    }

    if(turno.estado !== EstadoTurno.DISPONIBLE){
      res.status(409).json({error: 'El turno no está disponible'})
    }

    //Actualizar los datos
    turno.idAfiliado = new mongoose.Types.ObjectId(idAfiliado as string); //Cambio a ObjectId el string
    turno.estado = EstadoTurno.RESERVADO;
    await turno.save();
    res.json({message: 'Turno reservado con éxito.', idTurno})
  }catch(error) {
    console.error(error);
    res.status(500).json({error: 'Error al reservar el turno'})
  }
}

//Obtener los turnos del afiliado

const turnosPorAfiliado = async (req: Request, res: Response) => {
  try{
    const {idAfiliado} = req.params;

    if (!idAfiliado){
      return res.status(400).json({error: 'Debe especificar un idAfiliado.'})
    }

    const turnos = await Turno.find({idAfiliado})
      .populate({
        path: 'idPrestador',
        select:[
          'especialidad',
          'nombre',
          'lugarAtencion.nombre',
          'lugarAtencion.calle',
          'lugarAtencion.numero',
          'lugarAtencion.telefono',
          'lugarAtencion.localidad',
        ].join(' '),
      })
      .sort({fechaTurno:1})
      .lean();

    const dto  = turnos.map((turno:any) => {
      const prestador  = turno.idPrestador;
      return{
        idTurno: String(turno._id),
        especialidad: prestador?.especialidad ?? "",
        prestador: prestador?.nombre ?? "",
        fechaTurno: turno.fechaTurno,
        lugarAtencion: prestador?.lugarAtencion?.nombre ?? "",
        direccion: `${prestador?.lugarAtencion?.calle ?? ""} ${prestador?.lugarAtencion?.numero ?? ""}`,
        telefono: prestador?.lugarAtencion?.telefono ?? "",
        localidad: prestador?.lugarAtencion?.localidad ?? "",
      }
    })
    res.json(dto)
  } catch(error){
    console.error(error);
    res.status(500).json({error: 'Error al obtener los turnos del afiliado.'})
  }
}

// PATCH /turnos/cancelar
const cancelarTurno = async (req: Request, res: Response) => {
  try {
    const { idTurno, idAfiliado } = req.body;

    if (!idTurno || !idAfiliado) {
      return res.status(400).json({ error: "Debe especificar idTurno e idAfiliado." });
    }

    const turno = await Turno.findById(idTurno);

    if (!turno) {
      return res.status(404).json({ error: "Turno no encontrado." });
    }

    // Verificar que el turno pertenezca al afiliado indicado
    if (!turno.idAfiliado || turno.idAfiliado.toString() !== idAfiliado) {
      return res.status(403).json({ error: "El turno no pertenece a este afiliado." });
    }

    // Verificar que falte más de 1 día (24h)
    const ahora = new Date();
    const diferenciaHoras = (turno.fechaTurno.getTime() - ahora.getTime()) / (1000 * 60 * 60);

    if (diferenciaHoras <= 24) {
      return res.status(400).json({ error: "No se puede cancelar un turno con menos de 24 horas de anticipación." });
    }

    // Actualizamos: lo dejamos disponible nuevamente
    turno.estado = EstadoTurno.DISPONIBLE;
    turno.idAfiliado = undefined; // Liberamos el turno

    await turno.save();

    res.json({ message: "Turno cancelado con éxito.", idTurno });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al cancelar el turno." });
  }
};


export {
  especialidadesDisponibles,
  localidadesPorEspecialidad,
  prestadoresPorEspecialidadYLocalidad,
  turnosFiltrados,
  reservarTurno,
  turnosPorAfiliado,
  cancelarTurno
}
