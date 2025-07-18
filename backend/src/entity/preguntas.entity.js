"use strict";
import { EntitySchema } from "typeorm";

const PreguntasSchema = new EntitySchema({
    name:"Preguntas",
    tableName:"pregunta",
    columns:{
        id:{
            type: "int",
            primary: true,
            generated: true,
        },
        texto:{
            type: "varchar",
            length: 2000,
            nullable: false,
        },
        imagenUrl:{
            type: "varchar",
            length: 255,
            nullable: true,
            default: null
        },
        imagenKey:{
            type: "varchar",
            length: 255,
            nullable: true,
            default: null
        },
        idCuestionario:{
            type:"int",
            nullable: false,
        }
    },
    relations:{
        idCuestionario:{
            target: "cuestionarios",
            type: "many-to-one",
            joinColumn: { name: "idCuestionario", referencedColumnName: "id" },
            onDelete: "CASCADE"
        },
         respuestas: {
            // Nombre de la propiedad que podrás usar en las consultas
            type: "one-to-many",
            target: "Respuesta", // El 'name' de la entidad RespuestaSchema
            inverseSide: "idPreguntas" // La propiedad en RespuestaSchema que apunta de vuelta aquí
        }

    }
});

export default PreguntasSchema;