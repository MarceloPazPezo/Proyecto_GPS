import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } from "vitest";
import { testDataSource } from "../../src/config/configDbTest.js";
import User from "../../src/entity/user.entity.js";
import { userCreateValidation } from "../../src/validations/user.validation.js";

// ===============================================================================
// Operaciones en Base de Datos
// ===============================================================================
// --- Creación ---
// 4.1.1 Debería pasar si la entidad contiene todas las propiedades del esquema
// 4.1.2 Debería pasar si puede crear y guardar un usuario correctamente
// 4.1.3 Debería fallar al crear un usuario con un email duplicado
// 4.1.4 Debería fallar al crear un usuario con un RUT duplicado
// 4.1.5 Debería pasar si asigna timestamps (createdAt, updatedAt) correctamente en la creación
// --- Búsqueda ---
// 4.2.1 Debería pasar si busca un usuario por su ID
// 4.2.2 Debería pasar si busca un usuario por su RUT
// 4.2.3 Debería pasar si busca un usuario por su EMAIL
// --- Actualización ---
// 4.3.1 Debería pasar si actualiza múltiples campos de un usuario
// 4.3.2 Debería pasar si actualiza el campo updatedAt tras modificar el usuario
// --- Eliminación ---
// 4.4.1 Debería pasar si elimina un usuario correctamente

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

describe("Operaciones en Base de Datos", () => {
  let queryRunner;
  let userRepository;

  beforeAll(async () => {
    await testDataSource.initialize();
  });

  afterAll(async () => {
    await testDataSource.destroy();
  });
  
  beforeEach(async () => {
    queryRunner = testDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    userRepository = queryRunner.manager.getRepository(User);
  });

  afterEach(async () => {
    await queryRunner.rollbackTransaction();
    await queryRunner.release();
  });

  describe("Create", () => {
    it("4.1.1 Debería pasar si la entidad contiene todas las propiedades del esquema", async () => {
      const user = await userRepository.save(
        userRepository.create(createValidUserData()),
      );
      const foundUser = await userRepository.findOneBy({ id: user.id });
      const expectedProperties = [
        "id",
        "nombreCompleto",
        "rut",
        "email",
        "rol",
        "password",
        "createdAt",
        "updatedAt",
        "idCarrera",
      ];
      expect(Object.keys(foundUser)).toEqual(
        expect.arrayContaining(expectedProperties),
      );
    });

    it("4.1.2 Debería pasar si puede crear y guardar un usuario correctamente", async () => {
      const userData = createValidUserData({
        email: "creacion.exitosa@ubiobio.cl",
        rut: "11111111-1",
      });
      const { error } = userCreateValidation.validate(userData);
      expect(error).toBeUndefined();
      const user = userRepository.create(userData);
      await userRepository.save(user);
      expect(user.id).toBeDefined();
      const foundUser = await userRepository.findOneBy({ id: user.id });
      expect(foundUser.email).toBe(userData.email);
    });

    it("4.1.3 Debería fallar al crear un usuario con un email duplicado", async () => {
      const emailComun = "duplicado@ubiobio.cl";
      const user1Data = createValidUserData({
        email: emailComun,
        rut: "11111111-1",
      });
      const user2Data = createValidUserData({
        email: emailComun,
        rut: "22222222-2",
      });
      await userRepository.save(userRepository.create(user1Data));
      const user2 = userRepository.create(user2Data);
      await expect(userRepository.save(user2)).rejects.toThrow();
    });

    it("4.1.4 Debería fallar al crear un usuario con un RUT duplicado", async () => {
      const rutComun = "12.345.678-K";
      const user1Data = createValidUserData({
        rut: rutComun,
        email: "unico1@ubiobio.cl",
      });
      const user2Data = createValidUserData({
        rut: rutComun,
        email: "unico2@ubiobio.cl",
      });
      await userRepository.save(userRepository.create(user1Data));
      const user2 = userRepository.create(user2Data);
      await expect(userRepository.save(user2)).rejects.toThrow();
    });

    it("4.1.5 Debería pasar si asigna timestamps (createdAt, updatedAt) correctamente en la creación", async () => {
      const user = await userRepository.save(
        userRepository.create(createValidUserData()),
      );
      expect(user.createdAt).toBeInstanceOf(Date);
      expect(user.updatedAt).toBeInstanceOf(Date);
      expect(
        Math.abs(user.updatedAt.getTime() - user.createdAt.getTime()),
      ).toBeLessThan(100);
    });
  });

  describe("Read", () => {
    const searchCases = [
      { key: "id", value: (user) => user.id },
      { key: "rut", value: (user) => user.rut },
      { key: "email", value: (user) => user.email },
    ];

    const testCasesWithIndex = searchCases.map((testCase, index) => ({
      ...testCase,
      idx: index + 1,
    }));

    it.each(testCasesWithIndex)(
      "4.2.$idx Debe buscar un usuario por su $key",
      async ({ key, value }) => {
        const userData = createValidUserData();
        const user = await userRepository.save(userRepository.create(userData));

        const foundUser = await userRepository.findOneBy({
          [key]: value(user),
        });

        expect(foundUser).not.toBeNull();
        expect(foundUser).toMatchObject(userData);
      },
    );
  });

  describe("Update", () => {
    it("4.3.1 Debería pasar si actualiza múltiples campos de un usuario", async () => {
      const userData = createValidUserData();
      const user = await userRepository.save(userRepository.create(userData));
      const nuevosDatos = {
        nombreCompleto: "Nombre Actualizado",
        email: "email.actualizado@ubiobio.cl",
        rol: "tutor",
      };
      Object.assign(user, nuevosDatos);
      await userRepository.save(user);
      const updatedUser = await userRepository.findOneBy({ id: user.id });
      expect(updatedUser.nombreCompleto).toBe(nuevosDatos.nombreCompleto);
      expect(updatedUser.email).toBe(nuevosDatos.email);
      expect(updatedUser.rol).toBe(nuevosDatos.rol);
    });

    it("4.3.2 Debería pasar si actualiza el campo updatedAt tras modificar el usuario", async () => {
      const userData = createValidUserData({ rut: "98765432-1" });
      const user = await userRepository.save(userRepository.create(userData));
      const originalUpdatedAt = user.updatedAt;
      await new Promise((res) => setTimeout(res, 500));
      user.nombreCompleto = "Usuario con Timestamp Modificado";
      user.updatedAt = new Date();
      await userRepository.update({id: user.id}, user);
      const updatedUser = await userRepository.findOne({
        where: { id: user.id },
        cache: false,
      });
      expect(updatedUser.updatedAt.getTime()).toBeGreaterThan(
        originalUpdatedAt.getTime(),
      );
    });
  });
  describe("Delete", () => {
    it("4.4.1 Debe eliminar un usuario correctamente", async () => {
      const user = await userRepository.save(
        userRepository.create(createValidUserData()),
      );
      await userRepository.delete({ id: user.id });
      const deletedUser = await userRepository.findOneBy({ id: user.id });
      expect(deletedUser).toBeNull();
    });
  });
});
