import express from 'express';
import ReclamosTipoController from '../../controllers/reclamosTipoControllers.js';
import { verifyToken, checkRole } from "../../middlewares/authMiddlewares.js"; 


const router = express.Router();
const reclamosTipoController = new ReclamosTipoController();

router.get('/', verifyToken, checkRole([1]), reclamosTipoController.buscarTodos);

router.get('/:idReclamosTipo', verifyToken, checkRole([1]), reclamosTipoController.buscarPorId);

router.post('/', verifyToken, checkRole([1]), reclamosTipoController.crear);

router.patch('/:idReclamosTipo', verifyToken, checkRole([1]), reclamosTipoController.modificar);

export { router };