import { Types } from 'mongoose';
import { Especialidad } from '../enums/Especialidad';
import { EstadoTramite } from '../enums/EstadoTramite';
import { FormaPago } from '../enums/FormaPago';
import { IObservacion } from './IObservacion';

interface IReintegro {
  id: string;
  paraAfiliado: string;
  idAfiliado: Types.ObjectId;
  fechaDePrestacion: Date;
  especialidad: string;
  medico: string;
  lugarDeAtencion: string;
  factura: {
    fecha: Date;
    cuit: string;
    valorTotal: number;
    personaAFacturar: string;
  };
  formaDePago: FormaPago;
  cbu?: string;
  observaciones: IObservacion[];
  estado: EstadoTramite;
  fechaBaja?: Date;
  nroGestion: number;
  updatedAt?: Date;
  createdAt?: Date;
}

export default IReintegro;
