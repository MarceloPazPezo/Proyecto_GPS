"use strict";

import { EntitySchema } from "typeorm";

const CuestionarioSchema = new EntitySchema({
    name: "Cuestionario",
    tableName: "cuestionarios",
    columns:{
        idUser:{
            type: "int",
            nullable:false,
        },
        id: {
            type: "int",
            primary: true,
            generated: true,
        },
        nombre:{
            type: "varchar",
            length: 120,
            nullable: false,
        },
        fechaCreacion: {
            type: "timestamp with time zone",
            default: () => "CURRENT_TIMESTAMP",
            nullable: false,
        },
        
    },
    relations :{
        idUser: {
            target: "users",
            type: "many-to-one",
            joinColumn: { name: "idUser", referencedColumnName: "id" },
            onDelete: "CASCADE"
        },
        preguntas: {
            // Nombre de la propiedad que podrás usar en las consultas
            type: "one-to-many",
            target: "Preguntas", // El 'name' de la entidad PreguntasSchema
            inverseSide: "idCuestionario" // La propiedad en PreguntasSchema que apunta de vuelta aquí
        }
    }
});

export default CuestionarioSchema;