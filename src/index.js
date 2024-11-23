import express from 'express';
import dotenv from 'dotenv';


import { router as authRoutes } from './v1/routes/authRoutes.js'; 
import { router as v1ReclamosEstadoRouter } from './v1/routes/reclamosEstadosRoutes.js';
import { router as v1ReclamosRoutes } from './v1/routes/reclamosRoutes.js';
import { router as v1UsuariosRoutes } from './v1/routes/usuariosRoutes.js';
import { router as v1ReclamosTipoRoutes } from './v1/routes/reclamosTipoRoutes.js';
import { router as v1OficinasRoutes } from './v1/routes/oficinasRoutes.js';
import { router as v1UsuariosOficinasRoutes } from './v1/routes/usuariosOficinasRoutes.js';

import validateContentType from './middlewares/validateContentType.js';
import cors from 'cors';


dotenv.config();

const app = express();

app.use(express.json());
app.use(validateContentType);
app.use(cors());


app.get('/', (req, res) => {
    res.json({ 'estado': true });
});

app.use('/api/v1/reclamos-estados', v1ReclamosEstadoRouter);
app.use('/api/v1/reclamos', v1ReclamosRoutes);
app.use('/api/v1/usuarios', v1UsuariosRoutes);
app.use('/api/v1/reclamos-tipo', v1ReclamosTipoRoutes);
app.use('/api/v1/oficinas', v1OficinasRoutes);
app.use('/api/v1/usuarios-oficinas', v1UsuariosOficinasRoutes);

// Rutas de autenticación
app.use('/v1/auth', authRoutes);

const puerto = process.env.PUERTO || 3551;
app.listen(puerto, () => {
    console.log(`Escuchando en el puerto ${puerto}`);
});