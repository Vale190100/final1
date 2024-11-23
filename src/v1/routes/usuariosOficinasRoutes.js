import express from "express";
import UsuariosOficinasController from "../../controllers/usuariosOficinasControllers.js";
import { verifyToken, checkRole } from "../../middlewares/authMiddlewares.js"; 

const router = express.Router();
const usuariosOficinasController = new UsuariosOficinasController();

// Solo el administrador puede ver todos los usuarios asignados a oficinas
router.get('/', verifyToken, checkRole([1]), usuariosOficinasController.buscarTodos);

// Solo el administrador puede buscar un usuario asignado a una oficina específica por ID
router.get('/:idUsuarioOficina', verifyToken, checkRole([1]), usuariosOficinasController.buscarPorId);

// Solo el administrador puede agregar un usuario a una oficina
router.post('/', verifyToken, checkRole([1]), usuariosOficinasController.crear);

// Solo el administrador puede eliminar la asignación de un usuario a una oficina
router.delete('/:idUsuarioOficina', verifyToken, checkRole([1]), usuariosOficinasController.eliminar);

// Solo el administrador puede modificar la asignación de un usuario a una oficina
router.patch('/:idUsuarioOficina', verifyToken, checkRole([1]), usuariosOficinasController.modificar);


export { router };
