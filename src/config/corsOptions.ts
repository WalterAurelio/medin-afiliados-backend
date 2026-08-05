import { CorsOptions } from 'cors';
import allowedOrigins from './allowedOrigins';

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin!) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS.'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

export default corsOptions;
