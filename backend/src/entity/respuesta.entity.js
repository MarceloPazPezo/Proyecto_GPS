"use strict";

import { EntitySchema } from "typeorm"

const RespuestaSchema = new EntitySchema({
    name: "Respuesta",
    TableName: "respuestas",
    columns: {
        id: {
            type: "int",
            primary: true,
            generated: true,
        },
        textoRespuesta: {
            type: "varchar",
            length: 120,
            nullable: false,
        },
        correcta: {
            type: "boolean",
            default: false,
        },
        idPreguntas: {
            type: "int",
            primary: true,
        },
    },
    relations: {
        idPreguntas: {
            target: "pregunta",
            type: "many-to-one",
            joinColumn: { name: "idPreguntas", referencedColumnName: "id" },
            onDelete: "CASCADE",

        }
    }

});

export default RespuestaSchema;