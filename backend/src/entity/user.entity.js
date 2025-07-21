"use strict";
import { EntitySchema } from "typeorm";

const UserSchema = new EntitySchema({
  name: "User",
  tableName: "users",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    nombreCompleto: {
      type: "varchar",
      length: 50,
      nullable: false,
    },
    rut: {
      type: "varchar",
      length: 12,
      nullable: false,
      unique: true,
    },
    email: {
      type: "varchar",
      length: 255,
      nullable: false,
      unique: true,
    },
    rol: {
      type: "enum",
      enum: ["administrador", "encargado_carrera", "tutor", "tutorado", "usuario"],
      default: "usuario",
      nullable: false,
    },
    password: {
      type: "varchar",
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
    idCarrera: {
      type: "int",
      nullable: true, // Un usuario puede no tener carrera asignada
    },
  },
  relations: {
    idCarrera: {
      type: "many-to-one",
      target: "Carrera",
      joinColumn: {
        name: "idCarrera",
        referencedColumnName: "id",
      },
      nullable: true, // Un usuario puede no tener carrera asignada
    },
    carrerasEncargado: {
      type: "one-to-many",
      target: "Carrera",
      inverseSide: "idEncargado",
      nullable: true // Un usuario puede no ser encargado de ninguna carrera
    }
  },
  indices: [
    {
      name: "IDX_USER",
      columns: ["id"],
      unique: true,
    },
    {
      name: "IDX_USER_RUT",
      columns: ["rut"],
      unique: true,
    },
    {
      name: "IDX_USER_EMAIL",
      columns: ["email"],
      unique: true,
    },
  ],
});

export default UserSchema;