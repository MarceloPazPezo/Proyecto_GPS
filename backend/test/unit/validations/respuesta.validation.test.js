import { describe, it, expect } from "vitest";
import {
  respuestaBodyValidation,
  respuestaQueryValidation,
  LoteBodyValidation,
} from "../../../src/validations/respuestas.validation.js";

// T: Lista de pruebas unitarias sugeridas para la entidad Respuesta y sus validaciones
// ===============================================================================
// Validación de Creación de Respuesta (respuestaBodyValidation)
// ===============================================================================
// --- Lógica Principal ---
// 1.1.1 Debe pasar si se envían 'textoRespuesta', 'idPreguntas' y 'correcta' válidos
// 1.1.2 Debería fallar si falta el campo 'textoRespuesta' (prueba de la regla .and())
// 1.1.3 Debería fallar si falta el campo 'idPreguntas' (prueba de la regla .and())
// 1.1.4 Debería fallar si falta el campo 'correcta' (prueba de la regla .and())
// 1.1.5 Debería fallar si se incluyen campos adicionales no permitidos
// --- Validación por Campo: textoRespuesta ---
// 1.2.1 Debería fallar si el texto de la respuesta es un string vacío
// 1.2.2 Debería fallar si el texto de la respuesta es muy largo (más de 120 caracteres)
// --- Validación por Campo: idPreguntas ---
// 1.3.1 Debería fallar si 'idPreguntas' no es un número
// 1.3.2 Debería fallar si 'idPreguntas' no es un entero
// 1.3.3 Debería fallar si 'idPreguntas' no es un número positivo
// --- Validación por Campo: correcta ---
// 1.4.1 Debería fallar si 'correcta' no es un booleano (ej: un string "true")

// ===============================================================================
// Validación de Query de Búsqueda (respuestaQueryValidation)
// ===============================================================================
// --- Lógica Principal ---
// 2.1.1 Debe pasar si se proporciona solo un 'id' válido
// 2.1.2 Debe pasar si se proporciona solo un 'idPreguntas' válido
// 2.1.3 Debería fallar si se proporcionan 'id' y 'idPreguntas' juntos (prueba de la regla .xor())
// 2.1.4 Debería fallar si no se proporciona ningún parámetro de búsqueda (prueba de la regla .xor())
// 2.1.5 Debería fallar si se proporciona un parámetro no permitido
// --- Validación por Campo ---
// 2.2.1 Debería fallar si el 'id' tiene un formato inválido (ej: no es entero positivo)
// 2.2.2 Debería fallar si 'idPreguntas' tiene un formato inválido (ej: no es entero positivo)

// ===============================================================================
// Validación de Body de Lote de Respuestas (LoteBodyValidation)
// ===============================================================================
// --- Lógica Principal ---
// 3.1.1 Debe pasar si se envían 'textoRespuesta' y 'correcta' (sin 'idPreguntas')
// 3.1.2 Debe pasar si se envían 'textoRespuesta', 'correcta' y 'idPreguntas' válidos
// 3.1.3 Debería fallar si falta el campo 'textoRespuesta' (prueba de la regla .and())
// 3.1.4 Debería fallar si falta el campo 'correcta' (prueba de la regla .and())
// 3.1.5 Debería fallar si se proporcionan campos adicionales
// --- Validación por Campo ---
// 3.2.1 Debería fallar si 'textoRespuesta' tiene un formato inválido
// 3.2.2 Debería fallar si 'idPreguntas' (si se proporciona) tiene un formato inválido

const createValidRespuestaData = (overrides = {}) => {
  const baseData = {
    textoRespuesta: "Esta es una respuesta válida.",
    idPreguntas: 1,
    correcta: false,
  };

  const finalData = { ...baseData, ...overrides };

  for (const key in overrides) {
    if (overrides[key] === undefined) {
      delete finalData[key];
    }
  }

  return finalData;
};
describe("Pruebas de la Entidad Respuesta con TypeORM", () => {
  describe("Validación de Creación de Respuesta (respuestaBodyValidation)", () => {
    describe("Lógica Principal del Esquema", () => {
      it("1.1.1 Debe pasar si se envían 'textoRespuesta', 'idPreguntas' y 'correcta' válidos", () => {
        const { error } = respuestaBodyValidation.validate(
          createValidRespuestaData(),
        );
        expect(error).toBeUndefined();
      });

      it("1.1.2 Debería fallar si falta el campo 'textoRespuesta' (prueba de la regla .and())", () => {
        const { error } = respuestaBodyValidation.validate(
          createValidRespuestaData({
            textoRespuesta: undefined,
          }),
        );
        expect(error).toBeDefined();
        expect(error.message).toMatch(
          /Debes proporcionar textoRespuesta, idPreguntas y correcta/,
        );
      });

      it("1.1.3 Debería fallar si falta el campo 'idPreguntas' (prueba de la regla .and())", () => {
        const { error } = respuestaBodyValidation.validate(
          createValidRespuestaData({
            idPreguntas: undefined,
          }),
        );
        expect(error).toBeDefined();
        expect(error.message).toMatch(
          /Debes proporcionar textoRespuesta, idPreguntas y correcta/,
        );
      });

      it("1.1.4 Debería fallar si falta el campo 'correcta' (prueba de la regla .and())", () => {
        const { error } = respuestaBodyValidation.validate(
          createValidRespuestaData({ correcta: undefined }),
        );
        expect(error).toBeDefined();
        expect(error.message).toMatch(
          /Debes proporcionar textoRespuesta, idPreguntas y correcta/,
        );
      });

      it("1.1.5 Debería fallar si se incluyen campos adicionales no permitidos", () => {
        const { error } = respuestaBodyValidation.validate(
          createValidRespuestaData({ autor: "Anónimo" }),
        );
        expect(error).toBeDefined();
        expect(error.message).toMatch(/No se permiten propiedades adicionales/);
      });
    });

    describe("Validación por Campo: textoRespuesta", () => {
      it("1.2.1 Debería fallar si el texto de la respuesta es un string vacío", () => {
        const { error } = respuestaBodyValidation.validate(
          createValidRespuestaData({ textoRespuesta: "" }),
        );
        expect(error).toBeDefined();
        expect(error.message).toMatch(
          /El texto de la respuesta no puede estar vacío/,
        );
      });

      it("1.2.2 Debería fallar si el texto de la respuesta es muy largo (más de 120 caracteres)", () => {
        const { error } = respuestaBodyValidation.validate(
          createValidRespuestaData({
            textoRespuesta: "a".repeat(121),
          }),
        );
        expect(error).toBeDefined();
        expect(error.message).toMatch(/máximo 120 caracteres/);
      });
    });

    describe("Validación por Campo: idPreguntas", () => {
      it("1.3.1 Debería fallar si 'idPreguntas' no es un número", () => {
        const { error } = respuestaBodyValidation.validate(
          createValidRespuestaData({ idPreguntas: "uno" }),
        );
        expect(error).toBeDefined();
        expect(error.message).toMatch(
          /El id de la pregunta debe ser un número/,
        );
      });

      it("1.3.2 Debería fallar si 'idPreguntas' no es un entero", () => {
        const { error } = respuestaBodyValidation.validate(
          createValidRespuestaData({ idPreguntas: 1.5 }),
        );
        expect(error).toBeDefined();
        expect(error.message).toMatch(
          /El id de la pregunta debe ser un número entero/,
        );
      });

      it("1.3.3 Debería fallar si 'idPreguntas' no es un número positivo", () => {
        const { error } = respuestaBodyValidation.validate(
          createValidRespuestaData({ idPreguntas: -1 }),
        );
        expect(error).toBeDefined();
        expect(error.message).toMatch(
          /El id de la pregunta debe ser un número positivo/,
        );
      });
    });

    describe("Validación por Campo: correcta", () => {
      it("1.4.1 Debería fallar si 'correcta' no es un booleano (ej: un string 'true')", () => {
        const { error } = respuestaBodyValidation.validate(
          createValidRespuestaData({ correcta: "true" }),
        );
        expect(error).toBeDefined();
        expect(error.message).toMatch(
          /El campo 'correcta' debe ser un booleano/,
        );
      });
    });
  });

  describe("Validación de Query de Búsqueda (respuestaQueryValidation)", () => {
    describe("Lógica Principal del Esquema", () => {
      it("2.1.1 Debe pasar si se proporciona solo un 'id' válido", () => {
        const query = { id: 1 };
        const { error } = respuestaQueryValidation.validate(query);
        expect(error).toBeUndefined();
      });

      it("2.1.2 Debe pasar si se proporciona solo un 'idPreguntas' válido", () => {
        const query = { idPreguntas: 10 };
        const { error } = respuestaQueryValidation.validate(query);
        expect(error).toBeUndefined();
      });

      it("2.1.3 Debería fallar si se proporcionan 'id' y 'idPreguntas' juntos (prueba de la regla .xor())", () => {
        const query = { id: 1, idPreguntas: 10 };
        const { error } = respuestaQueryValidation.validate(query);
        expect(error).toBeDefined();
        expect(error.message).toMatch(
          /No puedes proporcionar 'id' y 'idPreguntas' al mismo tiempo/,
        );
      });

      it("2.1.4 Debería fallar si no se proporciona ningún parámetro de búsqueda (prueba de la regla .xor())", () => {
        const query = {};
        const { error } = respuestaQueryValidation.validate(query);
        expect(error).toBeDefined();
        expect(error.message).toMatch(/Debes proporcionar un 'id' o un 'idPreguntas'/);
      });

      it("2.1.5 Debería fallar si se proporciona un parámetro no permitido", () => {
        const query = { id: 1, textoRespuesta: "No permitido" };
        const { error } = respuestaQueryValidation.validate(query);
        expect(error).toBeDefined();
        expect(error.message).toMatch(/No se permiten propiedades adicionales/);
      });
    });
    describe("Validación por Campo", () => {
      it("2.2.1 Debería fallar si el 'id' tiene un formato inválido (ej: no es entero positivo)", () => {
        const query = { id: -5 };
        const { error } = respuestaQueryValidation.validate(query);
        expect(error).toBeDefined();
        expect(error.message).toMatch(/La id debe ser positivo/);
      });

      it("2.2.2 Debería fallar si 'idPreguntas' tiene un formato inválido (ej: no es entero positivo)", () => {
        const query = { idPreguntas: "abc" };
        const { error } = respuestaQueryValidation.validate(query);
        expect(error).toBeDefined();
        expect(error.message).toMatch(
          /La id de la pregunta debe ser un numero/,
        );
      });
    });
  });

  describe("Validación de Body de Lote de Respuestas (LoteBodyValidation)", () => {
    const createValidLoteData = (overrides = {}) => {
      const baseData = {
        textoRespuesta: "Respuesta para un lote.",
        correcta: true,
        idPreguntas: 1,
      };
      const finalData = { ...baseData, ...overrides };
      for (const key in overrides) {
        if (overrides[key] === undefined) {
          delete finalData[key];
        }
      }
      return finalData;
    };

    describe("Lógica Principal del Esquema", () => {
      it("3.1.1 Debe pasar si se envían 'textoRespuesta' y 'correcta' (sin 'idPreguntas')", () => {
        const { error } = LoteBodyValidation.validate(createValidLoteData({ idPreguntas: undefined }));
        expect(error).toBeUndefined();
      });

      it("3.1.2 Debe pasar si se envían 'textoRespuesta', 'correcta' y 'idPreguntas' válidos", () => {
        const { error } = LoteBodyValidation.validate(createValidLoteData());
        expect(error).toBeUndefined();
      });

      it("3.1.3 Debería fallar si falta el campo 'textoRespuesta' (prueba de la regla .and())", () => {
        const { error } = LoteBodyValidation.validate(createValidLoteData({ textoRespuesta: undefined }));
        expect(error).toBeDefined();
        expect(error.message).toMatch(
          /Debes proporcionar textoRespuesta y correcta/,
        );
      });

      it("3.1.4 Debería fallar si falta el campo 'correcta' (prueba de la regla .and())", () => {
        const { error } = LoteBodyValidation.validate(createValidLoteData({ correcta: undefined }));
        expect(error).toBeDefined();
        expect(error.message).toMatch(
          /Debes proporcionar textoRespuesta y correcta/,
        );
      });

      it("3.1.5 Debería fallar si se proporcionan campos adicionales", () => {
        const { error } = LoteBodyValidation.validate(createValidLoteData({ esBorrador: false }));
        expect(error).toBeDefined();
        expect(error.message).toMatch(/No se permiten propiedades adicionales/);
      });
    });

    describe("Validación por Campo", () => {
      it("3.2.1 Debería fallar si 'textoRespuesta' tiene un formato inválido", () => {
        const { error } = LoteBodyValidation.validate(createValidLoteData({ textoRespuesta: "" }));
        expect(error).toBeDefined();
        expect(error.message).toMatch(
          /El texto de la respuesta no puede estar vacío/,
        );
      });

      it("3.2.2 Debería fallar si 'idPreguntas' (si se proporciona) tiene un formato inválido", () => {
        const { error } = LoteBodyValidation.validate(createValidLoteData({ idPreguntas: -50 }));
        expect(error).toBeDefined();
        expect(error.message).toMatch(
          /El id de la pregunta debe ser un número positivo/,
        );
      });
    });
  });
});
