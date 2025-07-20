import { describe, it, expect } from "vitest";
import {
  carreraCreateValidation,
  carreraBodyValidation,
  carreraQueryValidation,
} from "../../../src/validations/carrera.validation.js";

// T: Lista de pruebas unitarias sugeridas para la entidad Carrera y sus validaciones
// ===============================================================================
// Validación de Creación de Carrera (carreraCreateValidation)
// ===============================================================================
// --- Lógica Principal ---
// 1.1.1 Debe pasar si se envían todos los campos requeridos válidos
// 1.1.2 Debería fallar si se incluyen campos adicionales no permitidos
// 1.1.3 Debería fallar si falta uno de los campos requeridos (ej: codigo)
// --- Validación por Campo: nombre ---
// 1.2.1 Debería fallar si el nombre es muy corto (menos de 5 caracteres)
// 1.2.2 Debería fallar si el nombre es muy largo (más de 100 caracteres)
// 1.2.3 Debería fallar si el nombre es un string vacío
// --- Validación por Campo: codigo ---
// 1.3.1 Debería fallar si el código es muy corto (menos de 2 caracteres)
// 1.3.2 Debería fallar si el código es muy largo (más de 10 caracteres)
// 1.3.3 Debería fallar si el código es un string vacío
// --- Validación por Campo: descripcion ---
// 1.4.1 Debería fallar si la descripción es muy corta (menos de 10 caracteres)
// 1.4.2 Debería fallar si la descripción es muy larga (más de 500 caracteres)
// --- Validación por Campo: departamento ---
// 1.5.1 Debería fallar si el departamento es muy corto (menos de 5 caracteres)
// 1.5.2 Debería fallar si el departamento es muy largo (más de 100 caracteres)
// 1.5.3 Debería fallar si el departamento es un string vacío
// --- Validación por Campo: idEncargado ---
// 1.6.1 Debería fallar si el idEncargado no es un número
// 1.6.2 Debería fallar si el idEncargado no es un entero
// 1.6.3 Debería fallar si el idEncargado no es un número positivo

// ===============================================================================
// Validación de Body de Actualización (carreraBodyValidation)
// ===============================================================================
// --- Lógica Principal ---
// 2.1.1 Debe pasar si se envía un único campo válido (ej: solo nombre)
// 2.1.2 Debe pasar si la descripción se envía como un string vacío o null (debido a .allow('', null))
// 2.1.3 Debería fallar si no se envía ningún campo (objeto vacío)
// 2.1.4 Debería fallar si se envían campos adicionales no permitidos
// --- Validación por Campo (Pruebas de Muestra) ---
// 2.2.1 Debería fallar si se envía un nombre demasiado corto
// 2.2.2 Debería fallar si se envía un código demasiado largo
// 2.2.3 Debería fallar si se envía una descripción demasiado corta
// 2.2.4 Debería fallar si se envía un departamento demasiado largo
// 2.2.5 Debería fallar si se envía un idEncargado con formato inválido (ej: negativo)

// ===============================================================================
// Validación de Query de Búsqueda (carreraQueryValidation)
// ===============================================================================
// --- Lógica Principal ---
// 3.1.1 Debe pasar si se proporciona solo un 'id' válido
// 3.1.2 Debe pasar si se proporciona solo un 'nombre' válido
// 3.1.3 Debe pasar si se proporciona solo un 'codigo' válido
// 3.1.4 Debe pasar si se proporciona solo un 'departamento' válido
// 3.1.5 Debería fallar si no se proporciona ningún parámetro de búsqueda (objeto vacío)
// 3.1.6 Debería fallar si se proporciona un parámetro no permitido
// --- Validación por Campo ---
// 3.2.1 Debería fallar si el 'id' no es un número entero positivo
// 3.2.2 Debería fallar si el 'nombre' es demasiado corto
// 3.2.3 Debería fallar si el 'codigo' es demasiado largo
// 3.2.4 Debería fallar si el 'departamento' es un string vacío

const createValidCarreraData = (overrides = {}) => {
  const baseData = {
    nombre: "Ingeniería Civil en Informática",
    codigo: "ICI-UBB",
    departamento: "Departamento de Sistemas de Información",
    idEncargado: 1,
  };
  const finalData = { ...baseData, ...overrides };
  for (const key in overrides) {
    if (overrides[key] === undefined) {
      delete finalData[key];
    }
  }

  return finalData;
};
describe("Pruebas de la Entidad Cuestionario con TypeORM", () => {
  describe("Validación de Creación de Carrera (carreraCreateValidation)", () => {
    describe("Lógica Principal del Esquema", () => {
      it("1.1.1 Debe pasar si se envían todos los campos requeridos válidos", () => {
        const { error } = carreraCreateValidation.validate(
          createValidCarreraData(),
        );
        expect(error).toBeUndefined();
      });

      it("1.1.2 Debería fallar si se incluyen campos adicionales no permitidos", () => {
        const { error } = carreraCreateValidation.validate(
          createValidCarreraData({ creditos: 300 }),
        );
        expect(error).toBeDefined();
        expect(error.message).toMatch(/No se permiten propiedades adicionales/);
      });

      it("1.1.3 Debería fallar si falta uno de los campos requeridos (ej: codigo)", () => {
        const { error } = carreraCreateValidation.validate(
          createValidCarreraData({ codigo: undefined }),
        );
        expect(error).toBeDefined();
        expect(error.message).toMatch(/El código es obligatorio/);
      });
    });

    describe("Validación por Campo: nombre", () => {
      it("1.2.1 Debería fallar si el nombre es muy corto (menos de 5 caracteres)", () => {
        const { error } = carreraCreateValidation.validate(
          createValidCarreraData({ nombre: "Ing." }),
        );
        expect(error).toBeDefined();
        expect(error.message).toMatch(/al menos 5 caracteres/);
      });

      it("1.2.2 Debería fallar si el nombre es muy largo (más de 100 caracteres)", () => {
        const { error } = carreraCreateValidation.validate(
          createValidCarreraData({ nombre: "a".repeat(101) }),
        );
        expect(error).toBeDefined();
        expect(error.message).toMatch(/máximo 100 caracteres/);
      });

      it("1.2.3 Debería fallar si el nombre es un string vacío", () => {
        const { error } = carreraCreateValidation.validate(
          createValidCarreraData({ nombre: "" }),
        );
        expect(error).toBeDefined();
        expect(error.message).toMatch(/El nombre no puede estar vacío/);
      });
    });

    describe("Validación por Campo: codigo", () => {
      it("1.3.1 Debería fallar si el código es muy corto (menos de 2 caracteres)", () => {
        const { error } = carreraCreateValidation.validate(
          createValidCarreraData({ codigo: "A" }),
        );
        expect(error).toBeDefined();
        expect(error.message).toMatch(/al menos 2 caracteres/);
      });

      it("1.3.2 Debería fallar si el código es muy largo (más de 10 caracteres)", () => {
        const { error } = carreraCreateValidation.validate(
          createValidCarreraData({ codigo: "CODIGO-MUY-LARGO" }),
        );
        expect(error).toBeDefined();
        expect(error.message).toMatch(/máximo 10 caracteres/);
      });

      it("1.3.3 Debería fallar si el código es un string vacío", () => {
        const { error } = carreraCreateValidation.validate(
          createValidCarreraData({ codigo: "" }),
        );
        expect(error).toBeDefined();
        expect(error.message).toMatch(/El código no puede estar vacío/);
      });
    });

    describe("Validación por Campo: descripcion", () => {
      it("1.4.1 Debería fallar si la descripción es muy corta (menos de 10 caracteres)", () => {
        const { error } = carreraCreateValidation.validate(
          createValidCarreraData({ descripcion: "corta" }),
        );
        expect(error).toBeDefined();
        expect(error.message).toMatch(/al menos 10 caracteres/);
      });

      it("1.4.2 Debería fallar si la descripción es muy larga (más de 500 caracteres)", () => {
        const { error } = carreraCreateValidation.validate(
          createValidCarreraData({ descripcion: "a".repeat(501) }),
        );
        expect(error).toBeDefined();
        expect(error.message).toMatch(/máximo 500 caracteres/);
      });
    });

    describe("Validación por Campo: departamento", () => {
      it("1.5.1 Debería fallar si el departamento es muy corto (menos de 5 caracteres)", () => {
        const { error } = carreraCreateValidation.validate(
          createValidCarreraData({ departamento: "DCC" }),
        );
        expect(error).toBeDefined();
        expect(error.message).toMatch(/al menos 5 caracteres/);
      });

      it("1.5.2 Debería fallar si el departamento es muy largo (más de 100 caracteres)", () => {
        const { error } = carreraCreateValidation.validate(
          createValidCarreraData({ departamento: "a".repeat(101) }),
        );
        expect(error).toBeDefined();
        expect(error.message).toMatch(/máximo 100 caracteres/);
      });

      it("1.5.3 Debería fallar si el departamento es un string vacío", () => {
        const { error } = carreraCreateValidation.validate(
          createValidCarreraData({ departamento: "" }),
        );
        expect(error).toBeDefined();
        expect(error.message).toMatch(/El departamento no puede estar vacío/);
      });
    });

    describe("Validación por Campo: idEncargado", () => {
      it("1.6.1 Debería fallar si el idEncargado no es un número", () => {
        const { error } = carreraCreateValidation.validate(
          createValidCarreraData({ idEncargado: "uno" }),
        );
        expect(error).toBeDefined();
        expect(error.message).toMatch(/id del encargado debe ser un número/);
      });

      it("1.6.2 Debería fallar si el idEncargado no es un entero", () => {
        const { error } = carreraCreateValidation.validate(
          createValidCarreraData({ idEncargado: 1.5 }),
        );
        expect(error).toBeDefined();
        expect(error.message).toMatch(
          /id del encargado debe ser un número entero/,
        );
      });

      it("1.6.3 Debería fallar si el idEncargado no es un número positivo", () => {
        const { error } = carreraCreateValidation.validate(
          createValidCarreraData({ idEncargado: -1 }),
        );
        expect(error).toBeDefined();
        expect(error.message).toMatch(
          /id del encargado debe ser un número positivo/,
        );
      });
    });
  });

  describe("Validación de Body de Actualización (carreraBodyValidation)", () => {
    describe("Lógica Principal del Esquema", () => {
      it("2.1.1 Debe pasar si se envía un único campo válido (ej: solo nombre)", () => {
        const body = {
          nombre: "Ingeniería de Ejecución en Computación e Informática",
        };
        const { error } = carreraBodyValidation.validate(body);
        expect(error).toBeUndefined();
      });

      it("2.1.2 Debe pasar si la descripción se envía como un string vacío o null (debido a .allow('', null))", () => {
        const bodyConStringVacio = { descripcion: "" };
        const bodyConNull = { descripcion: null };
        const { error: errorVacio } =
          carreraBodyValidation.validate(bodyConStringVacio);
        const { error: errorNull } =
          carreraBodyValidation.validate(bodyConNull);
        expect(errorVacio).toBeUndefined();
        expect(errorNull).toBeUndefined();
      });

      it("2.1.3 Debería fallar si no se envía ningún campo (objeto vacío)", () => {
        const body = {};
        const { error } = carreraBodyValidation.validate(body);
        expect(error).toBeDefined();
        expect(error.message).toMatch(
          /Debes proporcionar al menos un campo para actualizar/,
        );
      });

      it("2.1.4 Debería fallar si se envían campos adicionales no permitidos", () => {
        const body = { nombre: "Nueva Carrera", campus: "La Castilla" };
        const { error } = carreraBodyValidation.validate(body);
        expect(error).toBeDefined();
        expect(error.message).toMatch(/No se permiten propiedades adicionales/);
      });
    });

    describe("Validación por Campo (Pruebas de Muestra)", () => {
      it("2.2.1 Debería fallar si se envía un nombre demasiado corto", () => {
        const body = { nombre: "ABC" };
        const { error } = carreraBodyValidation.validate(body);
        expect(error).toBeDefined();
        expect(error.message).toMatch(/al menos 5 caracteres/);
      });

      it("2.2.2 Debería fallar si se envía un código demasiado largo", () => {
        const body = { codigo: "CODIGO-DEMASIADO-LARGO" };
        const { error } = carreraBodyValidation.validate(body);
        expect(error).toBeDefined();
        expect(error.message).toMatch(/máximo 10 caracteres/);
      });

      it("2.2.3 Debería fallar si se envía una descripción demasiado corta", () => {
        const body = { descripcion: "corta" };
        const { error } = carreraBodyValidation.validate(body);
        expect(error).toBeDefined();
        expect(error.message).toMatch(/al menos 10 caracteres/);
      });

      it("2.2.4 Debería fallar si se envía un departamento demasiado largo", () => {
        const body = { departamento: "a".repeat(101) };
        const { error } = carreraBodyValidation.validate(body);
        expect(error).toBeDefined();
        expect(error.message).toMatch(/máximo 100 caracteres/);
      });

      it("2.2.5 Debería fallar si se envía un idEncargado con formato inválido (ej: negativo)", () => {
        const body = { idEncargado: -10 };
        const { error } = carreraBodyValidation.validate(body);
        expect(error).toBeDefined();
        expect(error.message).toMatch(
          /id del encargado debe ser un número positivo/,
        );
      });
    });
  });

  describe("Validación de Query de Búsqueda (carreraQueryValidation)", () => {
    describe("Lógica Principal del Esquema", () => {
      it("3.1.1 Debe pasar si se proporciona solo un 'id' válido", () => {
        const query = { id: 1 };
        const { error } = carreraQueryValidation.validate(query);
        expect(error).toBeUndefined();
      });

      it("3.1.2 Debe pasar si se proporciona solo un 'nombre' válido", () => {
        const query = { nombre: "Ingeniería Civil" };
        const { error } = carreraQueryValidation.validate(query);
        expect(error).toBeUndefined();
      });

      it("3.1.3 Debe pasar si se proporciona solo un 'codigo' válido", () => {
        const query = { codigo: "ICI-UBB" };
        const { error } = carreraQueryValidation.validate(query);
        expect(error).toBeUndefined();
      });

      it("3.1.4 Debe pasar si se proporciona solo un 'departamento' válido", () => {
        const query = { departamento: "Sistemas de Información" };
        const { error } = carreraQueryValidation.validate(query);
        expect(error).toBeUndefined();
      });

      it("3.1.5 Debería fallar si no se proporciona ningún parámetro de búsqueda (objeto vacío)", () => {
        const query = {};
        const { error } = carreraQueryValidation.validate(query);
        expect(error).toBeDefined();
        expect(error.message).toMatch(
          /Debes proporcionar al menos un parámetro de búsqueda/,
        );
      });

      it("3.1.6 Debería fallar si se proporciona un parámetro no permitido", () => {
        const query = { id: 1, creditos: 300 };
        const { error } = carreraQueryValidation.validate(query);
        expect(error).toBeDefined();
        expect(error.message).toMatch(/No se permiten propiedades adicionales/);
      });
    });

    describe("Validación por Campo", () => {
      it("3.2.1 Debería fallar si el 'id' no es un número entero positivo", () => {
        const queryInvalida = { id: -5 };
        const { error } = carreraQueryValidation.validate(queryInvalida);
        expect(error).toBeDefined();
        expect(error.message).toMatch(/El id debe ser un número positivo/);
      });

      it("3.2.2 Debería fallar si el 'nombre' es demasiado corto", () => {
        const queryInvalida = { nombre: "a" };
        const { error } = carreraQueryValidation.validate(queryInvalida);
        expect(error).toBeDefined();
        expect(error.message).toMatch(/mínimo 3 caracteres/);
      });

      it("3.2.3 Debería fallar si el 'codigo' es demasiado largo", () => {
        const queryInvalida = { codigo: "CODIGO-EXCESIVAMENTE-LARGO" };
        const { error } = carreraQueryValidation.validate(queryInvalida);
        expect(error).toBeDefined();
        expect(error.message).toMatch(/máximo 10 caracteres/);
      });

      it("3.2.4 Debería fallar si el 'departamento' es un string vacío", () => {
        const queryInvalida = { departamento: "" };
        const { error } = carreraQueryValidation.validate(queryInvalida);
        expect(error).toBeDefined();
        expect(error.message).toMatch(/El departamento no puede estar vacío/);
      });
    });
  });
});
