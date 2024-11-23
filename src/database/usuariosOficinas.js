import { conexion } from "./conexion.js";


export default class UsuariosOficinas {
    buscarTodos= async () =>  {
        const sql = 'SELECT * FROM usuarios_oficinas WHERE activo = 1;'
        const [result] = await conexion.query(sql)
        return result
    }

    buscarPorId = async (id) => {
        const sql = 'SELECT * FROM usuarios_oficinas WHERE activo = 1 AND idUsuarioOficina = ?';
        const [result] = await conexion.query(sql, [id]);
        return (result.length > 0) ? result[0] : null;
    }

    buscarPorIdUsuario = async (id) => {
        const sql = 'SELECT * FROM usuarios_oficinas WHERE activo = 1 AND idUsuario = ?';
        const [result] = await conexion.query(sql, [id]);
        return (result.length > 0) ? result : null;
    }

    crear = async ({idUsuario, idOficina, activo}) => {        
        const sql = 'INSERT INTO usuarios_oficinas (idUsuario, idOficina, activo) VALUES (?,?,?)';
        const [result] = await conexion.query(sql, [idUsuario, idOficina, activo]);
        return  result   
    }

    modificar = async (id, datos) => {
        const sql = 'UPDATE usuarios_oficinas SET ? WHERE idUsuarioOficina = ?';
        const [result] = await conexion.query(sql, [datos,id]);
        return result
    }

    eliminar = async (id) => {
        const sql = 'UPDATE usuarios_oficinas SET activo = 0 WHERE idUsuarioOficina = ?';
        const [result] = await conexion.query(sql, [id]);
        return result
    }
}