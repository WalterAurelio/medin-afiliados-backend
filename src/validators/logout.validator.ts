import  Afiliado  from '../models/Afiliado';

export const getRefreshTokenFromCookies = (cookies: any): string | null => {
  return cookies?.jwt || null;
};

export const findUserByRefreshToken = async (refreshToken: string) => {
  return await Afiliado.findOne({ refreshToken });
};

export const clearUserRefreshToken = async (user: any) => {
  user.refreshToken = '';
  await user.save();
};