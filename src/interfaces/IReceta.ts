import { Document } from "mongoose";
import { Types } from "mongoose";
import { EstadoTramite } from "../enums/EstadoTramite";
import { IObservacion } from "./IObservacion";

export interface IReceta {
  // nroAfiliado: string; // clave foránea a Afiliado
  paraAfiliado: string;
  medicamento: string;
  cantidad: number;
  presentacion: string;
  observaciones: IObservacion[];
  estado: EstadoTramite;
  idAfiliado: Types.ObjectId;
  fechaBaja?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export default IReceta;
