import { conexion } from "./conexion.js";
import { hashPassword } from '../services/authServices.js';

export default class Usuario {

    buscarTodos= async()=>{
        const sql = `SELECT * FROM usuarios`
        const [result] = await conexion.query(sql);
        return result;
        
    } 

    buscarPorId = async (id) => {
        const sql =  `SELECT * FROM usuarios WHERE idUsuario = ?`;
        const [result] = await conexion.query(sql, [id]);
        return (result.length > 0) ? result[0] : null;
    }

    crear = async ({ nombre, apellido, correoElectronico, contrasenia, idTipoUsuario, imagen }) => {
        const hashedPassword = hashPassword(contrasenia);

        const sql = `INSERT INTO usuarios(nombre, apellido, correoElectronico, contrasenia,
            idTipoUsuario, imagen, activo) VALUES (?, ?, ?, ?, ?, ?, 1)`;

        const [result] = await conexion.query(sql, [nombre, apellido, correoElectronico, hashedPassword, idTipoUsuario, imagen]);
        return result;
    }

    modificar = async (id, datos) => {
        const sql = 'UPDATE usuarios SET ? WHERE idUsuario = ?';
        const [result] = await conexion.query(sql, [datos,id]);
        return result
    }

    actualizar = async (idUsuario, datos) => {
        const sql = `UPDATE usuarios SET ? WHERE idUsuario = ?`;
        const [result] = await conexion.query(sql, [datos, idUsuario]);
        return result;
    };


    buscarPorCorreoElectronico = async (correoElectronico) => {
        const sql = `SELECT * FROM usuarios WHERE correoElectronico = ?`;
        const [result] = await conexion.query(sql, [correoElectronico]);
        return (result.length > 0) ? result[0] : null;
    }


}