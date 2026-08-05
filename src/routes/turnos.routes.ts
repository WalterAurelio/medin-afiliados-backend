import { Router } from "express";
import { turnosFiltrados,
    especialidadesDisponibles,
    localidadesPorEspecialidad,
    prestadoresPorEspecialidadYLocalidad,
    reservarTurno,
    turnosPorAfiliado,
    cancelarTurno
} from "../controllers/turnos.controller";

const router = Router();


router.get('/turnos/especialidades', especialidadesDisponibles);

router.get('/turnos/localidades', localidadesPorEspecialidad);

router.get('/turnos/prestadores', prestadoresPorEspecialidadYLocalidad);

router.get('/turnos/filtrados', turnosFiltrados)

router.patch('/turnos/reservarTurno', reservarTurno)

router.get('/turnos/afiliado/:idAfiliado', turnosPorAfiliado)

router.patch('/turnos/cancelarTurno', cancelarTurno)


export default router;