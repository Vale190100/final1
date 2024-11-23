import ReclamosService from "../services/reclamosServices.js";

export default class ReclamosController {
    constructor() {
        this.service = new ReclamosService();
    }

    buscarTodos = async (req, res) => {
        try {
            const reclamos = await this.service.buscarTodos();
            res.status(200).send(reclamos);

        } catch (error) {
            console.log(error)
            res.status(500).send({ 
                error: "Error interno en el servidor" });
        }
    };

    buscarPorId = async (req, res) => {
        try {
            const id = req.params.idReclamo;
            const error = this.chequeoId(id);
            if (error) {
                return res.status(400).send(error);
            }

            const result = await this.service.buscarPorId(id);
            if (result === null) {
                return res.status(400).send({ 
                    mensaje: 'No se encontro el reclamo con ese id' });
            }

            res.status(200).send({ 
                estado: true, result: result });

        } catch (error) {
            console.log(error);
            res.status(500).send({
                 error: "Error interno en el servidor" });
        }
    }


    crear = async (req, res) => {
        try {
            const { asunto, descripcion, idReclamoTipo, idUsuarioCreador } = req.body;

            if (asunto === undefined || idReclamoTipo === undefined || idUsuarioCreador === undefined) {
                return res.status(400).send({
                    estado: "Falla",
                    mensaje: "Faltan datos obligatorios."
                })
            }

            const reclamo = {
                asunto,
                descripcion,
                idReclamoTipo,
                idUsuarioCreador
            }

            const result = await this.service.crear(reclamo);
            if (!result.estado) {
                res.status(404).send({ 
                    estado: "Falla", mensaje: result.mensaje });
            }
            res.status(201).send({ 
                estado: "OK", data: result.data });

        } catch (error) {
            console.log(error);
            res.status(500).send({
                estado: "Falla", mensaje: "Error interno en servidor."
            });
        }
    }

    modificar = async (req, res) => {
        try {
            const id = req.params.idReclamo;
            const error = this.chequeoId(id);
            if (error) {
                return res.status(400).send(error);
            }

            const datos = req.body;
            if (Object.keys(datos).length === 0) {
                return res.status(400).send({
                    estado: "Falla",
                    mensaje: "No se enviaron datos para ser modificados."
                });
            }

            const result = await this.service.modificar(id, datos);
            if (result.estado) {
                res.status(200).send({ estado: "OK", mensaje: result.mensaje, data: result.data });
            } else {
                res.status(404).send({ estado: "Falla", mensaje: result.mensaje });
            }

        } catch (error) {
            console.log(error)
            res.status(500).send({
                estado: "Falla", mensaje: "Error interno en servidor."
            });
        }
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
                idReclamoEstado:idReclamoEstado
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


    consultar = async (req, res) => {
        try {
            const idUsuarioCreador = req.user.idUsuario;

            //console.log(idUsuarioCreador)
            const error = this.chequeoId(idUsuarioCreador);
            if (error) {
                return res.status(400).send(error);
            }

            const result = await this.service.consultar(idUsuarioCreador);
            if (result === null) {
                return res.status(400).send({ mensaje: 'No tiene reclamos Creados' });
            }

            res.status(200).send({ estado: true, result: result });
        } catch (error) {
            console.error(error);
            res.status(500).send({ error: "Error interno en el servidor" });
        }
    }


    cancelar = async (req, res) => {
        try {

            const idUsuarioCreador = req.user.idUsuario;
            const idReclamo = req.params.idReclamo;
            const error = this.chequeoId(idReclamo);
            if (error) {
                return res.status(400).json(error);
            }


            if (idUsuarioCreador === undefined) {
                return res.status(400).send({
                    estado: "Falla",
                    mensaje: "Faltan datos obligatorios."
                })
            }

            const reclamoCancelado = await this.service.cancelar(idReclamo, idUsuarioCreador)

            res.status(200).send({ estado: true, result: reclamoCancelado });
        } catch (error) {
            console.error(error);
            res.status(500).send({ error: "Error interno en el servidor" });
        }
    }


    listar = async (req, res) => {
        try {
            const idUsuario = req.user.idUsuario;
            console.log("ID del usuario:", idUsuario);
    
            const oficina = await this.service.listar(idUsuario); 
            if (!oficina || oficina.estado === false) {
                return res.status(404).send({ estado: "Falla", message: oficina.mensaje || 'No hay oficina asociada al usuario.' });
            }
    
            res.status(200).send({ estado: true, result: oficina });
        } catch (error) {
            console.error("Error al obtener oficina:", error);
            res.status(500).send({ estado: "Falla", message: "Error interno del servidor al obtener la oficina." });
        }
    };


    informe = async (req, res) => {
        const formatosPermitidos = ['pdf', 'csv'];

        try {
            const formato = req.params.formato;
            console.log(formato)
            console.log(formatosPermitidos)
            if (!formato || !formatosPermitidos.includes(formato)) {
                return res.status(400).send({
                    estado: "Falla",
                    mensaje: "Formato inválido para el informe."
                })
            }

            const { buffer, path, headers } = await this.service.generarInforme(formato);
            res.set(headers)

            if (formato === 'pdf') {
                res.status(200).end(buffer);
            } else if (formato === 'csv') {
                res.status(200).download(path, (err) => {
                    if (err) {
                        return res.status(500).send({
                            estado: "Falla",
                            mensaje: " No se pudo generar el informe."
                        })
                    }
                })
            }
        } catch (error) {
            console.log(error)
            res.status(500).send({
                estado: "Falla", mensaje: "Error interno en servidor."
            });
        }
    }



    verEstadisticas = async (req, res) => {
        console.log("Método verEstadisticas iniciado");
        try {
            const estadisticas = await this.service.obtenerEstadisticas();
            console.log("Estadísticas obtenidas:", estadisticas);
            res.status(200).send({ estado: 'OK', data: estadisticas });
        } catch (error) {
            console.error("Error en verEstadisticas:", error);
            res.status(500).send({ estado: 'Error', mensaje: 'Error al obtener estadísticas' });
        }
    };

    verUsuariosPorOficina = async (req, res) => {
        try {
            console.log("Método verUsuariosPorOficina iniciado");
            const usuariosPorOficina = await this.service.obtenerUsuariosPorOficina();
            res.status(200).send({ estado: 'OK', data: usuariosPorOficina });
        } catch (error) {
            console.error("Error en verUsuariosPorOficina:", error);
            res.status(500).send({ estado: 'Error', mensaje: 'Error al obtener estadísticas de usuarios por oficina' });
        }
    };






    chequeoId(id) {

        if (id === undefined) {
            return { mensaje: 'El id es requerido' };
        }
        if (isNaN(id)) {
            return { mensaje: 'El id debe ser un número' };
        }
        if (!Number.isInteger(Number(id))) {
            return { mensaje: 'El id debe ser un número entero' };
        }
        if (id <= 0) {
            return { mensaje: 'El id debe ser un número positivo' };
        }
        return null;
    }  

}