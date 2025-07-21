import { describe, it, expect } from "vitest";
import {
  userCreateValidation,
  userBodyValidation,
  userQueryValidation,
} from "../../../src/validations/user.validation.js";

// T: Lista de pruebas unitarias sugeridas para la entidad User y validaciones Joi
// ===============================================================================
// Validación de Creación de Usuario (userCreateValidation)
// ===============================================================================
// --- Lógica Principal ---
// 1.1.1 Debería pasar si se envían todos los campos válidos
// 1.1.2 Debería fallar si se incluyen campos adicionales
// --- Validación por Campo: nombre ---
// 1.2.1 Debería fallar si el nombre es muy corto
// 1.2.2 Debería fallar si el nombre es muy largo
// 1.2.3 Debería fallar si el nombre contiene números
// 1.2.4 Debería fallar si el nombre es requerido
// 1.2.5 Debería fallar si el nombre está vacío
// --- Validación por Campo: rut ---
// 1.3.1 Debería fallar si el RUT es muy corto
// 1.3.2 Debería fallar si el RUT es muy largo
// 1.3.3 Debería fallar si el RUT no tiene guion
// 1.3.4 Debería fallar si el RUT es requerido (campo ausente)
// 1.3.5 Debería fallar si el RUT es un string vacío
// --- Validación por Campo: email ---
// 1.4.1 Debería fallar si el email es muy corto
// 1.4.2 Debería fallar si el email es muy largo
// 1.4.3 Debería fallar si el email tiene un dominio no permitido
// 1.4.4 Debería fallar si el email es requerido (campo ausente)
// 1.4.5 Debería fallar si el email es un string vacío
// --- Validación por Campo: password ---
// 1.5.1 Debería fallar si la contraseña es muy corta
// 1.5.2 Debería fallar si la contraseña es muy larga
// 1.5.3 Debería fallar si la contraseña tiene caracteres especiales
// 1.5.4 Debería fallar si la contraseña es requerida (campo requerido)
// 1.5.5 Debería fallar si la contraseña es inválida (campo vacío)
// --- Validación por Campo: rol ---
// 1.6.1 Debería fallar si el rol no es válido
// 1.6.2 Debería fallar si el rol no es un string

// ===============================================================================
// Validación de Body de Actualización (userBodyValidation)
// ===============================================================================
// --- Lógica Principal ---
// 2.1.1 Debe pasar si se envía un único campo válido (ej: solo nombreCompleto)
// 2.1.2 Debe pasar si se envía el campo 'newPassword' válido
// 2.1.3 Debe pasar si el campo 'newPassword' es un string vacío (debido a .allow(''))
// 2.1.4 Debería fallar si no se envía ningún campo (objeto vacío)
// 2.1.5 Debería fallar si se envían campos adicionales no permitidos

// --- Validación por Campo (Pruebas de Muestra para Confirmar la Activación de Reglas) ---
// 2.2.1 Debería fallar si se envía un nombreCompleto demasiado corto
// 2.2.2 Debería fallar si se envía un email con un dominio inválido
// 2.2.3 Debería fallar si se envía una password con caracteres no permitidos
// 2.2.4 Debería fallar si se envía un rut con formato inválido (sin guion)
// 2.2.5 Debería fallar si se envía un rol que no está en la lista de permitidos

// ===============================================================================
// Validación de Query de Búsqueda (userQueryValidation)
// ===============================================================================
// --- Lógica Principal ---
// 3.1.1 Debería pasar si se proporciona solo un ID válido
// 3.1.2 Debería pasar si se proporciona solo un email válido
// 3.1.3 Debería pasar si se proporciona solo un RUT válido
// 3.1.4 Debería fallar si no se proporciona ningún parámetro de búsqueda (objeto vacío)
// 3.1.5 Debería fallar si se proporciona un parámetro no permitido (ej: nombreCompleto)
// --- Validación por Campo (opcional) ---
// 3.2.1 Debería fallar si el ID no es un número entero positivo
// 3.2.2 Debería fallar si el email tiene un formato inválido
// 3.2.3 Debería fallar si el RUT tiene un formato inválido

const createValidUserData = (overrides = {}) => {
  const baseData = {
    nombreCompleto: "Nombre De Usuario Valido Para Pruebas",
    rut: "12345678-9",
    email: "usuario.valido@ubiobio.cl",
    rol: "usuario",
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

describe("Pruebas de la Entidad User con TypeORM", () => {
  describe("Validación de Creación de Usuario (userCreateValidation)", () => {
    describe("Lógica Principal del Esquema", () => {
      it("1.1.1 Debería pasar si se envían todos los campos válidos", () => {
        const { error } = userCreateValidation.validate(createValidUserData());
        expect(error).toBeUndefined();
      });

      it("1.1.2 Debería fallar si se incluyen campos adicionales", () => {
        const { error } = userCreateValidation.validate(
          createValidUserData({ campoExtra: "no permitido" }),
        );
        expect(error).toBeDefined();
        expect(error.message).toMatch(/No se permiten propiedades adicionales/);
      });
    });
    describe("Validación por Campo", () => {
      it("1.2.1 Debería fallar si el nombre es muy corto", () => {
        const { error } = userCreateValidation.validate(
          createValidUserData({ nombreCompleto: "Corto" }),
        );
        expect(error).toBeDefined();
        expect(error.message).toMatch(/al menos 15 caracteres/);
      });

      it("1.2.2 Debería fallar si el nombre es muy largo", () => {
        const { error } = userCreateValidation.validate(
          createValidUserData({ nombreCompleto: "a".repeat(51) }),
        );
        expect(error).toBeDefined();
        expect(error.message).toMatch(/máximo 50 caracteres/);
      });

      it("1.2.3 Debería fallar si el nombre contiene números", () => {
        const { error } = userCreateValidation.validate(
          createValidUserData({ nombreCompleto: "Nombre Con Numeros 123" }),
        );
        expect(error).toBeDefined();
        expect(error.message).toMatch(/solo puede contener letras y espacios/);
      });

      it("1.2.4 Debería fallar si el nombre es requerido", () => {
        const { error } = userCreateValidation.validate(
          createValidUserData({ nombreCompleto: undefined }),
        );
        expect(error).toBeDefined();
        expect(error.message).toMatch(/El nombre completo es obligatorio/);
      });

      it("1.2.5 Debería fallar si el nombre está vacío", () => {
        const { error } = userCreateValidation.validate(
          createValidUserData({ nombreCompleto: "" }),
        );
        expect(error).toBeDefined();
        expect(error.message).toMatch(
          /El nombre completo no puede estar vacío/,
        );
      });

      it("1.3.1 Debería fallar si el RUT es muy corto", () => {
        const { error } = userCreateValidation.validate(
          createValidUserData({ rut: "1234-5" }),
        );
        expect(error).toBeDefined();
        expect(error.message).toMatch(/mínimo 9 caracteres/);
      });

      it("1.3.2 Debería fallar si el RUT es muy largo", () => {
        const { error } = userCreateValidation.validate(
          createValidUserData({ rut: "123456789012345-6" }),
        );
        expect(error).toBeDefined();
        expect(error.message).toMatch(/máximo 12 caracteres/);
      });

      it("1.3.3 Debería fallar si el RUT no tiene guion", () => {
        const { error } = userCreateValidation.validate(
          createValidUserData({ rut: "123456789" }),
        );
        expect(error).toBeDefined();
        expect(error.message).toMatch(/Formato rut inválido/);
      });

      it("1.3.4 Debería fallar si el RUT es requerido (campo ausente)", () => {
        const { error } = userCreateValidation.validate(
          createValidUserData({ rut: undefined }),
        );
        expect(error).toBeDefined();
        expect(error.message).toMatch(/El rut es obligatorio/);
      });

      it("1.3.5 Debería fallar si el RUT es un string vacío", () => {
        const { error } = userCreateValidation.validate(
          createValidUserData({ rut: "" }),
        );
        expect(error).toBeDefined();
        expect(error.message).toMatch(/El rut no puede estar vacío/);
      });

      it("1.4.1 Debería fallar si el email es muy corto", () => {
        const { error } = userCreateValidation.validate(
          createValidUserData({ email: "a@b.cl" }),
        );
        expect(error).toBeDefined();
        expect(error.message).toMatch(/al menos 15 caracteres/);
      });

      it("1.4.2 Debería fallar si el email es muy largo", () => {
        const { error } = userCreateValidation.validate(
          createValidUserData({ email: "a".repeat(91) + "@ubiobio.cl" }),
        );
        expect(error).toBeDefined();
        expect(error.message).toMatch(/máximo 100 caracteres/);
      });

      it("1.4.3 Debería fallar si el email tiene un dominio no permitido", () => {
        const { error } = userCreateValidation.validate(
          createValidUserData({
            email: "usuario.valido@hotmail.com",
          }),
        );
        expect(error).toBeDefined();
        expect(error.message).toMatch(/dominio/);
      });

      it("1.4.4 Debería fallar si el email es requerido (campo ausente)", () => {
        const { error } = userCreateValidation.validate(
          createValidUserData({ email: undefined }),
        );
        expect(error).toBeDefined();
        expect(error.message).toMatch(/El correo electrónico es obligatorio/);
      });

      it("1.4.5 Debería fallar si el email es un string vacío", () => {
        const { error } = userCreateValidation.validate(
          createValidUserData({ email: "" }),
        );
        expect(error).toBeDefined();
        expect(error.message).toMatch(
          /El correo electrónico no puede estar vacío/,
        );
      });

      it("1.5.1 Debería fallar si la contraseña es muy corta", () => {
        const { error } = userCreateValidation.validate(
          createValidUserData({ password: "123" }),
        );
        expect(error).toBeDefined();
        expect(error.message).toMatch(/al menos 8 caracteres/);
      });

      it("1.5.2 Debería fallar si la contraseña es muy larga", () => {
        const { error } = userCreateValidation.validate(
          createValidUserData({
            password: "passwordsuperlargoquepasa26",
          }),
        );
        expect(error).toBeDefined();
        expect(error.message).toMatch(/máximo 26 caracteres/);
      });

      it("1.5.3 Debería fallar si la contraseña tiene caracteres especiales", () => {
        const { error } = userCreateValidation.validate(
          createValidUserData({ password: "password-invalido" }),
        );
        expect(error).toBeDefined();
        expect(error.message).toMatch(/solo puede contener letras y números/);
      });

      it("1.5.4 Debería fallar si la contraseña es requerida (campo requerido)", () => {
        const { error } = userCreateValidation.validate(
          createValidUserData({ password: undefined }),
        );
        expect(error).toBeDefined();
        expect(error.message).toMatch(/La contraseña es obligatoria/);
      });

      it("1.5.5 Debería fallar si la contraseña es inválida (campo vacío)", () => {
        const { error } = userCreateValidation.validate(
          createValidUserData({ password: "" }),
        );
        expect(error).toBeDefined();
        expect(error.message).toMatch(/La contraseña no puede estar vacía/);
      });

      it("1.6.1 Debería fallar si el rol no es válido", () => {
        const { error } = userCreateValidation.validate(
          createValidUserData({ rol: "superadmin" }),
        );
        expect(error).toBeDefined();
        expect(error.message).toMatch(/rol debe ser uno de los siguientes/);
      });

      it("1.6.2 Debería fallar si el rol no es un string", () => {
        const { error } = userCreateValidation.validate(
          createValidUserData({ rol: 123 }),
        );
        expect(error).toBeDefined();
        expect(error.message).toMatch(/tipo string/);
      });
    });
  });

  describe("Validación de Body de Actualización (userBodyValidation)", () => {
    describe("Lógica Principal del Esquema", () => {
      it("2.1.1 Debe pasar si se envía un único campo válido (ej: solo nombreCompleto)", () => {
        const body = { nombreCompleto: "Un Nombre Perfectamente Valido" };
        const { error } = userBodyValidation.validate(body);
        expect(error).toBeUndefined();
      });

      it("2.1.2 Debe pasar si se envía el campo 'newPassword' válido", () => {
        const body = { newPassword: "unpasswordseguro123" };
        const { error } = userBodyValidation.validate(body);
        expect(error).toBeUndefined();
      });

      it("2.1.3 Debe pasar si el campo 'newPassword' es un string vacío (debido a .allow(''))", () => {
        const body = { newPassword: "" };
        const { error } = userBodyValidation.validate(body);
        expect(error).toBeUndefined();
      });

      it("2.1.4 Debería fallar si no se envía ningún campo (objeto vacío)", () => {
        const body = {};
        const { error } = userBodyValidation.validate(body);
        expect(error).toBeDefined();
        expect(error.message).toMatch(/Debes proporcionar al menos un campo/);
      });

      it("2.1.5 Debería fallar si se envían campos adicionales no permitidos", () => {
        const body = { rol: "tutor", ciudad: "Chillan" };
        const { error } = userBodyValidation.validate(body);
        expect(error).toBeDefined();
        expect(error.message).toMatch(/No se permiten propiedades adicionales/);
      });
    });

    describe("Validación por Campo", () => {
      it("2.2.1 Debería fallar si se envía un nombreCompleto demasiado corto", () => {
        const body = { nombreCompleto: "corto" };
        const { error } = userBodyValidation.validate(body);
        expect(error).toBeDefined();
        expect(error.message).toMatch(/mínimo 15 caracteres/);
      });

      it("2.2.2 Debería fallar si se envía un email con un dominio inválido", () => {
        const body = { email: "test@dominioinvalido.com" };
        const { error } = userBodyValidation.validate(body);
        expect(error).toBeDefined();
        expect(error.message).toMatch(/dominio/);
      });

      it("2.2.3 Debería fallar si se envía una password con caracteres no permitidos", () => {
        const body = { password: "pass-word" };
        const { error } = userBodyValidation.validate(body);
        expect(error).toBeDefined();
        expect(error.message).toMatch(/solo puede contener letras y números/);
      });

      it("2.2.4 Debería fallar si se envía un rut con formato inválido (sin guion)", () => {
        const body = { rut: "12345678k" };
        const { error } = userBodyValidation.validate(body);
        expect(error).toBeDefined();
        expect(error.message).toMatch(/Formato rut inválido/);
      });

      it("2.2.5 Debería fallar si se envía un rol que no está en la lista de permitidos", () => {
        const body = { rol: "pasante" };
        const { error } = userBodyValidation.validate(body);
        expect(error).toBeDefined();
        expect(error.message).toMatch(/rol debe ser uno de los siguientes/);
      });
    });
  });

  describe("Validación de Query de Búsqueda (userQueryValidation)", () => {
    describe("Lógica Principal del Esquema", () => {
      it("3.1.1 Debe pasar si se proporciona solo un ID válido", () => {
        const query = { id: 1 };
        const { error } = userQueryValidation.validate(query);
        expect(error).toBeUndefined();
      });

      it("3.1.2 Debe pasar si se proporciona solo un email válido", () => {
        const query = { email: "busqueda.valida@ubiobio.cl" };
        const { error } = userQueryValidation.validate(query);
        expect(error).toBeUndefined();
      });

      it("3.1.3 Debe pasar si se proporciona solo un RUT válido", () => {
        const query = { rut: "12345678-9" };
        const { error } = userQueryValidation.validate(query);
        expect(error).toBeUndefined();
      });

      it("3.1.4 Debería fallar si no se proporciona ningún parámetro de búsqueda (objeto vacío)", () => {
        const query = {};
        const { error } = userQueryValidation.validate(query);
        expect(error).toBeDefined();
        expect(error.message).toMatch(
          /Debes proporcionar al menos un parámetro/,
        );
      });

      it("3.1.5 Debería fallar si se proporciona un parámetro no permitido", () => {
        const query = { id: 1, nombreCompleto: "NoPermitido" };
        const { error } = userQueryValidation.validate(query);
        expect(error).toBeDefined();
        expect(error.message).toMatch(/No se permiten propiedades adicionales/);
      });
    });

    describe("Validación por Campo", () => {
      it("3.2.1 Debería fallar si el ID no es un número entero positivo", () => {
        const queryInvalidString = { id: "abc" };
        const queryInvalidFloat = { id: 1.5 };
        const queryInvalidZero = { id: 0 };

        const { error: errorString } =
          userQueryValidation.validate(queryInvalidString);
        const { error: errorFloat } =
          userQueryValidation.validate(queryInvalidFloat);
        const { error: errorZero } =
          userQueryValidation.validate(queryInvalidZero);

        expect(errorString).toBeDefined();
        expect(errorString.message).toMatch(/El id debe ser un número/);

        expect(errorFloat).toBeDefined();
        expect(errorFloat.message).toMatch(/El id debe ser un número entero/);

        expect(errorZero).toBeDefined();
        expect(errorZero.message).toMatch(/El id debe ser un número positivo/);
      });

      it("3.2.2 Debería fallar si el email tiene un formato inválido", () => {
        const query = { email: "test@dominioinvalido.com" };
        const { error } = userQueryValidation.validate(query);
        expect(error).toBeDefined();
        expect(error.message).toMatch(/dominio/);
      });

      it("3.2.3 Debería fallar si el RUT tiene un formato inválido", () => {
        const query = { rut: "12.345.678" };
        const { error } = userQueryValidation.validate(query);
        expect(error).toBeDefined();
        expect(error.message).toMatch(/Formato rut inválido/);
      });
    });
  });
});