    "use strict";

    import { EntitySchema } from "typeorm";

    const StickyNotesSchema = new EntitySchema({
        name: "StickyNote",
        tableName: "StickNotes",
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
            descripcion: {
                type: "varchar",
                length: 255,
                nullable: false,
            },
            color: {
                type: "varchar",
                length: 255,
                nullable: false,
            },
            posx: {
                type: "int",
                nullable: false,
            },
            posy: {
                type: "int",
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
            mural: {
            target: "Mural",  
            type: "many-to-one",
            joinColumn: { name: "idMural", referencedColumnName: "id" },
            onDelete: "CASCADE",
        },
        },
        indices: [
        {
            name: "IDX_NOTE_ID",
            columns: ["id"],
            unique: true,
        },
    ],
    });

    export default StickyNotesSchema;