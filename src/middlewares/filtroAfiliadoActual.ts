import { Request, Response, NextFunction } from 'express';

export const filtroAfiliadoActual = (req: Request<{ idAfiliado: string }>, res: Response, next: NextFunction) => {
  const familiaresPermitidos = req.familiaresPermitidos;
  const idAfiliadoElegido = req.params.idAfiliado; // Id del afiliado elegido por el usuario que inició sesión
  const indexAfiliadoEledigo = familiaresPermitidos?.indexOf(idAfiliadoElegido);
  const idsAfiliadosFiltered = familiaresPermitidos?.filter((_, index) => index >= indexAfiliadoEledigo!);

  req.familiaresPermitidos = idsAfiliadosFiltered;
  next();
};
