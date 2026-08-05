import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import Afiliado from '../models/Afiliado';
import Autorizacion from '../models/Autorizacion';
import Prestador from '../models/Prestador';
import Receta from '../models/Receta';
import Reintegro from '../models/Reintegro';
import Turno from '../models/Turno';

type SeedCollectionName =
  | 'prestadores'
  | 'reintegros'
  | 'afiliados'
  | 'turnos'
  | 'autorizaciones'
  | 'recetas';

type SeedFileName = `${SeedCollectionName}.json`;

type SeedStep = {
  fileName: SeedFileName;
  label: string;
  model: {
    insertMany: (documents: unknown[]) => Promise<unknown>;
  };
};

const jsonDirectory = path.resolve(process.cwd(), 'src/json');

const seedSteps: SeedStep[] = [
  {
    fileName: 'prestadores.json',
    label: 'Prestadores',
    model: Prestador
  },
  {
    fileName: 'reintegros.json',
    label: 'Reintegros',
    model: Reintegro
  },
  {
    fileName: 'afiliados.json',
    label: 'Afiliados',
    model: Afiliado
  },
  {
    fileName: 'turnos.json',
    label: 'Turnos',
    model: Turno
  },
  {
    fileName: 'autorizaciones.json',
    label: 'Autorizaciones',
    model: Autorizacion
  },
  {
    fileName: 'recetas.json',
    label: 'Recetas',
    model: Receta
  }
];

const readJsonFile = <T>(fileName: string): T[] => {
  const filePath = path.resolve(jsonDirectory, fileName);
  return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as T[];
};

const clearDatabaseCollections = async () => {
  const db = mongoose.connection.db;

  if (!db) {
    throw new Error('Error al obtener la base de datos.');
  }

  const collections = await db.collections();

  for (const collection of collections) {
    console.log(`Vaciando la colección ${collection.collectionName}...`);
    await collection.deleteMany({});
  }

  console.log('Todas las colecciones han sido vaciadas.');
};

export const runSeed = async () => {
  await clearDatabaseCollections();

  for (const step of seedSteps) {
    const documents = readJsonFile<unknown>(step.fileName);
    await step.model.insertMany(documents);
    console.log(`Seed de ${step.label} completado.`);
  }

  console.log('El seed ha finalizado exitosamente.');
};
