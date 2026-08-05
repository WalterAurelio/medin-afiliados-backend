import { IRecetaDocument } from "../models/Receta";
import { IObservacion } from "../interfaces/IObservacion";

interface IrecetaWithRol extends Omit<IRecetaDocument, "idAfiliado"> {
  idAfiliado: { rol: string, nroAfiliado: string };
}
export class GetRecetasDTO {
  id: string;
  nroAfiliado: string;
  rolAfiliado: string;
  paraAfiliado: string;
  medicamento: string;
  cantidad: number;
  presentacion: string;
  //idAfiliado?: string;
  observaciones?: IObservacion[];
  estado: string;
  fechaActualizacion?: Date;

  constructor(data: unknown) {
    const castedData = data as IrecetaWithRol;
    this.id = castedData._id.toString();
    this.nroAfiliado = castedData.idAfiliado.nroAfiliado;
    this.paraAfiliado = castedData.paraAfiliado;
    this.rolAfiliado = castedData.idAfiliado.rol;
    this.medicamento = castedData.medicamento;
    this.cantidad = castedData.cantidad;
    this.presentacion = castedData.presentacion;
    this.observaciones = castedData.observaciones;
    this.estado = castedData.estado;
    this.fechaActualizacion = castedData.estado === 'pendiente' ? castedData.createdAt : castedData.updatedAt;
    //this.idAfiliado = castedData.idAfiliado.toString();
  }
}

export class IdRecetaDTO {
  id: string;

  constructor(data: IRecetaDocument) {
    this.id = data._id.toString();
  }
}
export class CommentRecetaDTO {
  id: string;
  observaciones?: IObservacion[];

  constructor(data: IRecetaDocument) {
    this.id = data._id.toString();
    this.observaciones = data.observaciones;
  }
}
