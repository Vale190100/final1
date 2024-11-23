import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { secretKey } from '../config/jwtConfig.js';

// Generar JWT
const generateToken = (user) => {
  const payload = {
    idUsuario: user.idUsuario,
    email: user.correoElectronico,
    idTipoUsuario: user.idTipoUsuario,
  };
  return jwt.sign(payload, secretKey, { expiresIn });
};

// Función para encriptar la contraseña con SHA-256
const hashPassword = (password) => {
  return crypto.createHash('sha256').update(password).digest('hex');
};

// Comparar contraseñas usando SHA-256
const comparePassword = (plainPassword, hashedPassword) => {
  const hashedPlainPassword = hashPassword(plainPassword);
  return hashedPlainPassword === hashedPassword;
};

// Exportación de las funciones
export { generateToken, comparePassword, hashPassword };