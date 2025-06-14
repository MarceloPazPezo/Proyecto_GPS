"use strict";
import {
    createSesionService,
    getSesionesService,
    getSesionService,
} from "../services/sesion.service.js";

import {
    handleErrorClient,
    handleErrorServer,
    handleSuccess,
} from "../handlers/responseHandlers.js";

export async function createSesion(req,res) {
    try{
        const { body } = req;
        const [ newSesion, errorSesion ] = await createSesionService(body);
        if(errorSesion)
            return handleErrorClient(res,400,"Error creando la sesion", errorSesion);
        return handleSuccess(res,201,"Sesion creada",newSesion);
    }catch(error){
        handleErrorServer(res,500,error.message);
    }
}

export async function getSesion(req,res) {
    try{
        const { idCuestionario, idUser } = req.query;
        const { sesion, errorSesion } = await getSesionService({ idCuestionario , idUser });
        if(errorSesion) return handleErrorClient(res,404,errorSesion);
        handleSuccess(res,200,"Sesion Obtenida",sesion);
    }catch(error){ 
        handleErrorServer(res,500,error.message);
    }
}

export async function getSesiones(res) {
    try{
        const [ sesiones,errorSesiones ] = await getSesionesService();
        if (errorSesiones) return handleErrorClient(res,404,errorSesiones);
        if (sesiones.length === 0) return handleErrorClient(res,404,errorSesiones);
        handleSuccess(res,200,"Sesiones encontradas",sesiones);
    }catch(error){
        handleErrorServer(res,500,error.message);
    }
    
}