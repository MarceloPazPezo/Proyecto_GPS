import { describe, it, expect } from "vitest";
import {
  quizBodyValidation,
  quizQueryValidation,
  quizUserValidation,
} from "../../../src/validations/cuestionario.validation.js";

// T: Lista de pruebas unitarias sugeridas para la entidad Cuestionario y sus validaciones
// ===============================================================================
// Validación de Creación de Cuestionario (quizBodyValidation)
// ===============================================================================
// --- Lógica Principal ---
// 1.1.1 Debe pasar si se envían 'nombre' y 'idUser' válidos
// 1.1.2 Debería fallar si falta el campo 'nombre' (prueba de la regla .and())
// 1.1.3 Debería fallar si falta el campo 'idUser' (prueba de la regla .and())
// 1.1.4 Debería fallar si se incluyen campos adicionales
// --- Validación por Campo: nombre ---
// 1.2.1 Debería fallar si el nombre es muy corto (string vacío)
// 1.2.2 Debería fallar si el nombre es muy largo (más de 120 caracteres)
// 1.2.3 Debería fallar si el nombre contiene caracteres no permitidos
// --- Validación por Campo: idUser ---
// 1.3.1 Debería fallar si 'idUser' no es un número
// 1.3.2 Debería fallar si 'idUser' no es un entero
// 1.3.3 Debería fallar si 'idUser' no es un número positivo

// ===============================================================================
// Validación de Query de Búsqueda (quizQueryValidation)
// ===============================================================================
// --- Lógica Principal ---
// 2.1.1 Debe pasar si se proporciona solo un 'id' válido
// 2.1.2 Debe pasar si se proporcionan 'idUser' y 'nombre' válidos juntos
// 2.1.3 Debería fallar si se proporciona solo 'idUser' (prueba de la regla .and())
// 2.1.4 Debería fallar si se proporciona solo 'nombre' (prueba de la regla .and())
// 2.1.5 Debería fallar si no se proporciona ningún parámetro (objeto vacío)
// 2.1.6 Debería fallar si se proporciona un parámetro no permitido
// --- Validación por Campo ---
// 2.2.1 Debería fallar si el 'id' tiene un formato inválido (ej: no es entero positivo)
// 2.2.2 Debería fallar si 'idUser' tiene un formato inválido
// 2.2.3 Debería fallar si el 'nombre' tiene un formato inválido

// ===============================================================================
// Validación de Búsqueda por Usuario (quizUserValidation)
// ===============================================================================
// --- Lógica Principal ---
// 3.1.1 Debe pasar si se proporciona un 'idUser' válido
// 3.1.2 Debería fallar si el campo 'idUser' está ausente
// 3.1.3 Debería fallar si se proporcionan campos adicionales
// --- Validación por Campo ---
// 3.2.1 Debería fallar si 'idUser' no es un número entero positivo

const createValidQuizData = (overrides = {}) => {
  const baseData = {
    nombre: "Cuestionario de Matemáticas Básicas",
    idUser: 1,
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
  describe("Validación de Creación de Cuestionario (quizBodyValidation)", () => {
    describe("Lógica Principal del Esquema", () => {
      it("1.1.1 Debe pasar si se envían 'nombre' y 'idUser' válidos", () => {
        const { error } = quizBodyValidation.validate(createValidQuizData());
        expect(error).toBeUndefined();
      });

      it("1.1.2 Debería fallar si falta el campo 'nombre' (prueba de la regla .and())", () => {
        const { error } = quizBodyValidation.validate(
          createValidQuizData({ nombre: undefined }),
        );
        expect(error).toBeDefined();
        expect(error.message).toMatch(/Debes proporcionar idUser y nombre/);
      });

      it("1.1.3 Debería fallar si falta el campo 'idUser' (prueba de la regla .and())", () => {
        const { error } = quizBodyValidation.validate(
          createValidQuizData({ idUser: undefined }),
        );
        expect(error).toBeDefined();
        expect(error.message).toMatch(/Debes proporcionar idUser y nombre/);
      });

      it("1.1.4 Debería fallar si se incluyen campos adicionales", () => {
        const { error } = quizBodyValidation.validate(
          createValidQuizData({ tema: "Álgebra" }),
        );
        expect(error).toBeDefined();
        expect(error.message).toMatch(/No se permiten propiedades adicionales/);
      });
    });

    describe("Validación por Campo: nombre", () => {
      it("1.2.1 Debería fallar si el nombre es muy corto (string vacío)", () => {
        const { error } = quizBodyValidation.validate(
          createValidQuizData({ nombre: "" }),
        );
        expect(error).toBeDefined();
        expect(error.message).toMatch(/El nombre no puede estar vacío/);
      });

      it("1.2.2 Debería fallar si el nombre es muy largo (más de 120 caracteres)", () => {
        const { error } = quizBodyValidation.validate(
          createValidQuizData({ nombre: "a".repeat(121) }),
        );
        expect(error).toBeDefined();
        expect(error.message).toMatch(/máximo 120 caracteres/);
      });

      it("1.2.3 Debería fallar si el nombre contiene caracteres no permitidos", () => {
        const { error } = quizBodyValidation.validate(
          createValidQuizData({ nombre: "Cuestionario con-guiones*" }),
        );
        expect(error).toBeDefined();
        expect(error.message).toMatch(/solo puede contener letras y espacios/);
      });
    });

    describe("Validación por Campo: idUser", () => {
      it("1.3.1 Debería fallar si 'idUser' no es un número", () => {
        const { error } = quizBodyValidation.validate(
          createValidQuizData({ idUser: "uno" }),
        );
        expect(error).toBeDefined();
        expect(error.message).toMatch(/El id debe ser un número/);
      });

      it("1.3.2 Debería fallar si 'idUser' no es un entero", () => {
        const { error } = quizBodyValidation.validate(
          createValidQuizData({ idUser: 1.5 }),
        );
        expect(error).toBeDefined();
        expect(error.message).toMatch(/El id debe ser un número entero/);
      });

      it("1.3.3 Debería fallar si 'idUser' no es un número positivo", () => {
        const { error } = quizBodyValidation.validate(
          createValidQuizData({ idUser: -1 }),
        );
        expect(error).toBeDefined();
        expect(error.message).toMatch(/El id debe ser un número positivo/);
      });
    });
  });
  describe("Validación de Query de Búsqueda (quizQueryValidation)", () => {
    describe("Lógica Principal del Esquema", () => {
      it("2.1.1 Debe pasar si se proporciona solo un 'id' válido", () => {
        const query = { id: 123 };
        const { error } = quizQueryValidation.validate(query);
        expect(error).toBeUndefined();
      });

      it("2.1.2 Debe pasar si se proporcionan 'idUser' y 'nombre' válidos juntos", () => {
        const query = { idUser: 1, nombre: "Mi Cuestionario" };
        const { error } = quizQueryValidation.validate(query);
        expect(error).toBeUndefined();
      });

      it("2.1.3 Debería fallar si se proporciona solo 'idUser' (prueba de la regla .and())", () => {
        const query = { idUser: 1 };
        const { error } = quizQueryValidation.validate(query);
        expect(error).toBeDefined();
        expect(error.message).toMatch(
          /El nombre y el idUser deben proporcionarse juntos/,
        );
      });

      it("2.1.4 Debería fallar si se proporciona solo 'nombre' (prueba de la regla .and())", () => {
        const query = { nombre: "Mi Cuestionario" };
        const { error } = quizQueryValidation.validate(query);
        expect(error).toBeDefined();
        expect(error.message).toMatch(
          /El nombre y el idUser deben proporcionarse juntos/,
        );
      });

      it("2.1.5 Debería fallar si no se proporciona ningún parámetro (objeto vacío)", () => {
        const query = {};
        const { error } = quizQueryValidation.validate(query);
        expect(error).toBeDefined();
        expect(error.message).toMatch(
          /Debes proporcionar idUser y nombre o id del cuestionario/,
        );
      });

      it("2.1.6 Debería fallar si se proporciona un parámetro no permitido", () => {
        const query = { id: 1, autor: "Juan" };
        const { error } = quizQueryValidation.validate(query);
        expect(error).toBeDefined();
        expect(error.message).toMatch(/No se permiten propiedades adicionales/);
      });
    });

    describe("Validación por Campo", () => {
      it("2.2.1 Debería fallar si el 'id' tiene un formato inválido", () => {
        const query = { id: "un-id-invalido" };
        const { error } = quizQueryValidation.validate(query);
        expect(error).toBeDefined();
        expect(error.message).toMatch(/La id debe ser un numero/);
      });

      it("2.2.2 Debería fallar si 'idUser' tiene un formato inválido", () => {
        const query = { idUser: -5, nombre: "Cuestionario" };
        const { error } = quizQueryValidation.validate(query);
        expect(error).toBeDefined();
        expect(error.message).toMatch(/La id debe ser positivo/);
      });

      it("2.2.3 Debería fallar si el 'nombre' tiene un formato inválido", () => {
        const query = { idUser: 1, nombre: "" };
        const { error } = quizQueryValidation.validate(query);
        expect(error).toBeDefined();
        expect(error.message).toMatch(/El nombre no puede estar vacío/);
      });
    });
  });

  describe("Validación de Búsqueda por Usuario (quizUserValidation)", () => {
    describe("Lógica Principal del Esquema", () => {
      it("3.1.1 Debe pasar si se proporciona un 'idUser' válido", () => {
        const params = { idUser: 1 };
        const { error } = quizUserValidation.validate(params);
        expect(error).toBeUndefined();
      });

      it("3.1.2 Debería fallar si el campo 'idUser' está ausente", () => {
        const params = {};
        const { error } = quizUserValidation.validate(params);
        expect(error).toBeDefined();
        expect(error.message).toMatch(/El idUser es un parámetro requerido/);
      });

      it("3.1.3 Debería fallar si se proporcionan campos adicionales", () => {
        const params = { idUser: 1, nombre: "extra" };
        const { error } = quizUserValidation.validate(params);
        expect(error).toBeDefined();
        expect(error.message).toMatch(/No se permiten propiedades adicionales/);
      });
    });

    describe("Validación por Campo", () => {
      it("3.2.1 Debería fallar si 'idUser' no es un número entero positivo", () => {
        const paramsInvalidString = { idUser: "uno" };
        const paramsInvalidFloat = { idUser: 1.5 };
        const paramsInvalidNegative = { idUser: -1 };
        const { error: errorString } =
          quizUserValidation.validate(paramsInvalidString);
        const { error: errorFloat } =
          quizUserValidation.validate(paramsInvalidFloat);
        const { error: errorNegative } = quizUserValidation.validate(
          paramsInvalidNegative,
        );
        expect(errorString).toBeDefined();
        expect(errorString.message).toMatch(/La id debe ser un numero/);
        expect(errorFloat).toBeDefined();
        expect(errorFloat.message).toMatch(/La id debe ser un entero/);
        expect(errorNegative).toBeDefined();
        expect(errorNegative.message).toMatch(/La id debe ser positivo/);
      });
    });
  });
});