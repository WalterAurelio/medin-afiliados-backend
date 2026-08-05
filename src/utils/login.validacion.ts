export function validateLoginUser(nroDocumento: string, password: string) {
  const errors: string[] = [];

  // Validación de campos obligatorios
  if (!nroDocumento || !password) {
    errors.push('Todos los campos son obligatorios.');
  }

  // Validación de formato de DNI
  const dniRegex = /^\d{7,8}$/;
  if (nroDocumento && !dniRegex.test(nroDocumento)) {
    errors.push('El DNI debe tener 7 u 8 dígitos numéricos.');
  }

  // Validación de contraseña
  const passwordRegex = /^[A-Z].{5}$/;
  if (password && !passwordRegex.test(password)) {
    errors.push('La contraseña debe tener 5 caracteres y comenzar con una letra mayúscula.');
  }

  return errors;
}
