import { IObservacion } from '../interfaces/IObservacion';
import { IReintegroDocument } from '../models/Reintegro';

interface IReintegroWithRole extends Omit<IReintegroDocument, 'idAfiliado'> {
  idAfiliado: { rol: string };
}

export class GetReintegrosDTO {
  id: string;
  paraAfiliado: string;
  rolAfiliado: string;
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
  formaDePago: string;
  cbu?: string;
  observaciones?: IObservacion[];
  estado: string;
  fechaActualizacion?: Date;

  constructor(data: unknown) {
    const castedData = data as IReintegroWithRole;
    this.id = castedData._id.toString();
    this.paraAfiliado = castedData.paraAfiliado;
    this.rolAfiliado = castedData.idAfiliado.rol;
    this.fechaDePrestacion = castedData.fechaDePrestacion;
    this.especialidad = castedData.especialidad;
    this.medico = castedData.medico;
    this.lugarDeAtencion = castedData.lugarDeAtencion;
    this.factura = {
      fecha: castedData.factura.fecha,
      cuit: castedData.factura.cuit,
      valorTotal: castedData.factura.valorTotal,
      personaAFacturar: castedData.factura.personaAFacturar
    };
    this.formaDePago = castedData.formaDePago;
    this.cbu = castedData.cbu;
    this.observaciones = castedData.observaciones;
    this.estado = castedData.estado;
    this.fechaActualizacion = castedData.estado === 'pendiente' ? castedData.createdAt : castedData.updatedAt;
  }
}

export class PostReintegroDTO {
  id: string;

  constructor(data: IReintegroDocument) {
    this.id = data._id.toString();
  }
}

export class PutReintegroDTO {
  id: string;

  constructor(data: IReintegroDocument) {
    this.id = data._id.toString();
  }
}

export class DeleteReintegroDTO {
  id: string;

  constructor(data: IReintegroDocument) {
    this.id = data._id.toString();
  }
}

export class CommentReintegroDTO {
  id: string;
  observaciones: IObservacion[];

  constructor(data: IReintegroDocument) {
    this.id = data._id.toString();
    this.observaciones = data.observaciones;
  }
}
