import Afiliado from '../models/Afiliado';
import { GetAfiliadoDTO, IAfiliadoPopulated } from '../dtos/afiliados.dto';
import { ERROR_MESSAGES } from '../utils/errorMessages';


export const getAfiliadoByDocumento = async (nroDocumento: string) => {
  try {
    const unAfiliado = await Afiliado.findOne({ nroDocumento }).populate('grupoFamiliar');

    if (!unAfiliado) {
      return { status: 404, body: { message: 'No se encontró el afiliado.' } };
    }

    const unAfiliadoDTO = new GetAfiliadoDTO(unAfiliado as unknown as IAfiliadoPopulated);
    return { status: 200, body: { data: unAfiliadoDTO } };
  } catch (error) {
    const message = ERROR_MESSAGES.GENERAL.UNKNOWN(error);
    return { status: 500, body: { message } };
  }
};

export const validarAfiliado = (afiliado: any): string[] => {
  const errores: string[] = [];

  if (!afiliado.nroAfiliado || !/^\d{6}-\d{2}$/.test(afiliado.nroAfiliado)) {
    errores.push('El número de afiliado debe tener el formato 000001-02.');
  }

  if (!afiliado.nombre || afiliado.nombre.length < 2) {
    errores.push('El nombre es obligatorio y debe tener al menos 2 caracteres.');
  }

  if (!afiliado.apellido || afiliado.apellido.length < 2) {
    errores.push('El apellido es obligatorio y debe tener al menos 2 caracteres.');
  }

  if (!afiliado.nroDocumento || !/^\d{7,8}$/.test(afiliado.nroDocumento)) {
    errores.push('El número de documento debe tener 7 u 8 dígitos numéricos.');
  }

  if (!afiliado.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(afiliado.email)) {
    errores.push('El email no tiene un formato válido.');
  }

  if (afiliado.telefono && !/^\d{10}$/.test(afiliado.telefono)) {
    errores.push('El teléfono debe tener 10 dígitos.');
  }

  if (!afiliado.fechaNacimiento || isNaN(Date.parse(afiliado.fechaNacimiento))) {
    errores.push('La fecha de nacimiento es obligatoria y debe ser válida.');
  }

  if (!afiliado.planMedico || !['100', '200', '300'].includes(afiliado.planMedico)) {
    errores.push('El plan médico debe ser 100, 200 o 300.');
  }

  if (!afiliado.parentesco || !['conyuge', 'hijo', 'padre', 'madre', 'otro', 'titular'].includes(afiliado.parentesco)) {
    errores.push('El parentesco no es válido.');
  }

  if (!afiliado.password || afiliado.password.length < 6) {
    errores.push('La contraseña es obligatoria y debe tener al menos 6 caracteres.');
  }

  return errores;
};

export async function obtenerAfiliadoPorId(userId: string) {
  return Afiliado.findById(userId);
}

export async function obtenerGrupoFamiliar(userId: string) {
  return Afiliado.find({ grupoFamiliarDe: userId });
}

export async function registrarCBU(userId: string, cbuData: any) {
  const afiliado = await Afiliado.findById(userId);
  if (!afiliado) {
  throw new Error('Afiliado no encontrado');
  }
  afiliado.cbus.push(cbuData);
  await afiliado.save();
}
