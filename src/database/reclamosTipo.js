import { conexion } from "./conexion.js";


export default class ReclamosTipo{

    buscarTodos= async()=>{
        const sql = 'SELECT * FROM reclamos_tipo WHERE activo = 1;';
        const [result] = await conexion.query(sql);
        return result;
    } 
 
    buscarPorId = async (id) => {
        const sql = 'SELECT * FROM reclamos_tipo WHERE activo = 1 AND idReclamosTipo = ?';
        const [result] = await conexion.query(sql, [id]);
        return (result.length > 0) ? result[0] : null;
    }

    crear = async ({descripcion, activo}) => {        
        const sql = 'INSERT INTO reclamos_tipo (descripcion, activo) VALUES (?,?)';
        const [result] = await conexion.query(sql, [descripcion, activo]);
        return  result   
    }

    modificar = async (id, datos) => {
        const sql = 'UPDATE reclamos_tipo SET ? WHERE idReclamosTipo = ?';
        const [result] = await conexion.query(sql, [datos,id]);
        return result
    }
}