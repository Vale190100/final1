import UsuariosOficinas from "../database/usuariosOficinas.js";



export default class UsuariosOficinasService{
    constructor(){
        this.usuariosOficinas = new UsuariosOficinas();
    }

    buscarTodos = () =>{
        return this.usuariosOficinas.buscarTodos();
    }

    buscarPorId = (id) =>{
        return this.usuariosOficinas.buscarPorId(id);
    }

    buscarPorIdUsuario = (id) =>{
        return this.usuariosOficinas.buscarPorIdUsuario(id);
    }

    crear = (usuariosOficinas) => {
        return this.usuariosOficinas.crear(usuariosOficinas);
    }

    modificar = (id, datos) => {
        return this.usuariosOficinas.modificar(id, datos);
    }

    eliminar = (id) =>{
        return this.usuariosOficinas.eliminar(id);
    }

}