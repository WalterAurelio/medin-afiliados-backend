import { IAfiliadoDocument } from '../models/Afiliado';

export class RegisterUserDTO {
  id: string;
  nroDocumento: string;

  constructor(data: IAfiliadoDocument) {
    this.id = data._id.toString();
    this.nroDocumento = data.nroDocumento;
  }
}
