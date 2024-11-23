import { conexion } from "./conexion.js";


export default class Oficinas{

    buscarTodos= async()=>{
        const sql = `SELECT * FROM oficinas`;
        const [result] = await conexion.query(sql);
        return result;
    } 
 
    buscarPorId = async (id) => {
        const sql = `SELECT * FROM oficinas WHERE idOficina = ?`;
        const [result] = await conexion.query(sql, [id]);
        return (result.length > 0) ? result[0] : null;
    }

    crear = async ({nombre, idReclamoTipo, activo}) => {        
        const sql = 'INSERT INTO oficinas (nombre, idReclamoTipo, activo) VALUES (?,?,?)';
        const [result] = await conexion.query(sql, [nombre, idReclamoTipo, activo]);
        return  result   
    }

    modificar = async (id, datos) => {
        const sql = 'UPDATE oficinas SET ? WHERE idOficina = ?';
        const [result] = await conexion.query(sql, [datos,id]);
        return result
    }
}