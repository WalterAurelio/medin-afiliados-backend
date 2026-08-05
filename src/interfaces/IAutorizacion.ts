import { Types } from "mongoose";
import { EstadoTramite } from "../enums/EstadoTramite";
import { IObservacion } from "./IObservacion";

export interface IAutorizacion {
  id: string;
  idAfiliado: Types.ObjectId
  paraAfiliado: string;
  nroAfiliado?: string; 
  fechaSolicitud: Date;
  practica: string;
  especialidad: string;
  medicoSolicitante: string;
  lugarAtencion: string;
  diagnostico?: string;
  observaciones: IObservacion[];
  diasDeInternacion: number;
  estado: EstadoTramite;
  fechaBaja?: Date;
  updatedAt?: Date;
  createdAt?: Date;
}

export default IAutorizacion;
