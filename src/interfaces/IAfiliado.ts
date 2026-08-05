import { RolAfiliado } from '../enums/RolAfiliado';
import { Types } from 'mongoose';
import { TipoDocumento } from '../enums/TipoDocumento';
import { Parentesco } from '../enums/Parentesco';
import { PlanMedico } from '../enums/PlanMedico';

interface IAfiliado {
  id: string;
  nroAfiliado: string; // Por ejemplo, '000001-01'
  grupoFamiliar: Types.ObjectId[];
  nombre: string;
  apellido: string;
  fechaNacimiento: Date;
  tipoDocumento: TipoDocumento; // 'dni' | 'pasaporte' | 'ci'
  nroDocumento: string;
  email: string;
  telefono?: string;
  direccion?: string;
  parentesco: Parentesco; // 'titular' | 'conyuge' | 'hijo' | 'otro'
  password: string;
  fechaAlta: Date;
  registrado: boolean;
  situacionTerapeutica: string;
  planMedico: PlanMedico; // '100' | '200' | '300' | '400'
  cbus: {
    tipoDeCuenta: string;
    cuil: string;
    nombre: string;
    apellido: string;
    cbu: string;
  }[];
  cbuPrincipal?: string;
  rol: RolAfiliado; // 'Titular' | 'Cónyuge' | 'Hijo Menor' | 'Hijo Mayor' | 'Otro'
  refreshToken: string;
}

export default IAfiliado;
