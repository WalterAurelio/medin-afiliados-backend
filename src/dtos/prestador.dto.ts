export class PrestadorDTO {
  nombre: string;
  especialidad: string;
  lugarAtencion: {
    nombre: string;
    localidad: string;
    calle: string;
    numero: string;
    telefono: string;
  };

  constructor(prestador: any) {
    this.nombre = prestador.nombre;
    this.especialidad = prestador.especialidad;
    this.lugarAtencion = prestador.lugarAtencion || {
      nombre: "",
      localidad: "",
      calle: "",
      numero: "",
      telefono: "",
    };
  }
}
