"use strict";
import { EntitySchema } from "typeorm";

const CompartidoSchema = new EntitySchema({
    name:"Compartido",
    tableName: "compartido",
    columns:{
        idCuestionario:{
            type:"int",
            nullable: false,
            primary: true,
        },
        idUser:{
            type: "int",
            nullable:false,
            primary: true,
        },
    },relations:{
        idCuestionario:{
            target: "cuestionarios",
            type: "many-to-one",
            joinColumn: { name: "idCuestionario", referencedColumnName: "id" },
            onDelete: "CASCADE"
        },
        idUser: {
            target: "users",
            type: "many-to-one",
            joinColumn: { name: "idUser", referencedColumnName: "id" },
            onDelete: "CASCADE"
        }
    }
});

export default CompartidoSchema;