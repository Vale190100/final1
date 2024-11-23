import ReclamosTipo from "../database/reclamosTipo.js";



export default class reclamosTipoService
{

    constructor(){
        this.reclamosTipo = new ReclamosTipo();
    }

    buscarTodos= ()=>{
        return this.reclamosTipo.buscarTodos();
    }

    buscarPorId = (id) => {
        return this.reclamosTipo.buscarPorId(id);
    }

    crear = (reclamosTipo) => {
        return this.reclamosTipo.crear(reclamosTipo);
    }

    modificar = (id, datos) => {
        return this.reclamosTipo.modificar(id, datos);
    }

}