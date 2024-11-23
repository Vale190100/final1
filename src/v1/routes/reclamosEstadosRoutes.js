import express from 'express';

import ReclamosEstadosControllers from '../../controllers/reclamosEstadosControllers.js';



const router = express.Router();

const reclamosEstadosControllers = new ReclamosEstadosControllers();

router.get('/', reclamosEstadosControllers.buscarTodos);
router.get('/:idReclamoEstado', reclamosEstadosControllers.buscarPorId);
router.post('/', reclamosEstadosControllers.crear);
router.patch('/:idReclamoEstado', reclamosEstadosControllers.modificar);

export {router};

