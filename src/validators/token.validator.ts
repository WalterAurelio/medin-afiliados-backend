import jwt from 'jsonwebtoken';

export const generarTokens = (nroDocumento: string, familiaresPermitidos: string[]) => {
  const accessToken = jwt.sign(
    { nroDocumento, familiaresPermitidos },
    process.env.ACCESS_TOKEN_SECRET!,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { nroDocumento },
    process.env.REFRESH_TOKEN_SECRET!,
    { expiresIn: '1d' }
  );

  return { accessToken, refreshToken };
};