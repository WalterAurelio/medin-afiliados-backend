import mongoose from 'mongoose';

const DATABASE_URI = process.env.DATABASE_URI;

const connectDatabase = async () => {
  try {
    await mongoose.connect(DATABASE_URI!, {
      dbName: 'MedIntegralAfiliadosDB'
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error desconocido.';
    console.log('Error en la conexión a MongoDB.', message);
  }
};

export default connectDatabase;
