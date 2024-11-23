import Reclamos from "../database/reclamos.js";
import UsuariosOficinas from "../database/usuariosOficinas.js";
import NotificacionCorreo from '../services/notificacionCorreo.js';
import OficinasService from "./oficinasServices.js";
import InformeService from "./informesServices.js";
import { conexion } from "../database/conexion.js";


export default class ReclamosService {

    constructor() {
        this.reclamos = new Reclamos();
        this.usuarioOficinas = new UsuariosOficinas()
        this.oficinasService = new OficinasService()
        this.notificacionCorreo = new NotificacionCorreo()
        this.informeService = new InformeService();
    }

    buscarTodos = async () => {
        return await this.reclamos.buscarTodos();
    }

    buscarPorId = async (id) => {
        const result = await this.reclamos.buscarPorId(id);
        return (result.length > 0) ? result[0] : null;
    }

    crear = async (reclamo) => {
        const reclamoCreado = await this.reclamos.crear(reclamo);
        if (!reclamoCreado) {
            return { estado: false, mensaje: 'Reclamo no creado' };
        }
        return { estado: true, mensaje: 'Reclamo creado', data: await this.buscarPorId(reclamoCreado.insertId) };
    }

    modificar = async (id, datos) => {
        const existe = await this.reclamos.buscarPorId(id)
        if (existe === null || existe.length === 0) {
            return { estado: false, mensaje: 'Reclamo no existe' };
        }
        await this.reclamos.modificar(id, datos);
        const result = await this.reclamos.buscarPorId(id)
        return { estado: true, mensaje: 'Reclamo modificado con exito', data: result }
    }

    atender = async (idReclamo, datos) => {
        const existe = await this.reclamos.buscarPorId(idReclamo)
        if (existe === null || existe.length === 0) {
            return { estado: false, mensaje: 'Reclamo no existe' };
        }

        if (existe[0].idReclamoEstado == datos.idReclamoEstado) {
            return { estado: false, mensaje: 'El estado del reclamo no ha cambiado' };
        }

        const result = await this.reclamos.modificar(idReclamo, datos);
        if (!result) {
            return { estado: false, mensaje: 'Reclamo no modificado' };
        }

        return this.envioCorreo(idReclamo)
    }

    consultar = async (idUsuarioCreador) => {
        const result = await this.reclamos.consultar(idUsuarioCreador);
        return (result.length > 0) ? result : null;
    }

    cancelar = async (idReclamo, idUsuarioCreador) => {

        const existe = await this.reclamos.buscarPorId(idReclamo)
        if (existe === null || existe.length === 0) {
            return { estado: false, mensaje: 'Reclamo no existe' };
        }

        if (existe[0].idReclamoEstado === 3 ) {
            return { estado: false, mensaje: 'Reclamo ya esta cancelado' };
        }

        if (existe[0].idReclamoEstado != 1) {
            return { estado: false, mensaje: 'Ya no podes cancelar el reclamo' };
        }

        const result = await this.reclamos.cancelar(idReclamo, idUsuarioCreador);
        if (!result) {
            return { estado: false, mensaje: 'Reclamo no modificado' };
        }
        this.envioCorreo(idReclamo)
        return { estado: true, mensaje: 'Reclamo cancelado con exito' }
    }


    generarInforme = async (formato) => {
        if (formato === 'pdf') {
            return await this.reportePdf();
        }else if (formato === 'csv'){ 
            return await this.reporteCsv();
        }
    }

    listar = async (id) => {
        const oficina = await this.usuarioOficinas.buscarPorIdUsuario(id);
        if (!oficina || oficina.length === 0) {
            return { estado: false, mensaje: 'Empleado sin oficina' };
        }

        const oficinaId = oficina[0].idOficina
        
        const oficinaResult = await this.oficinasService.buscarPorId(oficinaId);
        if (!oficinaResult || oficinaResult.length === 0) {
            return { estado: false, mensaje: 'Oficina no encontrada' };
        }
        const idReclamoTipo = oficinaResult.idReclamoTipo
        const reclamosList = await this.reclamos.reclamosPorOficina(idReclamoTipo)

        return reclamosList;
    }

    reportePdf = async () => {
        const datosReporte = await this.reclamos.buscarDatosReportePdf();

        if (!datosReporte || datosReporte.length === 0) {
            return { estado: false, mensaje: 'Sin datos para el reporte'};
        }
        const pdf = await this.informeService.informeReclamosPdf(datosReporte);
        return {
            buffer: pdf,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'inline; filename="reporte.pdf"'
            }
        };
    }

    reporteCsv = async () => {
        const datosReporte = await this.reclamos.buscarDatosReporteCsv();
        if (!datosReporte || datosReporte.length === 0) {
            return {estado: false, mensaje: 'Sin datos para el reporte'};
        }
        const csv =  await this.informeService.informeReclamosCsv(datosReporte);
        return {
            path: csv,
            headers: {
                'Content-Type': 'text/csv',
                'Content-Disposition': 'attachment; filename="reporte.csv"'
            }
        };
    }

    obtenerEstadisticas = async () => {
        console.log("Método obtenerEstadisticas iniciado");
        const sql = 'CALL obtenerEstadisticasReclamos()';
        try {
            const [result] = await conexion.query(sql);
            console.log("Resultado obtenido de la base de datos:", result);
            return result[0];
        } catch (error) {
            console.error("Error en obtenerEstadisticas:", error);
            throw error;
        }
    };

    obtenerUsuariosPorOficina = async () => {
        const sql = 'CALL obtenerUsuariosPorOficina()';
        try {
            const [result] = await conexion.query(sql);
            return result[0]; // El resultado de la consulta
        } catch (error) {
            console.error("Error en obtenerUsuariosPorOficina:", error);
            throw error;
        }
    };


  
    envioCorreo = async (idReclamo) => {
        const cliente = await this.reclamos.buscarCliente(idReclamo);
        if (!cliente) {
          return { estado: false, mensaje: 'Cliente no encontrado' };
        }
      
        const datosCliente = {
          nombre: cliente[0].cliente,
          correoElectronico: cliente[0].correoElectronico,
          idReclamo: idReclamo,
          estado: cliente[0].estado
        };
      
        console.log("enviado?");
        return await this.notificacionCorreo.notificacionCorreo(datosCliente);
      }



}

