import { Schema, Document, model, Types } from 'mongoose';
import IReintegro from '../interfaces/IReintegro';
import { FormaPago } from '../enums/FormaPago';
import { EstadoTramite } from '../enums/EstadoTramite';
import { Especialidad } from '../enums/Especialidad';

export interface IReintegroDocument extends Omit<IReintegro, 'id'>, Document {
  _id: Types.ObjectId;
}

const reintegroSchema = new Schema<IReintegroDocument>(
  {
    paraAfiliado: {
      type: String,
      required: true
    },
    fechaDePrestacion: {
      type: Date,
      required: true
    },
    medico: {
      type: String,
      required: true
    },
    especialidad: {
      type: String,
      required: true
    },
    lugarDeAtencion: {
      type: String,
      required: true
    },
    factura: {
      type: {
        fecha: {
          type: Date,
          required: true
        },
        cuit: {
          type: String,
          required: true
        },
        valorTotal: {
          type: Number,
          required: true
        },
        personaAFacturar: {
          type: String,
          required: true
        }
      },
      required: true
    },
    formaDePago: {
      type: String,
      enum: Object.values(FormaPago),
      required: true
    },
    cbu: {
      type: String,
      required: function () {
        return this.formaDePago === FormaPago.TRANSFERENCIA;
      }
    },
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
    estado: {
      type: String,
      enum: Object.values(EstadoTramite),
      required: true,
      default: EstadoTramite.PENDIENTE
    },
    idAfiliado: {
      type: Schema.Types.ObjectId,
      ref: 'Afiliado',
      required: true
    },
    fechaBaja: { type: Date },
    nroGestion: Number
  },
  { timestamps: true }
);

export default model<IReintegroDocument>('Reintegro', reintegroSchema);
