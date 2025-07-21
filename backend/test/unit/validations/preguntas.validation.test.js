import { describe, it, expect } from "vitest";
import {
  questionBodyValidation,
  questionQueryValidation,
} from "../../../src/validations/preguntas.validation.js";

// T: Lista de pruebas unitarias sugeridas para la entidad Preguntas y sus validaciones
// ===============================================================================
// Validación de Creación de Pregunta (questionBodyValidation)
// ===============================================================================
// --- Lógica Principal ---
// 1.1.1 Debe pasar si se envían 'texto' y 'idCuestionario' válidos
// 1.1.2 Debería fallar si falta el campo 'texto' (prueba de la regla .and())
// 1.1.3 Debería fallar si falta el campo 'idCuestionario' (prueba de la regla .and())
// 1.1.4 Debería fallar si se incluyen campos adicionales no permitidos
// --- Validación por Campo: texto ---
// 1.2.1 Debería fallar si el texto es un string vacío
// 1.2.2 Debería fallar si el texto es muy largo (más de 500 caracteres)
// --- Validación por Campo: idCuestionario ---
// 1.3.1 Debería fallar si 'idCuestionario' no es un número
// 1.3.2 Debería fallar si 'idCuestionario' no es un entero
// 1.3.3 Debería fallar si 'idCuestionario' no es un número positivo

// ===============================================================================
// Validación de Query de Búsqueda (questionQueryValidation)
// ===============================================================================
// --- Lógica Principal ---
// 2.1.1 Debe pasar si se proporciona solo un 'id' válido
// 2.1.2 Debe pasar si se proporciona solo un 'idCuestionario' válido
// 2.1.3 Debería fallar si se proporcionan 'id' y 'idCuestionario' juntos (prueba de la regla .xor())
// 2.1.4 Debería fallar si no se proporciona ningún parámetro de búsqueda (prueba de la regla .xor())
// 2.1.5 Debería fallar si se proporciona un parámetro no permitido
// --- Validación por Campo ---
// 2.2.1 Debería fallar si el 'id' tiene un formato inválido (ej: no es entero positivo)
// 2.2.2 Debería fallar si 'idCuestionario' tiene un formato inválido (ej: no es entero positivo)

const createValidQuestionData = (overrides = {}) => {
  const baseData = {
    texto: "¿Cuál es la capital de Chile?",
    idCuestionario: 1,
  };

  const finalData = { ...baseData, ...overrides };

  for (const key in overrides) {
    if (overrides[key] === undefined) {
      delete finalData[key];
    }
  }

  return finalData;
};
describe("Pruebas de la Entidad Pregunta con TypeORM", () => {
  describe("Validación de Creación de Pregunta (questionBodyValidation)", () => {
    describe("Lógica Principal del Esquema", () => {
      it("1.1.1 Debe pasar si se envían 'texto' y 'idCuestionario' válidos", () => {
        const { error } = questionBodyValidation.validate(
          createValidQuestionData(),
        );
        expect(error).toBeUndefined();
      });

      it("1.1.2 Debería fallar si falta el campo 'texto' (prueba de la regla .and())", () => {
        const { error } = questionBodyValidation.validate(
          createValidQuestionData({ texto: undefined }),
        );
        expect(error).toBeDefined();
        expect(error.message).toMatch(
          /Debes proporcionar texto e idCuestionario/,
        );
      });

      it("1.1.3 Debería fallar si falta el campo 'idCuestionario' (prueba de la regla .and())", () => {
        const { error } = questionBodyValidation.validate(
          createValidQuestionData({
            idCuestionario: undefined,
          }),
        );
        expect(error).toBeDefined();
        expect(error.message).toMatch(
          /Debes proporcionar texto e idCuestionario/,
        );
      });

      it("1.1.4 Debería fallar si se incluyen campos adicionales no permitidos", () => {
        const { error } = questionBodyValidation.validate(
          createValidQuestionData({ esOpcional: true }),
        );
        expect(error).toBeDefined();
        expect(error.message).toMatch(/No se permiten propiedades adicionales/);
      });
    });

    describe("Validación por Campo: texto", () => {
      it("1.2.1 Debería fallar si el texto es un string vacío", () => {
        const { error } = questionBodyValidation.validate(
          createValidQuestionData({ texto: "" }),
        );
        expect(error).toBeDefined();
        expect(error.message).toMatch(/El texto no puede estar vacío/);
      });

      it("1.2.2 Debería fallar si el texto es muy largo (más de 500 caracteres)", () => {
        const { error } = questionBodyValidation.validate(
          createValidQuestionData({
            texto: "a".repeat(501),
          }),
        );
        expect(error).toBeDefined();
        expect(error.message).toMatch(/máximo 500 caracteres/);
      });
    });

    describe("Validación por Campo: idCuestionario", () => {
      it("1.3.1 Debería fallar si 'idCuestionario' no es un número", () => {
        const { error } = questionBodyValidation.validate(
          createValidQuestionData({ idCuestionario: "dos" }),
        );
        expect(error).toBeDefined();
        expect(error.message).toMatch(/El idCuestionario debe ser un número/);
      });

      it("1.3.2 Debería fallar si 'idCuestionario' no es un entero", () => {
        const { error } = questionBodyValidation.validate(
          createValidQuestionData({ idCuestionario: 3.14 }),
        );
        expect(error).toBeDefined();
        expect(error.message).toMatch(
          /El idCuestionario debe ser un número entero/,
        );
      });

      it("1.3.3 Debería fallar si 'idCuestionario' no es un número positivo", () => {
        const { error } = questionBodyValidation.validate(
          createValidQuestionData({ idCuestionario: -10 }),
        );
        expect(error).toBeDefined();
        expect(error.message).toMatch(
          /El idCuestionario debe ser un número positivo/,
        );
      });
    });
  });

  describe("Validación de Query de Búsqueda (questionQueryValidation)", () => {
    describe("Lógica Principal del Esquema", () => {
      it("2.1.1 Debe pasar si se proporciona solo un 'id' válido", () => {
        const query = { id: 1 };
        const { error } = questionQueryValidation.validate(query);
        expect(error).toBeUndefined();
      });

      it("2.1.2 Debe pasar si se proporciona solo un 'idCuestionario' válido", () => {
        const query = { idCuestionario: 10 };
        const { error } = questionQueryValidation.validate(query);
        expect(error).toBeUndefined();
      });

      it("2.1.3 Debería fallar si se proporcionan 'id' y 'idCuestionario' juntos (prueba de la regla .xor())", () => {
        const query = { id: 1, idCuestionario: 10 };
        const { error } = questionQueryValidation.validate(query);
        expect(error).toBeDefined();
        expect(error.message).toMatch(
          /contains a conflict between exclusive peers/,
        );
      });

      it("2.1.4 Debería fallar si no se proporciona ningún parámetro de búsqueda (prueba de la regla .xor())", () => {
        const query = {};
        const { error } = questionQueryValidation.validate(query);
        expect(error).toBeDefined();
        expect(error.message).toMatch(/must contain at least one of/);
      });

      it("2.1.5 Debería fallar si se proporciona un parámetro no permitido", () => {
        const query = { id: 1, texto: "No permitido" };
        const { error } = questionQueryValidation.validate(query);
        expect(error).toBeDefined();
        expect(error.message).toMatch(/"texto" is not allowed/);
      });
    });

    describe("Validación por Campo", () => {
      it("2.2.1 Debería fallar si el 'id' tiene un formato inválido (ej: no es entero positivo)", () => {
        const query = { id: -5 };
        const { error } = questionQueryValidation.validate(query);
        expect(error).toBeDefined();
        expect(error.message).toMatch(/La id debe ser positivo/);
      });

      it("2.2.2 Debería fallar si 'idCuestionario' tiene un formato inválido (ej: no es entero positivo)", () => {
        const query = { idCuestionario: "abc" };
        const { error } = questionQueryValidation.validate(query);
        expect(error).toBeDefined();
        expect(error.message).toMatch(/La idCuestionario debe ser un numero/);
      });
    });
  });
});
