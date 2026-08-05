import dotenv from "dotenv";
dotenv.config();
import connectDatabase from "../config/dbConnect";
import { runSeed } from "./runSeed";

const seed = async () => {
  try {
    await connectDatabase();
    console.log("Conectado exitosamente a MongoDB");
    await runSeed();
    process.exit(0);
  } catch (error) {
    console.error("Ha ocurrido un error al ejecutar el seed.", error);
    process.exit(1);
  }
};

seed();
