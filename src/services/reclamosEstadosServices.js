import ReclamosEstados from "../database/reclamosEstados.js";

export default class ReclamosEstadosService {

    constructor(){
        this.reclamosEstados = new ReclamosEstados();
    }

    buscarTodos = () => {
        return this.reclamosEstados.buscarTodos();
    }

    buscarPorId = (id) => {
        return this.reclamosEstados.buscarPorId(id);

    }

    crear = (reclamosEstado) => {
        return this.reclamosEstados.crear(reclamosEstado);

    }

    modificar = (id, datos) => {
        return this.reclamosEstados.modificar(id, datos);

    }
}

