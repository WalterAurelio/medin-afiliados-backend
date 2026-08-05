import { Document, Types } from "mongoose";
import { EstadoTurno } from "../enums/EstadoTurno";

export interface ITurno {
  idPrestador: Types.ObjectId;
  nroAfiliado: string;
  especialidad: string;
  lugarAtencion: string;
  telefono: number; // teléfono del lugar de atención
  fechaTurno: Date;
  estado: EstadoTurno; // 'disponible' | 'reservado'
  prestador: Types.ObjectId;
  idAfiliado?: Types.ObjectId;
  fechaBaja?: Date;
}

export interface ITurnoDocument extends ITurno, Document {}
