export type LoginBody = {
  nroDocumento: string;
  password: string;
};

export type RegisterBody = LoginBody & {
  confirmPassword: string;
};

export type RequestCookies = {
  jwt?: string;
};
