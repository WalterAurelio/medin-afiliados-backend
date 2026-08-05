import { Schema, model } from "mongoose";
import { IPrestadorDocument } from "../interfaces/IPrestador";
import { Especialidad } from "../enums/Especialidad";
import { Localidad } from "../enums/Localidad";

const LugarAtencionSchema = new Schema(
  {
    nombre: { type: String, default: "" },
    localidad: { type: String, enum: Object.values(Localidad), required: true },
    calle: { type: String, required: true },
    numero: { type: String, required: true },
    telefono: { type: String, required: true },
  },
  { _id: false }
);

// Esquema principal del prestador
const PrestadorSchema = new Schema<IPrestadorDocument>(
  {
    nombre: { type: String, required: true },
    especialidad: {
      type: String,
      //enum: Object.values(Especialidad), Se cambió este enum por que solo sea String y requerido. La obtención de las especialidades ahora viene por un mapeo de los prestadores.
      required: true,
    },
    lugarAtencion: { type: LugarAtencionSchema, required: true }, // solo 1 lugar
  },
  { timestamps: true }
);


const PrestadorModel = model<IPrestadorDocument>(
  "Prestador",
  PrestadorSchema,
  "Prestadores"
);


export const Prestador = PrestadorModel;
export default PrestadorModel;

