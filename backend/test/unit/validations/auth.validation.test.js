import { describe, it, expect } from "vitest";
import { authValidation } from "../../../src/validations/auth.validation.js";

// T: Lista de pruebas unitarias sugeridas para la validación de Autenticación (authValidation)
// ===============================================================================
// Validación de Login (authValidation) - SECCIÓN 1
// ===============================================================================
// --- Lógica Principal ---
// 1.1.1 Debe pasar si se proporcionan un 'email' y 'password' válidos
// 1.1.2 Debería fallar si se incluyen campos adicionales (ej: 'rememberMe')
// 1.1.3 Debería fallar si falta el campo 'email'
// 1.1.4 Debería fallar si falta el campo 'password'

// --- Validación por Campo: email ---
// 1.2.1 Debería fallar si el email es muy corto (menos de 15 caracteres)
// 1.2.2 Debería fallar si el email es muy largo (más de 35 caracteres)
// 1.2.3 Debería fallar si el email tiene un dominio no permitido
// 1.2.4 Debería fallar si el email es un campo requerido (campo ausente)
// 1.2.5 Debería fallar si el email es un string vacío

// --- Validación por Campo: password ---
// 1.3.1 Debería fallar si la contraseña es muy corta (menos de 8 caracteres)
// 1.3.2 Debería fallar si la contraseña es muy larga (más de 26 caracteres)
// 1.3.3 Debería fallar si la contraseña tiene caracteres no permitidos (ej: '-')
// 1.3.4 Debería fallar si la contraseña es un campo requerido (campo ausente)
// 1.3.5 Debería fallar si la contraseña es un string vacío

const createValidAuthData = (overrides = {}) => {
  const baseData = {
    email: "usuario.valido@alumnos.ubiobio.cl",
    password: "passwordValido123",
  };
  const finalData = { ...baseData, ...overrides };
  for (const key in overrides) {
    if (overrides[key] === undefined) {
      delete finalData[key];
    }
  }
  return finalData;
};

describe("Validación de Login (authValidation)", () => {
  describe("Lógica Principal del Esquema", () => {
    it("1.1.1 Debe pasar si se proporcionan un 'email' y 'password' válidos", () => {
      const { error } = authValidation.validate(createValidAuthData());
      expect(error).toBeUndefined();
    });

    it("1.1.2 Debería fallar si se incluyen campos adicionales (ej: 'rememberMe')", () => {
      const { error } = authValidation.validate(
        createValidAuthData({ rememberMe: true }),
      );
      expect(error).toBeDefined();
      expect(error.message).toMatch(/No se permiten propiedades adicionales/);
    });

    it("1.1.3 Debería fallar si falta el campo 'email'", () => {
      const { error } = authValidation.validate(
        createValidAuthData({ email: undefined }),
      );
      expect(error).toBeDefined();
      expect(error.message).toMatch(/El correo electrónico es obligatorio/);
    });

    it("1.1.4 Debería fallar si falta el campo 'password'", () => {
      const { error } = authValidation.validate(
        createValidAuthData({ password: undefined }),
      );
      expect(error).toBeDefined();
      expect(error.message).toMatch(/La contraseña es obligatoria/);
    });
  });

  describe("Validación por Campo: email", () => {
    it("1.2.1 Debería fallar si el email es muy corto (menos de 15 caracteres)", () => {
      const { error } = authValidation.validate(createValidAuthData({ email: "a@b.cl" }));
      expect(error).toBeDefined();
      expect(error.message).toMatch(/al menos 15 caracteres/);
    });

    it("1.2.2 Debería fallar si el email es muy largo (más de 35 caracteres)", () => {
      const { error } = authValidation.validate(createValidAuthData({ email: "a".repeat(35) + "@alumnos.ubiobio.cl" }));
      expect(error).toBeDefined();
      expect(error.message).toMatch(/máximo 35 caracteres/);
    });

    it("1.2.3 Debería fallar si el email tiene un dominio no permitido", () => {
      const { error } = authValidation.validate(createValidAuthData({
        email: "usuario.valido@outlook.com",
      }));
      expect(error).toBeDefined();
      expect(error.message).toMatch(/dominio/);
    });

    it("1.2.4 Debería fallar si el email es un campo requerido (campo ausente)", () => {
      const { error } = authValidation.validate(createValidAuthData({ email: undefined }));
      expect(error).toBeDefined();
      expect(error.message).toMatch(/El correo electrónico es obligatorio/);
    });

    it("1.2.5 Debería fallar si el email es un string vacío", () => {
      const { error } = authValidation.validate(createValidAuthData({ email: "" }));
      expect(error).toBeDefined();
      expect(error.message).toMatch(
        /El correo electrónico no puede estar vacío/,
      );
    });
  });

  describe("Validación por Campo: password", () => {
    it("1.3.1 Debería fallar si la contraseña es muy corta (menos de 8 caracteres)", () => {
      const { error } = authValidation.validate(createValidAuthData({ password: "123" }));
      expect(error).toBeDefined();
      expect(error.message).toMatch(/al menos 8 caracteres/);
    });

    it("1.3.2 Debería fallar si la contraseña es muy larga (más de 26 caracteres)", () => {
      const { error } = authValidation.validate(createValidAuthData({ password: "a".repeat(27) }));
      expect(error).toBeDefined();
      expect(error.message).toMatch(/máximo 26 caracteres/);
    });

    it("1.3.3 Debería fallar si la contraseña tiene caracteres no permitidos (ej: '-')", () => {
      const { error } = authValidation.validate(createValidAuthData({ password: "password-con-guion" }));
      expect(error).toBeDefined();
      expect(error.message).toMatch(/solo puede contener letras y números/);
    });

    it("1.3.4 Debería fallar si la contraseña es un campo requerido (campo ausente)", () => {
      const { error } = authValidation.validate(createValidAuthData({ password: undefined }));
      expect(error).toBeDefined();
      expect(error.message).toMatch(/La contraseña es obligatoria/);
    });

    it("1.3.5 Debería fallar si la contraseña es un string vacío", () => {
      const { error } = authValidation.validate(createValidAuthData({ password: "" }));
      expect(error).toBeDefined();
      expect(error.message).toMatch(/La contraseña no puede estar vacía/);
    });
  });
});
