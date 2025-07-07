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
      type: "enum",
      enum: ["Ciencias", "Ingeniería", "Humanidades", "Ciencias Sociales"],
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
});

export default CarreraSchema;
