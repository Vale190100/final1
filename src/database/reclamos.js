import { conexion } from "./conexion.js";

export default class Reclamos {

    buscarTodos = async () => {
        const sql = `SELECT * FROM reclamos;`
        const [result] = await conexion.query(sql);
        return result;
    }

    buscarPorId = async (idReclamo) => {
        const sql = `SELECT * FROM reclamos WHERE idReclamo = ?`;
        const [result] = await conexion.query(sql, [idReclamo]);
        return result;
    }

    crear = async ({ asunto, descripcion, idReclamoTipo, idUsuarioCreador }) => {
        const sql = `INSERT INTO reclamos (asunto, descripcion, fechaCreado, idReclamoTipo, idReclamoEstado, idUsuarioCreador) 
        VALUES (?, ?, NOW(), 1, ?, ?)`;
        const [result] = await conexion.query(sql, [asunto, descripcion, idReclamoTipo, idUsuarioCreador]);
        return result;
    }

    modificar = async (id, datos) => {
        const sql = 'UPDATE reclamos SET ? WHERE idReclamo = ?';
        const [result] = await conexion.query(sql, [datos, id]);
        return result;
    }

    buscarCliente = async (idReclamo) => { //para atender
        const sql = `SELECT CONCAT(u.apellido, ' ', u.nombre) AS cliente, u.correoElectronico, rt.descripcion AS estado
        FROM reclamos AS r
        INNER JOIN usuarios AS u ON u.idUsuario = r.idUsuarioCreador
        INNER JOIN reclamos_estado AS rt ON rt.idReclamoEstado = r.idReclamoEstado 
        WHERE r.idReclamo =?;`
        const [result] = await conexion.query(sql, [idReclamo]);
        return result;
    }  


    consultar = async (idUsuarioCreador) => {
        const sql = `
            SELECT r.idReclamo, r.asunto, r.descripcion, r.fechaCreado, r.fechaFinalizado, r.fechaCancelado, 
                   re.descripcion AS estado, CONCAT(u.apellido, ' ', u.nombre) AS "Creado por"
            FROM reclamos AS r
            INNER JOIN reclamos_tipo AS rt ON rt.idReclamosTipo = r.idReclamoTipo
            INNER JOIN reclamos_estado AS re ON re.idReclamoEstado = r.idReclamoEstado
            INNER JOIN usuarios AS u ON u.idUsuario = r.idUsuarioCreador
            WHERE r.idUsuarioCreador = ?;
        `;
        const [result] = await conexion.query(sql, [idUsuarioCreador]);
        return result;
    };

    cancelar = async (idReclamo, idUsuarioCreador) => {
        const sql = 'UPDATE reclamos SET idReclamoEstado =3, fechaCancelado = NOW() WHERE idReclamo = ? AND idUsuarioCreador = ? ;';
        const [result] = await conexion.query(sql, [idReclamo, idUsuarioCreador]);
        return result;
    }

    buscarDatosReportePdf = async () => {        
        const sql = 'CALL `datosPDF`()';

        const [result] = await conexion.query(sql);

        const datosReporte = {
            reclamosTotales : result[0][0].reclamosTotales,
            reclamosNoFinalizados : result[0][0].reclamosNoFinalizados,
            reclamosFinalizados : result[0][0].reclamosFinalizados,
            descripcionTipoRreclamoFrecuente : result[0][0].descripcionTipoRreclamoFrecuente,
            cantidadTipoRreclamoFrecuente : result[0][0].cantidadTipoRreclamoFrecuente
        }

        return datosReporte;
    }

    buscarDatosReporteCsv = async () => {
        const sql = `SELECT r.idReclamo as 'reclamo', rt.descripcion as 'tipo', re.descripcion AS 'estado',
                    DATE_FORMAT(r.fechaCreado, '%Y-%m-%d %H:%i:%s') AS 'fechaCreado', CONCAT(u.nombre, ' ', u.apellido) AS 'cliente'
                    FROM reclamos AS r 
                    INNER JOIN reclamos_tipo AS rt ON rt.idReclamosTipo = r.idReclamoTipo 
                    INNER JOIN reclamos_estado AS re ON re.idReclamoEstado = r.idReclamoEstado 
                    INNER JOIN usuarios AS u ON u.idUsuario = r.idUsuarioCreador `;
        const [result] = await conexion.query(sql);
        return result;
    }

 
    //para listar
    reclamosPorOficina = async(idReclamoTipo) => {
        const sql = `SELECT r.idReclamo, r.asunto, r.descripcion, r.fechaCreado, r.fechaFinalizado, r.fechaCancelado, 
                        r.idReclamoEstado, re.descripcion AS descripción_estado, re.activo AS descripción_activo, 
                        r.idReclamoTipo, rt.descripcion AS descripción_tipo, rt.activo AS descripción_activo,
                        u.nombre AS "Creado por"
                        FROM reclamos AS r
                        INNER JOIN reclamos_tipo AS rt ON rt.idReclamosTipo = r.idReclamoTipo
                        INNER JOIN reclamos_estado AS re ON re.idReclamoEstado = r.idReclamoEstado
                        INNER JOIN usuarios AS u ON u.idUsuario = r.idUsuarioCreador WHERE r.idReclamoTipo = ?`;
        const [result] = await conexion.query(sql, [idReclamoTipo]);
        return result;
    }
    

}