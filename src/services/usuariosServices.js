// import Usuarios from '../database/Usuarios.js';
import Usuarios from '../database/usuarios.js';

export default class UsuariosService {

    constructor() {
        this.usuarios = new Usuarios();
    }

    buscarTodos = () => {
        return this.usuarios.buscarTodos();
    }

    buscarPorId = (id) => {
        return this.usuarios.buscarPorId(id);
    }


    crear = async (usuario) => {
        const usuarioCreado = await this.usuarios.crear(usuario);
        if (!usuarioCreado) {
            return { estado: false, mensaje: 'Usuario no creado' };
        }
        return { estado: true, mensaje: 'Usuario creado', data: await this.buscarPorId(usuarioCreado.insertId) };
    }

    modificar = async (id, datos) => {
        await this.usuarios.modificar(id, datos);

        const result = await this.buscarPorId(id)

        if (result === null) {
            return {estado: false, mensaje: 'idReclamo no existe'};
        } 
        if (!result) {
            return { estado: false, mensaje: 'Reclamo no modificado' };
        }
        return {estado: true, mensaje: 'Reclamo modificado con exito', data: result}
    }

    actualizar = async (idUsuario, datos) => {
        const usuarioExistente = await this.usuarios.buscarPorId(idUsuario);
        if (!usuarioExistente) {
            return { estado: false, mensaje: "Usuario no encontrado" };
        }

        const result = await this.usuarios.actualizar(idUsuario, datos);
        if (result.affectedRows === 0) {
            return { estado: false, mensaje: "No se pudo actualizar el perfil" };
        }

        const usuarioActualizado = await this.usuarios.buscarPorId(idUsuario);
        return { estado: true, mensaje: "Perfil actualizado con éxito", data: usuarioActualizado };
    };
}
    

