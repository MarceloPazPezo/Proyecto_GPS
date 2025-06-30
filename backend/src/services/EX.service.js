import { AppDataSource } from "../config/configDb.js";

export async function getQuizzesByUserService(idUser) {
    const query = `select u."nombreCompleto" as Usuario, c.nombre as nombre 
        from users u, cuestionarios c, compartido comp
        where (c."idUser"=1 and u.id=c."idUser") or 
        (comp."idUser"=1 and u.id=c."idUser" and comp."idCuestionario"=c.id);`;
    try {
        const result = await AppDataSource.query(query);
        if(result.length===0) return [null,"No se encontraron Cuestionarios"]
        return [result, null];
    } catch (error) {
        return [null, "Error interno del servidor"];
    }
}