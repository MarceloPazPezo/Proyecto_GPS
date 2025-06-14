"use strict";
import{
    createCompartidoService,
    getCompartidoService,
    getCompartidosService,
} from "../services/compartido.service.js";

//recuerda usar los validations cuando 

import{
    handleErrorClient,
    handleErrorServer,
    handleSuccess,
} from "../handlers/responseHandlers.js";

export async function createCompartido(req,res) {
    try{
        const { body } = req;
        const [ newCompartido, errorCompartido ] = await createCompartidoService(body);
        if (errorCompartido) 
            return handleErrorClient(res,400,"Error creando el registro de compartido", errorCompartido);
        return handleSuccess(res,201,"Registro de compartido creado",newCompartido)
    } catch (error){
        handleErrorServer(res,500,error.message);
    }
}

export async function getCompartido(req,res) {
    try{
        const { idCuestionario , idUser } = req.query;
        const [ Compartido, errorCompartido ] = await getCompartidoService({ idCuestionario , idUser });
        if(errorCompartido) return handleErrorClient(res,404,errorCompartido);
        handleSuccess(res,200,"Registro de compratido encontrado",Compartido);
    }catch(error){
        handleErrorServer(res,500,error.message);
    }   
}

export async function getCompartidos(res) {
    try{
        const [ Compartidos, errorCompartidos ] = await getCompartidosService();
        if (errorCompartidos) return handleErrorClient(res,404,errorCompartidos);
        if (Compartidos.length === 0) return handleErrorClient(res,404,errorCompartidos);
        handleSuccess(res,200,"Registros de compartidos encontrados",Compartidos);
    }catch(error){
        handleErrorServer(res,500,error.message);
    }
}

