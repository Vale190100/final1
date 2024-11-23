import express from 'express';
import OficinasController from '../../controllers/oficinasControllers.js';
import { verifyToken, checkRole } from '../../middlewares/authMiddlewares.js'; 

const router = express.Router();
const oficinasController = new OficinasController();

// Solo el administrador puede ver todas las oficinas
router.get('/', verifyToken, checkRole([1]), oficinasController.buscarTodos);

// Solo el administrador puede buscar una oficina específica por ID
router.get('/:idOficina', verifyToken, checkRole([1]), oficinasController.buscarPorId);

// Solo el administrador puede crear una oficina
router.post('/', verifyToken, checkRole([1]), oficinasController.crear);

// Solo el administrador puede modificar una oficina
router.patch('/:idOficina', verifyToken, checkRole([1]), oficinasController.modificar);

export { router };