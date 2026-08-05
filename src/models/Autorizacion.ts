import { Schema, model, Types } from "mongoose";
import { EstadoTramite } from "../enums/EstadoTramite";
import  IAutorizacion  from '../interfaces/IAutorizacion';

export interface IAutorizacionDocument extends Omit<IAutorizacion, 'id'>, Document {
  _id: Types.ObjectId;
}

const autorizacionSchema = new Schema<IAutorizacionDocument>(
  {
    idAfiliado: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Afiliado",
    },
    paraAfiliado: {
      type: String,
      required: true,
    },
    nroAfiliado: {
      type: String,
      required: false,
    },
    fechaSolicitud: { type: Date, required: true, default: Date.now },
    practica: { type: String, required: true },
    especialidad: { type: String, required: true },
    medicoSolicitante: { type: String, required: true },
    lugarAtencion: { type: String, required: true },
    diagnostico: { type: String },
    observaciones: { 
      type: [
        {
          idEmisor: { type: Schema.Types.ObjectId, ref: 'Afiliado' },
          rolEmisor: { type: String, required: true },
          descripcion: { type: String },
          fecha: { type: Date, default: Date.now }
        },
        {
          idEmisor: { type: Schema.Types.ObjectId, ref: 'Prestador' },
          rolEmisor: { type: String, required: true },
          descripcion: { type: String },
          fecha: { type: Date, default: Date.now }
        }
      ]
    },
    diasDeInternacion: { type: Number, required: true },
    estado: {
      type: String,
      enum: Object.values(EstadoTramite),
      default: EstadoTramite.PENDIENTE,
    },
    fechaBaja: { type: Date, required: false },
  },
  { timestamps: true }
);

export default model<IAutorizacionDocument>(
  "Autorizacion",
  autorizacionSchema,
  "Autorizaciones"
);
