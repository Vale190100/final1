import ReclamosEstadosService from "../services/reclamosEstadosServices.js"


export default class ReclamosEstadosControllers{

    constructor(){
        this.service = new ReclamosEstadosService()
    }


    buscarTodos = async (req, res) => {
        try{
            const reclamosEstados = await this.service.buscarTodos();
            res.status(200).send(reclamosEstados)

        }catch (error){
            console.log(error);
            res.status(500).send({
                estado:"Falla", mensaje: "Error interno en el servidor"
            });

        }
    }

    buscarPorId = async (req, res) => {
        try {
        
          const id = req.params.idReclamoEstado;

          const error = this.chequeoId(id);
          if (error) {
            return res.status(400).send(error);
          }


          const result = await this.service.buscarPorId(id);
    
          if (!result || result.length === 0) {
            return res.status(400).send({ 
                estado:"Falle", mensaje: 'No se encontro el reclamo con ese id' });
          }

          res.status(200).send({ 
            estado: true, result: result });
    
        } catch (error) {
            res.status(500).send({ 
            estado: "Falla", mensaje: 'Lo sentimos, ha ocurrido un error en el servidor.' });
        }
    }

      
    crear = async (req, res) => {
        const { descripcion, activo } = req.body;

        if (!descripcion) {
            return res.status(404).send({
                estado: "Falla", mensaje: "Se requiere el campo descripción"
            })
        }
    
        if (!activo === undefined || activo === null) {
            return res.status(404).send({
                estado: "Falla", mensaje: "Se requiere el campo activo"
            })
        }

        try{
            const reclamoEstado = {
                descripcion,
                activo
            }

            const nuevoReclamoEstado = await this.service.crear(reclamoEstado); //utiliza el servicio para crear
            res.status(201).send({
                estado: "Ok", data: nuevoReclamoEstado
            });

        }catch (error) {
            console.log(error);
            res.status(500).send({
                estado:"Falla", mensaje: "Error interno en el servidor"
        })
    }
    }
      crear = async (req, res) => {

    const { descripcion, activo } = req.body;
    if (!descripcion) {
      return res.status(400).send({
        estado: "falla",
        mensaje: "se requiere el campo descripción."
      })
    }

    if (activo === undefined || activo === null) {
      return res.status(400).send({
        estado: "falla",
        mensaje: "Se requiere el campo activo."
      })
    }

    try {
      const reclamoEstado = {
        descripcion,
        activo
      }

      const result = await this.reclamosEstadosService.crear(reclamoEstado);
      if (result.affectedRows === 0) {
        return res.status(404).send({
          mensaje: "No se pudo crear el Reclamo-estado."
        })
      }

      const nuevoReclamoEstado = await this.reclamosEstadosService.buscarPorId(result.insertId);
      res.status(201).send({
        estado: "Ok", data: nuevoReclamoEstado
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
        try {
            const { descripcion, activo } = req.body;
            const id = req.params.idReclamoEstado;

            const error = this.chequeoId(id);
            if (error) {
            return res.status(400).send(error);
            }

            if (!descripcion) {
            return res.status(404).send({
                estado: "Falla", mensaje: "Se requiere el campo descripcion"
            })
            }

            if (!activo) {
            return res.status(404).send({
                estado: "Falla", mensaje: "Se requiere completar el campo activo"
            })
            }

            const datos = {
            descripcion : descripcion,
            activo : activo
            }

            console.log(datos); 

            const result = await this.service.modificar(id, datos);

            if (result.affectedRows === 0) {
            return res.status(404).send({
                estado: "Falla", mensaje: "No se ha encontrado la información que estás buscando. Por favor, verifica los campos ingresados e intenta nuevamente."
            })
            }

            res.status(200).send({
            estado: "Ok", mensaje: "Reclamo modificado"
            })

        } catch (error) {
            console.log(error)
            res.status(500).send({
            estado: "Falla", mensaje: 'Error en el intento.'
            })
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



    


