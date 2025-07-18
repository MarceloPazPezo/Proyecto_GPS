"use strict";
import { EntitySchema } from "typeorm";

const MuralSchema = new EntitySchema({
    name: "Mural",
    tableName: "mural",

    columns: {
        id: {
            type: "int",
            primary: true,
            generated: true,
        },
        titulo: {
            type: "varchar",
            length: 255,
            nullable: false,
        },
        createdAt: {
            type: "timestamp with time zone",
            default: () => "CURRENT_TIMESTAMP",
            nullable: false,
        },
        updatedAt: {
            type: "timestamp with time zone",
            default: () => "CURRENT_TIMESTAMP",
            onUpdate: "CURRENT_TIMESTAMP",
            nullable: false,
        },
    },

    relations: {
        idUser: {
            target: "users",  
            type: "many-to-one",
            joinColumn: { name: "idUser", referencedColumnName: "id" },
            onDelete: "CASCADE",
        },

        notes: {
            target: "StickNotes",   
            type: "one-to-many",
            inverseSide: "mural",  
        },
    },

    indices: [
        {
            name: "IDX_MURAL",
            columns: ["id"],
            unique: true,
        },
    ],
});

export default MuralSchema;