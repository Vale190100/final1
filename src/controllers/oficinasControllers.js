import OficinasService from "../services/oficinasServices.js"

export default class OficinasController {

  constructor() {
    this.oficinasService = new OficinasService();
  }

  buscarTodos = async (req, res) => {
    try {
      const oficinas = await this.oficinasService.buscarTodos();
      res.status(200).send({oficinas})
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
      const id = req.params.idOficina;
      const error = this.chequeoId(id);
      if (error) {
        return res.status(400).send(error);
      }
      const result = await this.oficinasService.buscarPorId(id);

      if (!result || result.length === 0) {
        return res.status(400).send({ 
            mensaje: 'No se encontro oficina con ese id' });
      }
      res.status(200).send({ 
        estado: true, result: result });

    } catch (error) {
      res.status(500).send({ 
        mensaje: 'Lo sentimos, ha ocurrido un error en el servidor.' });
    }
  }

  crear = async (req, res) => {

    const { nombre, idReclamoTipo, activo } = req.body;
    if (!nombre) {
      return res.status(400).send({
        estado: "falla",
        mensaje: "se requiere el campo nombre."
      })
    }
    
    if (!idReclamoTipo) {
      return res.status(400).send({
        estado: "falla",
        mensaje: "se requiere el campo idReclamoTipo."
      })
    }

    if (activo === undefined || activo === null) {
      return res.status(400).send({
        estado: "falla",
        mensaje: "Se requiere el campo activo."
      })
    }

    try {
      const oficina = {
        nombre,
        idReclamoTipo,
        activo
      }

      const result = await this.oficinasService.crear(oficina);
      if (result.affectedRows === 0) {
        return res.status(404).send({
          mensaje: "No se pudo crear la oficina."
        })
      }

      const nuevaOficina = await this.oficinasService.buscarPorId(result.insertId);
      res.status(201).send({
        estado: "Ok", data: nuevaOficina
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
      const { nombre, idReclamoTipo, activo } = req.body;
      const id = req.params.idOficina;

      const error = this.chequeoId(id);
      if (error) {
        return res.status(400).send(error);
      }

      const errorReclamo = this.chequeoId(idReclamoTipo);
      if (errorReclamo) {
        return res.status(400).send(error);
      }

      if (!nombre) {
        return res.status(404).send({
          mensaje: "Se requiere el campo nombre"
        })
      }

      if (!idReclamoTipo) {
        return res.status(404).send({
          mensaje: "Se requiere el campo idReclamoTipo"
        })
      }

      if (!activo) {
        return res.status(404).send({
          mensaje: "Se requiere el campo activo"
        })
      }

      const datos = {
        nombre: nombre,
        idReclamoTipo: idReclamoTipo,
        activo: activo
      }

      const result = await this.oficinasService.modificar(id, datos);

      console.log(result)
      if (result.affectedRows === 0) {
        return res.status(404).send({
          mensaje: "No se ha encontrado la información que estás buscando. Por favor, verifica los campos ingresados e intenta nuevamente."
        })
      }

      res.status(200).send({
        mensaje: "Oficina modificada"
      })

    } catch (error) {
      console.log(error)
      res.status(500).send({
        mensaje: 'Error en el intento.'
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