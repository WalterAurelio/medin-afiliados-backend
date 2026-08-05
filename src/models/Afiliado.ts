import { Schema, Types, model } from 'mongoose';
import { RolAfiliado } from '../enums/RolAfiliado';
import IAfiliado from '../interfaces/IAfiliado';
import { TipoDocumento } from '../enums/TipoDocumento';
import { Parentesco } from '../enums/Parentesco';
import { PlanMedico } from '../enums/PlanMedico';

export interface IAfiliadoDocument extends Omit<IAfiliado, 'id'> {
  _id: Types.ObjectId;
}

const afiliadoSchema = new Schema<IAfiliadoDocument>(
  {
    nroAfiliado: { type: String, required: true, unique: true },
    grupoFamiliar: { type: [{ type: Schema.Types.ObjectId, ref: 'Afiliado' }] },
    nombre: { type: String, required: true },
    apellido: { type: String, required: true },
    tipoDocumento: { type: String, enum: Object.values(TipoDocumento), required: true, default: TipoDocumento.DNI },
    nroDocumento: { type: String, required: true, unique: true },
    fechaNacimiento: { type: Date, required: true },
    email: { type: String, required: true, unique: true },
    telefono: { type: String },
    direccion: { type: String },
    parentesco: { type: String, enum: Object.values(Parentesco), required: true, default: Parentesco.TITULAR },
    password: { type: String, required: true, default: '123456' },
    fechaAlta: { type: Date, required: true, default: Date.now },
    registrado: { type: Boolean, default: false },
    situacionTerapeutica: { type: String, required: true, default: 'No presenta enfermedades preexistentes.' },
    planMedico: { type: String, enum: Object.values(PlanMedico), required: true, default: PlanMedico.PLAN_100 },
    cbus: {
      type: [
        {
          tipoDeCuenta: { type: String, required: true },
          cuil: { type: String, required: true },
          nombre: { type: String, required: true },
          apellido: { type: String, required: true },
          cbu: { type: String, required: true },
        }
      ],
      default: []
    },
    cbuPrincipal: { type: String, default: null },
    rol: { type: String, enum: Object.values(RolAfiliado), default: RolAfiliado.TITULAR },
    refreshToken: { type: String }
  },
  { timestamps: true }
);

/* afiliadoSchema.pre('save', function (next) {
  const afiliado = this as IAfiliadoDocument;

  // Calcular edad
  const hoy = new Date();
  let edad = hoy.getFullYear() - afiliado.fechaNacimiento.getFullYear();
  const m = hoy.getMonth() - afiliado.fechaNacimiento.getMonth();
  if (m < 0 || (m === 0 && hoy.getDate() < afiliado.fechaNacimiento.getDate())) {
    edad--;
  }

  // Asignar rol según parentesco + edad
  if (afiliado.parentesco === 'titular') {
    afiliado.rol = RolAfiliado.TITULAR;
  } else if (afiliado.parentesco === 'conyuge') {
    afiliado.rol = RolAfiliado.CONYUGE;
  } else if (afiliado.parentesco === 'hijo') {
    afiliado.rol = edad < 18 ? RolAfiliado.HIJO_MENOR : RolAfiliado.HIJO_MAYOR;
  } else {
    afiliado.rol = RolAfiliado.OTRO;
  }

  next();
}); */

export default model<IAfiliadoDocument>('Afiliado', afiliadoSchema);
