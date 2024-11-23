import UsuariosOficinasService from "../services/usuariosOficinasServices.js";


export default class UsuariosOficinasController {
    
    constructor() {
        this.service = new UsuariosOficinasService()
    }

    buscarTodos = async (req,res) =>{
        try {
           const usuariosOficinas = await this.service.buscarTodos();
            res.status(200).send(usuariosOficinas)

        } catch (error) {
            console.log(error);
            res.status(500).send({
                estado: "falla",
                mensaje: "Error en servidor"
            })
            
        }
    }

    buscarPorId = async (req, res) => {
        try {
          const id = req.params.idUsuarioOficina;
          const error = this.chequeoId(id);
          if (error) {
            return res.status(400).send(error);
          }
          const result = await this.service.buscarPorId(id);
    
          if (!result || result.length === 0) {
            return response.status(400).send({ 
                mensaje: 'No se encontro tipo de usuario con ese id' });
          }
          res.status(200).send({ 
            estado: true, result: result });
        } catch (error) {
          res.status(500).send({ 
            mensaje: 'Lo sentimos, ha ocurrido un error en el servidor.' });
        }
      }

      
      crear = async (req, res) => {

        const { idUsuario, idOficina, activo } = req.body;
        if (!idUsuario) {
          return res.status(400).send({
            estado: "falla",
            mensaje: "se requiere el campo idUsuario."
          })
        }
        
        if (!idOficina) {
          return res.status(400).send({
            estado: "falla",
            mensaje: "se requiere el campo idOficina."
          })
        }
    
        if (activo === undefined || activo === null) {
          return res.status(400).send({
            estado: "falla",
            mensaje: "Se requiere el campo activo."
          })
        }
    
        try {
          const usuariosOficina = {
            idUsuario,
            idOficina,
            activo
          }
          
          const result = await this.service.crear(usuariosOficina);
          if (result.affectedRows === 0) {
            return res.status(404).send({
              mensaje: "No se pudo crear el UsuarioOficina."
            })
          }
          const nuevoUsuariosOficina = await this.service.buscarPorId(result.insertId);
            res.status(201).send({
                estado: "Ok", data: nuevoUsuariosOficina
            });
          
    
        } catch (error) {
          console.error(error);
          res.status(500).send({
            estado: 'Falla',
            mensaje: 'Error interno en servidor'
          });
        }
      }

      modificar = async (req, res) => {
          const { idUsuario, idOficina, activo } = req.body;
          const id = req.params.idUsuarioOficina;
    
          const error = this.chequeoId(id);
          if (error) {
            return res.status(400).send(error);
          }
    
          if (!idUsuario) {
            return res.status(400).send({
              estado: "falla",
              mensaje: "se requiere el campo idUsuario."
            })
          }
          
          if (!idOficina) {
            return res.status(400).send({
              estado: "falla",
              mensaje: "se requiere el campo idOficina."
            })
          }
      
          if (activo === undefined || activo === null) {
            return res.status(400).send({
              estado: "falla",
              mensaje: "Se requiere el campo activo."
            })
          }
        try {
    
            const usuariosOficina = {
                idUsuario,
                idOficina,
                activo
              }
    
          const result = await this.service.modificar(id,usuariosOficina);
    
          console.log(result)
          if (result.affectedRows === 0) {
            return res.status(404).send({
              mensaje: "No se ha encontrado la información que estás buscando. Por favor, verifica los campos ingresados e intenta nuevamente."
            })
          }
    
          res.status(200).send({
            mensaje: "usuario Oficina modificada"
          })
    
        } catch (error) {
          console.log(error)
          res.status(500).send({
            mensaje: 'Error en el intento.'
          })
        }
      }
    
      eliminar = async (req, res) => {
        try {
            const id = req.params.idUsuarioOficina;
            const error = this.chequeoId(id);
            if (error) {
              return res.status(400).send(error);
            }
            const result = await this.service.eliminar(id);
            console.log(result);
            
            res.status(200).send({ 
                mensaje: "usuario Oficina eliminada" });
          } catch (error) {
            res.status(500).send({ 
                mensaje: 'Lo sentimos, ha ocurrido un error en el servidor.' });
        }
      }

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