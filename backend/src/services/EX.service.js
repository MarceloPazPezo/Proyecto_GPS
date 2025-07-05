import { AppDataSource } from "../config/configDb.js";

export async function getQuizzesByUserService(idUser) {
    const query1 = `select u.id as idUser,u."nombreCompleto" as Usuario, c.id as idQuiz,c.nombre as nombre 
        from users u, cuestionarios c
        where (c."idUser"=${idUser} and u.id=c."idUser");`;
    const query2=`select u."nombreCompleto" as Usuario, c.nombre as Nombre
        from users u, cuestionarios c, compartido comp
        where comp."idUser"=${idUser} and u.id=c."idUser" and comp."idCuestionario"=c.id;`
    try {
        const propios = await AppDataSource.query(query1);
        const compartidos= await AppDataSource.query(query2);
        const result=propios.concat(compartidos);
        if (result.length === 0) return [null, "No se encontraron Cuestionarios"];

        return [result, null];
    } catch (error) {
        return [null, "Error interno del servidor"];
    }
}