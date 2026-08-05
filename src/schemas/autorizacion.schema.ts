import { z } from "zod";

export const autorizacionSchema = z.object ({
    fechaSolicitud: z.string()
      .min(1, 'Debe ingresar la fecha para la solicitud.')
      .transform((val) => new Date(val))
      .refine(
        (val) => {
          const hoy = new Date();
          hoy.setHours(0,0,0,0);
          return val >= hoy;
        },
        {message: 'La fecha de solicitud no puede ser anterior.'}
      ),
    practica : z.string().trim().min(3, "Debe ingresar una práctica.").regex(/^[\p{L}.\s]+$/u, "Sólo se permiten letras."), 
    especialidad : z.string().trim().min(1,'Debe ingresar una especialidad.'),
    medicoSolicitante: z.string().min(3, "Debe ingresar el médico").regex(/^(?!.*\bdr|dra|doc|doctor|doctora\.?\b)[\p{L}.\s]+$/iu, "Sólo se permite el nombre y apellido.").refine(val => {
      const partes = val.trim().split(/\s+/);
      return partes.length >= 2;
    }, {message: 'Debe contener el nombre y apellido.'}),
    lugarAtencion: z.string().trim().min(3, 'Debe ingresar un lugar de atención válido.'),
    observaciones: z.string().optional(),
    diasDeInternacion : z.coerce.number().min(0, 'Debe ingresar una cantidad de dias.'),
});