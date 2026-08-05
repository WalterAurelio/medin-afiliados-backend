import { Schema, model } from "mongoose";
import { ITurnoDocument } from "../interfaces/ITurno";
import { EstadoTurno } from "../enums/EstadoTurno";

const turnoSchema = new Schema<ITurnoDocument>(
  {
    idAfiliado: { //El afiliado al que pertenece el turno
      type: Schema.Types.ObjectId,
      ref: "Afiliado",
      required: false,
    },
    idPrestador: { //El prestador, el cual también va a tener datos de lugar y dirección
      type: Schema.Types.ObjectId,
      ref: "Prestador",
      required: true,
    },
    fechaTurno: { type: Date, required: true }, //Parámetro principal para la busqueda y la cancelación
    estado: { //"disponible" o "reservado"
      type: String,
      enum: EstadoTurno,
      default: EstadoTurno.DISPONIBLE,
    },
    //fechaBaja: { type: Date, required: false } Comentado ya que no va a haber fecha de baja en los turnos.
  },
  { timestamps: true }
);

export default model<ITurnoDocument>("Turno", turnoSchema);
