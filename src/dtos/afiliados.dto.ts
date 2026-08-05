import { IAfiliadoDocument } from '../models/Afiliado';

export interface IAfiliadoPopulated extends Omit<IAfiliadoDocument, 'grupoFamiliar'> {
  grupoFamiliar: IAfiliadoDocument[];
}

export class GetAfiliadoDTO {
  id: string;
  nombre: string;
  apellido: string;
  rol: string;
  grupoFamiliar: { id: string; nombre: string; apellido: string; rol: string }[];

  constructor(data: IAfiliadoPopulated) {
    this.id = data._id.toString();
    this.nombre = data.nombre;
    this.apellido = data.apellido;
    this.rol = data.rol;
    this.grupoFamiliar = data.grupoFamiliar?.map(doc => ({
      id: doc._id.toString(),
      nombre: doc.nombre,
      apellido: doc.apellido,
      rol: doc.rol
    }));
  }
}
