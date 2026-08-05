
import Afiliado  from '../models/Afiliado';
import { validatePasswordMatch, isValidDni, isValidPassword} from '../utils/register.validator';

export async function validateUserRegistration(user: {
  nroDocumento: string;
  password: string;
  confirmPassword: string;
}) {
  const errors: string[] = [];

  
  if (!isValidDni(user.nroDocumento)) {
    errors.push('El DNI es inválido');
  }

  if (!isValidPassword(user.password)) {
    errors.push('La contraseña debe comenzar con una letra mayúscula seguida de 5 números');
  }

  if (!validatePasswordMatch(user.password, user.confirmPassword)) {
    errors.push('Las contraseñas no coinciden');
  }

  
  const foundUser = await Afiliado.findOne({ nroDocumento: user.nroDocumento });

  if (!foundUser) {
    errors.push('El usuario no existe');
    
  } else if (foundUser.registrado) {
    errors.push('El usuario ya está registrado');
  }

  return { errors, foundUser: foundUser || null };
}
