import express from "express";
import UsuariosControllers from "../../controllers/usuariosControllers.js";
import { verifyToken, checkRole } from "../../middlewares/authMiddlewares.js"; 

const router = express.Router();
const usuariosControllers = new UsuariosControllers();

// Solo el administrador puede ver todos los usuarios
router.get('/', verifyToken, checkRole([1]), usuariosControllers.buscarTodos);

// Solo el administrador puede buscar un usuario específico por ID
router.get('/:idUsuario', verifyToken, checkRole([1]), usuariosControllers.buscarPorId);

// Solo el administrador puede crear nuevos usuarios
router.post('/', verifyToken, checkRole([1]), usuariosControllers.crear);

// Solo el administrador puede modificar cualquier usuario
router.patch('/:idUsuario', verifyToken, checkRole([1]), usuariosControllers.modificar);

// Ruta para que el usuario autenticado actualice su perfil (disponible para cliente, empleado, administrador)
router.put('/perfil', verifyToken, checkRole([3]), usuariosControllers.actualizar);

export { router };
