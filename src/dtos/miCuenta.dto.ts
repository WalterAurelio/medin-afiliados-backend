import { IAfiliadoPopulated } from './afiliados.dto';

export class MiCuentaDTO {
  id: string;
  nombre: string;
  nroAfiliado: string;
  planMedico: string;
  dni: string;
  email: string;
  cbuPrincipal?: string;
  cbus: {
    tipoDeCuenta: string;
    cuil: string;
    nombre: string;
    apellido: string;
    cbu: string;
   
  }[];
  situacionTerapeutica: string;
  grupoFamiliar: {
    id: string;
    nombre: string;
    nroAfiliado: string;
    dni: string;
    email: string;
    situacionTerapeutica: string;
  }[];

  constructor(data: unknown) {
    const castedData = data as IAfiliadoPopulated;
    this.id = castedData._id.toString();
    this.nombre = `${castedData.nombre} ${castedData.apellido}`;
    this.nroAfiliado = castedData.nroAfiliado;
    this.planMedico = castedData.planMedico;
    this.dni = castedData.nroDocumento;
    this.email = castedData.email;
    this.cbuPrincipal = castedData.cbuPrincipal;
    this.cbus = castedData.cbus.map(c => ({
      tipoDeCuenta: c.tipoDeCuenta,
      cuil: c.cuil,
      nombre: c.nombre,
      apellido: c.apellido,
      cbu: c.cbu,
    }));


    this.situacionTerapeutica = castedData.situacionTerapeutica;
    this.grupoFamiliar = castedData.grupoFamiliar?.map(doc => ({
      id: doc._id.toString(),
      nombre: `${doc.nombre} ${doc.apellido}`,
      nroAfiliado: doc.nroAfiliado,
      dni: doc.nroDocumento,
      email: doc.email,
      situacionTerapeutica: doc.situacionTerapeutica
    }));
  }
}
