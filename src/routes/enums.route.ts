import { Router } from "express";
import { Especialidad } from "../enums/Especialidad";
import { Localidad } from "../enums/Localidad";
import { Prestador } from "../models/Prestador";

const router = Router();

router.get("/especialidades", async (_, res) => {
  
  
  //res.json(Object.values(Especialidad));

  //Se modificó la obtención de datos, para que tenga consistencia con los prestadores cargados en la base de datos.
  try {
    const especialidadesUnicas = await Prestador.distinct('especialidad')
    res.status(200).json(especialidadesUnicas)
    
  } catch (error) {
    console.error('Error al obtener especialidades:', error)
    res.status(500).json({message: 'Error interno en el servidor'})
  }


});
// Ahora trae las localidades de los prestadores que hay en la db
// router.get("/localidades", (_, res) => {
//   res.json(Object.values(Localidad));
// });

router.get('/localidades', async (_, res)=> {
  try {
    // Usamos distinct() y le pasamos el path al campo que queremos.
    // MongoDB entiende 'lugarAtencion.localidad' gracias a la notación de punto.
    const localidadesUnicas = await Prestador.distinct('lugarAtencion.localidad');

    // Devolvemos el array de strings con las localidades
    
    res.status(200).json(localidadesUnicas);

  } catch (error) {
    console.error("Error al obtener localidades:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
})

export default router;
