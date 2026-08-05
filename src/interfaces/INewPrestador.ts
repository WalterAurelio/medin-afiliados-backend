export interface Direccion {
  calle: string;
  numero: string;
  localidad: string;
  comuna: string | null;
  municipio: string | null;
  provincia: string;
  horariosAtencion: string[];
}

export interface Prestador {
  _id: string;
  nombreCompleto: string;
  cuitCuil: string;
  esCentroMedico: boolean;
  especialidades: string[];
  telefonos: string[];
  mails: string[];
  direcciones: Direccion[];
  integraCentroMedico?: string | null; // Propiedad opcional
  atencionParticular?: boolean;     // Propiedad opcional
}

export interface EspecialidadLocalidad {
    especialidad: string;
    localidades: string[];
}