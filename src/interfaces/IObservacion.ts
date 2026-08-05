export interface IObservacion {
  idEmisor: string; // ObjectId de un Prestador o Afiliado
  rolEmisor: string; // 'Prestador' | 'Afiliado'
  descripcion: string;
  fecha: Date;
}
