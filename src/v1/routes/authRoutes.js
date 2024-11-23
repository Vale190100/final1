import express from 'express';
import { login } from '../../controllers/authControllers.js';

const router = express.Router();

// Ruta para iniciar sesión
router.post('/login', login);

export { router }; 

