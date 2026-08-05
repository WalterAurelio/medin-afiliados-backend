import { Document } from "mongoose";
import { Especialidad } from "../enums/Especialidad";
import { Localidad } from "../enums/Localidad";

export interface ILugarAtencion {
  nombre: string;
  localidad: string;
  calle: string;
  numero: string;
  telefono: string;
}

export interface IPrestador {
  nombre: string;
  especialidad: string;
  lugarAtencion: ILugarAtencion;
}

export interface IPrestadorDocument extends IPrestador, Document {}
