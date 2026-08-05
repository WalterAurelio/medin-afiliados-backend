import bcrypt from 'bcrypt';
import  Afiliado  from '../models/Afiliado';
import { RolAfiliado } from '../enums/RolAfiliado';
import { LoginBody } from '../types/AuthTypes';

//validar credenciales
export const validateLoginCredentials = async ({ nroDocumento, password }: LoginBody) => {
  const errors: string[] = [];

  const foundUser = await Afiliado.findOne({ nroDocumento }).populate<{ grupoFamiliar: Pick<any, '_id' | 'rol'>[] }>('grupoFamiliar', '_id rol');

  if (!foundUser) {
    errors.push('El usuario no existe.');
    return { errors, foundUser: null };
  }

  if (!foundUser.registrado) {
    errors.push('El usuario no está registrado.');
    return { errors, foundUser };
  }

  const validPassword = await bcrypt.compare(password, foundUser.password);
  if (!validPassword) {
    errors.push('La contraseña es incorrecta.');
  }

  return { errors, foundUser };
};

//validacion para familiares permitidos

export const getFamiliaresPermitidos = (user: any): string[] => {
  if (user.rol === RolAfiliado.TITULAR) {
    return user.grupoFamiliar.map((familiar: any) => familiar._id);
  }

  if (user.rol === RolAfiliado.CONYUGE) {
    return user.grupoFamiliar
      .filter((familiar: any) => familiar.rol !== RolAfiliado.TITULAR && familiar.rol !== RolAfiliado.HIJO_MAYOR)
      .map((familiar: any) => familiar._id);
  }

  return [user._id];
};