import { IAutorizacionDocument }  from "../models/Autorizacion";
import { IReintegroDocument }  from "../models/Reintegro";
import { IRecetaDocument }  from "../models/Receta";
import { GetAutorizacionesDTO } from "./autorizaciones.dto";
import { GetReintegrosDTO } from "./reintegros.dto";
import { GetRecetasDTO } from "./recetas.dto";

export class AutorizacionesDashboardDTO extends GetAutorizacionesDTO {
    tipo: string;

    constructor(data: IAutorizacionDocument) {
        super(data)
        this.tipo = 'autorizacion'
    }
}

export class ReintegrosDashboardDTO extends GetReintegrosDTO {
  tipo: string;

  constructor(data: IReintegroDocument) {
    super(data);
    this.tipo = 'reintegro'
  }
}

export class RecetasDashboardDTO extends GetRecetasDTO {
  tipo: string;

  constructor(data: IRecetaDocument) {
    super(data);
    this.tipo = 'receta';
  }
}