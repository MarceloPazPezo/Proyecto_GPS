"use strict";
import { EntitySchema } from "typeorm";

const CarreraSchema = new EntitySchema({
  name: "Carrera",
  tableName: "carreras",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    nombre: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    codigo: {
      type: "varchar",
      length: 50,
      nullable: false,
      unique: true,
    },
    descripcion: {
      type: "text",
      nullable: true,
    },
    departamento: {
      type: "varchar",
      length: 100,
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
    idEncargado: {
      type: "int",
      nullable: false,
    },
  },
  indices: [
    {
      name: "IDX_CARRERA",
      columns: ["id"],
      unique: true,
    },
    {
      name: "IDX_CARRERA_CODIGO",
      columns: ["codigo"],
      unique: true,
    },
    {
      name: "IDX_CARRERA_NOMBRE",
      columns: ["nombre"],
      unique: false,
    },
  ],
  relations: {
    usuarios: {
      type: "one-to-many",
      target: "User",
      inverseSide: "carrera",
    },
    idEncargado: {
      type: "many-to-one",
      target: "User",
      joinColumn: {
        name: "idEncargado",
        referencedColumnName: "id",
      },
      nullable: false,
    },
  },
});

export default CarreraSchema;
