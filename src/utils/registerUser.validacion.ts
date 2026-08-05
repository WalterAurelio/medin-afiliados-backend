import { RegisterBody } from '../types/AuthTypes';

export function validateRegisterUser(user: RegisterBody) {
  const errors: string[] = [];

  // Validación de campos obligatorios
  if (!user.nroDocumento || !user.password || !user.confirmPassword) {
    errors.push('Todos los campos son obligatorios.');
  }

  // Validación de formato de DNI
  const dniRegex = /^\d{7,8}$/;
  if (user.nroDocumento && !dniRegex.test(user.nroDocumento)) {
    errors.push('El DNI debe tener 7 u 8 dígitos numéricos.');
  }

  // Validación de contraseña
  const passwordRegex = /^[A-Z].{5}$/;
  if (user.password && !passwordRegex.test(user.password)) {
    errors.push('La contraseña debe tener 5 caracteres y comenzar con una letra mayúscula.');
  }

  // Validación de coincidencia
  if (user.password && user.confirmPassword && user.password !== user.confirmPassword) {
    errors.push('Las contraseñas ingresadas no coinciden.');
  }

  return errors;
}
