import {conexion} from "./conexion.js";

export default class ReclamosEstados{

    buscarTodos = async () => {
        const sql = 'SELECT * FROM reclamos_estado WHERE activo = 1;';
        const [result] = await conexion.query(sql);

        return result 
    }

    buscarPorId = async (id) => {
        const sql = `SELECT * FROM reclamos_estado WHERE activo = 1 AND idReclamoEstado = ?`;
        const [result] = await conexion.query(sql, [id]);

        return (result.length > 0) ? result[0] : null;
    
    }

    crear = async ({descripcion, activo}) => {
        const sql = 'INSERT INTO reclamos_estado (descripcion, activo) VALUES (?,?)';
        const [result] = await conexion.query(sql, [descripcion, activo]);
        
        console.log(result);
        if (result.affectedRows === 0) {
            return res.status(404).json({
                mensaje: "No de pudo modificar el reclamo"
            })
        }
        
        return this.buscarPorId(result.insertId
        )
    
    }


    modificar = async (id, datos) => {
        const sql = 'UPDATE reclamos_estado SET ? WHERE idReclamoEstado = ?';
        const [result] = await conexion.query(sql, [datos, id]);
        return result
    }

    atender = async (req, res) => {
        try {
            const idReclamo = req.params.idReclamo
            const idReclamoEstado = req.body.idReclamoEstado

            const errorId = this.chequeoId(idReclamo);
            if (errorId) {
                return res.status(400).send(errorId);
            }

            const errorEstadoId = this.chequeoId(idReclamoEstado)
            if (errorEstadoId) {
                return res.status(400).send(errorEstadoId);
            }

            const data = {
                idReclamoEstado
            }

            const modificado = await this.service.atender(idReclamo, data)

            if (!modificado.estado) {
                return res.status(400).send({ estado: "ok", mensaje: modificado.mensaje });
            } else {
                return res.status(200).send({ estado: "ok", mensaje: modificado.mensaje });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).send({ estado: "error", mensaje: "Error interno en el servidor..." });
        }
    }

}