import { Schema, model, Types } from "mongoose";
import { EstadoTramite } from "../enums/EstadoTramite";
import { IReceta } from "../interfaces/IReceta";

export interface IRecetaDocument extends Omit<IReceta, "id">, Document {
  _id: Types.ObjectId;
}

const recetaSchema = new Schema<IRecetaDocument>(
  {
    /* nroAfiliado: {
      type: String,
      required: true,
      //ref: "Afiliado",
    }, */
    paraAfiliado: {
      type: String,
      required: true,
    },

    medicamento: { type: String, required: true },
    cantidad: { type: Number, required: true },
    presentacion: { type: String, required: true },
    observaciones: {
      type: [
        {
          idEmisor: { type: Schema.Types.ObjectId, ref: "Afiliado" },
          rolEmisor: { type: String, required: true },
          descripcion: { type: String },
          fecha: { type: Date, default: Date.now },
        },
        {
          idEmisor: { type: Schema.Types.ObjectId, ref: "Prestador" },
          rolEmisor: { type: String, required: true },
          descripcion: { type: String },
          fecha: { type: Date, default: Date.now },
        },
      ],
    },
    estado: {
      type: String,
      enum: Object.values(EstadoTramite),
      default: EstadoTramite.PENDIENTE,
    },
    idAfiliado: {
      type: Schema.Types.ObjectId,
      ref: "Afiliado",
      //required: true,
    },

    fechaBaja: { type: Date, required: false },
  },
  { timestamps: true }
);

export default model<IRecetaDocument>("Receta", recetaSchema);
