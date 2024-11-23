import jwt from 'jsonwebtoken';
import { secretKey } from '../config/jwtConfig.js'; // Asegúrate de usar la extensión .js

// Middleware para verificar el token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Suponiendo que el token viene en el header 'Authorization'

  if (!token) {
    return res.status(403).send({ message: 'No se ha proporcionado un token' });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    console.log("Token decodificado:", decoded); // Verifica el contenido del token
    req.user = decoded; // Guardamos la información del usuario en la solicitud
    next();
  } catch (error) {
    console.error("Error al verificar el token:", error); // Muestra el error si el token falla
    return res.status(401).send({ message: 'Token inválido o expirado' });
  }
};

// Middleware para verificar roles
const checkRole = (roles) => {
  return (req, res, next) => {
    // Verifica si el usuario está autenticado
    if (!req.user || !req.user.idTipoUsuario) {
      console.error("El token no contiene información de rol o usuario");
      return res.status(403).send({ message: 'No tienes permiso para acceder a esta ruta (falta información de usuario)' });
    }

    // Debug: Mostrar el rol del usuario y los roles permitidos
    console.log("Rol del usuario recibido del token:", req.user.idTipoUsuario);
    console.log("Roles permitidos para esta ruta:", roles);

    // Verifica que el rol esté en el array de roles permitidos
    if (!roles.includes(req.user.idTipoUsuario)) {
      console.error("Acceso denegado: el rol no coincide");
      return res.status(403).send({ message: 'No tienes permiso para acceder a esta ruta' });
    }

    next();
  };
};

// Middleware alternativo para autenticar tokens (opcional)
export const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Obtener el token del encabezado
  if (!token) return res.status(401).send({ mensaje: 'Acceso denegado: no se proporcionó un token' });

  try {
    const decoded = jwt.verify(token, secretKey); // Verificar el token
    req.user = decoded; // Colocar el payload del token en req.user
    next();
  } catch (err) {
    console.error("Error al autenticar el token:", err); // Debug: Mostrar errores de token
    res.status(403).send({ mensaje: 'Token inválido o expirado' });
  }
};

export { verifyToken, checkRole };