import { AppDataSource } from "../config/configDb.js";

export async function getQuizzesByUserService(idUser) {
    const query1 = `SELECT
    u.id AS idUser,
    u."nombreCompleto" AS Usuario,
    c.id AS idQuiz,
    c.nombre AS nombre,
    TO_CHAR(c."fechaCreacion", 'DD-MM-YYYY') AS "fechaCreacion",
    COUNT(p.id) AS num_preguntas
FROM
    users u
JOIN
    cuestionarios c ON u.id = c."idUser"
LEFT JOIN
    pregunta p ON c.id = p."idCuestionario"
WHERE
    u.id = ${idUser}
GROUP BY
    u.id, u."nombreCompleto", c.id, c.nombre, c."fechaCreacion";`;
    const query2=`select u.id as idUser,u."nombreCompleto" as Usuario, c.id as idQuiz,c.nombre as nombre 
        from users u, cuestionarios c, compartido comp
        where comp."idUser"=${idUser} and u.id=c."idUser" and comp."idCuestionario"=c.id;`
    try {
        const propios = await AppDataSource.query(query1);
        const compartidos= await AppDataSource.query(query2);
        const result=propios.concat(compartidos);
        if (result.length === 0) return [null, "No se encontraron Cuestionarios"];
        //console.log(result)
        return [result, null];
    } catch (error) {
        return [null, "Error interno del servidor"];
    }
}