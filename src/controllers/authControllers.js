import { generateToken, comparePassword } from '../services/authServices.js';
import Usuario from '../database/usuarios.js';

const usuarioModel = new Usuario();

const login = async (req, res) => {
  const { correoElectronico, contrasenia } = req.body;

  try {
    // Busca al usuario por correo electrónico y contraseña (solo correo para obtener el usuario inicialmente)
    const user = await usuarioModel.buscarPorCorreoElectronico(correoElectronico);
    if (!user) {
      return res.status(400).send({ mensaje: 'Usuario no encontrado' });
    }

    // Comprobamos si la contraseña es válida
    const isPasswordValid = comparePassword(contrasenia, user.contrasenia);
    if (!isPasswordValid) {
      return res.status(400).send({ mensaje: 'Contraseña incorrecta' });
    }

    // Generamos el token si la autenticación es exitosa
    const token = generateToken(user);
    res.json({ token });
    
  } catch (error) {
    console.log(error);
    res.status(500).send({ mensaje: 'Error en el servidor' });
  }
};

export { login };