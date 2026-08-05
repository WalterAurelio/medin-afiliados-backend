import jwt from 'jsonwebtoken';
import  Afiliado  from '../models/Afiliado';



export const getRefreshTokenFromCookies = (cookies: any): string | null => {
  return cookies?.jwt || null;
};

export const findUserByRefreshToken = async (token: string) => {
  return await Afiliado.findOne({ refreshToken: token }).populate<{ grupoFamiliar: Pick<any, '_id' | 'rol'>[] }>('grupoFamiliar', '_id rol');
};

export const verifyRefreshToken = (token: string, secret: string): Promise<{ nroDocumento: string } | null> => {
  return new Promise((resolve) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err || !decoded) return resolve(null);
      resolve(decoded as { nroDocumento: string });
    });
  });
};

