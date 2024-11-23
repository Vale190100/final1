import express from "express";
import ReclamosControllers from "../../controllers/reclamosControllers.js";
import { verifyToken, checkRole } from "../../middlewares/authMiddlewares.js"; 

const router = express.Router();
const reclamosControllers = new ReclamosControllers();

// 1. Listar reclamos por oficinas para empleados
router.get("/listar", verifyToken, checkRole([2]), reclamosControllers.listar);

// 2. Estadísticas de usuarios por oficina para administradores
router.get('/usuarios-por-oficina', verifyToken, checkRole([1]), reclamosControllers.verUsuariosPorOficina);

// 3. Ruta estadísticas para administradores
router.get('/estadisticas', verifyToken, checkRole([1]), reclamosControllers.verEstadisticas);

// 4. Ruta descargar informe para administradores
router.get("/informe/:formato?", verifyToken, checkRole([1]), reclamosControllers.informe);

// 5. Ruta consultar para clientes
router.get('/consultar/', verifyToken, checkRole([3]), reclamosControllers.consultar);

// 6. Ruta cancelar reclamos para clientes
router.patch('/cancelar/:idReclamo', verifyToken, checkRole([3]), reclamosControllers.cancelar);

// 7. Ruta buscar reclamo específico por ID para administradores
router.get("/:idReclamo", verifyToken, checkRole([1]), reclamosControllers.buscarPorId);

// 8. Ruta atender reclamos para empleados
router.put('/atender/:idReclamo', verifyToken, checkRole([2]), reclamosControllers.atender);

// 9. Ruta modificar reclamos para administradores
router.patch("/:idReclamo", verifyToken, checkRole([1]), reclamosControllers.modificar);

// 10. Ruta crear reclamos para clientes
router.post('/', verifyToken, checkRole([3]), reclamosControllers.crear);

// 11. Ruta ver todos los reclamos para administradores
router.get("/", verifyToken, checkRole([1]), reclamosControllers.buscarTodos);


export { router };

