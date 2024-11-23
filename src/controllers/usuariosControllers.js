// import { req, res} from "express";
import UsuariosService from "../services/usuariosServices.js"

export default class UsuariosControllers{

    constructor() {
        this.usuariosService = new UsuariosService;
    }

    buscarTodos = async (req, res) => {
        try {
          const usuarios = await this.usuariosService.buscarTodos();
          res.status(200).send(usuarios)
        } catch (error) {
          console.error(error);
          res.status(500).send({
            estado: 'Falla',
            mensaje: 'Error interno en servidor'
          });
        }
      }

    buscarPorId = async (req, res) => {

      try {
        const id = req.params.idUsuario;
          const error = this.chequeoId(id);
        if (error) {
          return res.status(400).send(error);
        }
        const result = await this.usuariosService.buscarPorId(id);
  
        if (!result || result.length === 0) {
          return res.status(400).send({ 
            mensaje: 'No se encontro usuario con ese id' });
        }
        res.status(200).send({ 
          estado: true, result: result });
  
      } catch (error) {
          console.log(error)
        res.status(500).send({ 
          mensaje: 'Lo sentimos, ha ocurrido un error en el servidor.' });
      }
    }


    //crea empleados
    crear = async (req, res) => {
      const { nombre,apellido,correoElectronico,contrasenia,imagen } = req.body;
      const idTipoUsuario = 2
    
            if (apellido === undefined || apellido === null) {
              return res.status(400).send({
                  estado: "Falla",
                  mensaje: "Faltan completar el campo apellido."
              })
          }
    
        try {
          const usuario = {
            nombre,
            apellido,
            correoElectronico,
            contrasenia,
            idTipoUsuario:idTipoUsuario,
            imagen
          }
    
          const result = await this.usuariosService.crear(usuario);

          if (!result.estado) {
                res.status(404).send({ estado: "Falla", mensaje: result.mensaje });
                console.log(result)
            }
            res.status(201).send({ estado: "OK", data: result.data });

    
        } catch (error) {
          console.error(error);
          res.status(500).send({
            estado: 'Falla',
            mensaje: 'Error interno en servidor'
          });
        }
      }

    modificar = async (req, res) => {
      try {
          const id = req.params.idUsuario;
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

          const result = await this.usuariosService.modificar(id, datos);
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

    actualizar = async (req, res) => {
      try {
          const idUsuario = req.user.idUsuario; // Obtén el ID del usuario del token
          const datosActualizados = req.body;
  
          if (Object.keys(datosActualizados).length === 0) {
              return res.status(400).send({
                  estado: "Falla",
                  mensaje: "No se enviaron datos para actualizar."
              });
          }
  
          const result = await this.usuariosService.actualizar(idUsuario, datosActualizados);
  
          if (!result.estado) {
              return res.status(404).send({ estado: "Falla", mensaje: result.mensaje });
          }
  
          res.status(200).send({ estado: "OK", mensaje: "Perfil actualizado exitosamente", data: result.data });
      } catch (error) {
          console.error(error);
          res.status(500).send({ estado: "Falla", mensaje: "Error interno en el servidor" });
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