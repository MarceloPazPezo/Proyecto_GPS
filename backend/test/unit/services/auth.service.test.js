vi.mock("../../../src/config/configEnv.js", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    ACCESS_TOKEN_SECRET: "este-es-un-secreto-para-pruebas-consistente",
  };
});
import {
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
  afterEach,
  vi,
} from "vitest";
import { testDataSource } from "../../../src/config/configDbTest.js";
import { AppDataSource } from "../../../src/config/configDb.js";
import User from "../../../src/entity/user.entity.js";
import { loginService } from "../../../src/services/auth.service.js";
import { encryptPassword } from "../../../src/helpers/bcrypt.helper.js";
import jwt from "jsonwebtoken";

describe("Pruebas de Integración para AuthService", () => {
  let queryRunner;
  let userRepository;

  const createTestUser = async (userData) => {
    const hashedPassword = await encryptPassword(userData.password);
    const userToSave = userRepository.create({
      ...userData,
      password: hashedPassword,
    });
    return userRepository.save(userToSave);
  };

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
    vi.spyOn(AppDataSource, "getRepository").mockReturnValue(userRepository);
  });

  afterEach(async () => {
    await queryRunner.rollbackTransaction();
    await queryRunner.release();
    vi.restoreAllMocks();
  });

  describe("Lógica de Login Exitosa", () => {
    it("1.1.1 Debe autenticar al usuario y devolver un token si el email y la contraseña son correctos", async () => {
      const plainPassword = "passwordSeguro123";
      await createTestUser({
        nombreCompleto: "Usuario Valido",
        rut: "11.111.111-1",
        email: "login.exitoso@ubiobio.cl",
        rol: "usuario",
        password: plainPassword,
      });
      const [token, error] = await loginService({
        email: "login.exitoso@ubiobio.cl",
        password: plainPassword,
      });
      expect(error).toBeNull();
      expect(token).toEqual(expect.any(String));
    });

    it("1.1.2 Debe encontrar al usuario sin importar si el email se envía con mayúsculas o minúsculas", async () => {
      const plainPassword = "passwordCase123";
      await createTestUser({
        nombreCompleto: "Usuario Case",
        rut: "22.222.222-2",
        email: "test.case@ubiobio.cl",
        rol: "tutor",
        password: plainPassword,
      });
      const [token, error] = await loginService({
        email: "TEST.CASE@ubiobio.cl",
        password: plainPassword,
      });
      expect(error).toBeNull();
      expect(token).toBeDefined();
    });
  });

  describe("Lógica de Login Fallida", () => {
    it("1.2.1 Debería devolver un error si el email no existe en la base de datos", async () => {
      const [token, error] = await loginService({
        email: "no.existe@ubiobio.cl",
        password: "cualquierpass",
      });
      expect(token).toBeNull();
      expect(error.dataInfo).toBe("email");
      expect(error.message).toBe("El correo electrónico es incorrecto");
    });

    it("1.2.2 Debería devolver un error si el email existe pero la contraseña es incorrecta", async () => {
      await createTestUser({
        nombreCompleto: "Usuario Pass Incorrecto",
        rut: "33.333.333-3",
        email: "pass.incorrecto@ubiobio.cl",
        rol: "usuario",
        password: "passwordCorrecto",
      });
      const [token, error] = await loginService({
        email: "pass.incorrecto@ubiobio.cl",
        password: "passwordINCORRECTO",
      });
      expect(token).toBeNull();
      expect(error.dataInfo).toBe("password");
      expect(error.message).toBe("La contraseña es incorrecta");
    });

    it("1.2.3 Debería devolver un error si se intenta autenticar a un usuario sin contraseña (caso borde)", async () => {
      await createTestUser({
        nombreCompleto: "Usuario Pass Vacio",
        rut: "44.444.444-4",
        email: "pass.vacio@ubiobio.cl",
        rol: "usuario",
        password: "passwordValido",
      });
      const [token, error] = await loginService({
        email: "pass.vacio@ubiobio.cl",
        password: "",
      });
      expect(token).toBeNull();
      expect(error.message).toBe("La contraseña es incorrecta");
    });
  });

  describe("Lógica de Generación de Token (JWT)", () => {
    it("1.3.1 El token devuelto debe ser un string no vacío", async () => {
      const plainPassword = "passwordToken123";
      await createTestUser({
        nombreCompleto: "Usuario Token",
        rut: "55.555.555-5",
        email: "token@ubiobio.cl",
        rol: "usuario",
        password: plainPassword,
      });
      const [token, error] = await loginService({
        email: "token@ubiobio.cl",
        password: plainPassword,
      });
      expect(error).toBeNull();
      expect(typeof token).toBe("string");
      expect(token.length).toBeGreaterThan(20);
    });

    it("1.3.2 El token (JWT) decodificado debe contener los datos correctos del usuario", async () => {
      const userData = {
        nombreCompleto: "Usuario Payload",
        rut: "66.666.666-6",
        email: "payload@ubiobio.cl",
        rol: "administrador",
        password: "passwordPayload123",
      };
      const savedUser = await createTestUser(userData);
      const [token, error] = await loginService({
        email: userData.email,
        password: userData.password,
      });
      expect(error).toBeNull();
      const mockedSecret = "este-es-un-secreto-para-pruebas-consistente";
      const decodedToken = jwt.verify(token, mockedSecret);
      expect(decodedToken.id).toBe(savedUser.id);
      expect(decodedToken.email).toBe(savedUser.email);
      expect(decodedToken.rol).toBe(savedUser.rol);
      expect(decodedToken.nombreCompleto).toBe(savedUser.nombreCompleto);
      expect(decodedToken.rut).toBe(savedUser.rut);
      expect(decodedToken).not.toHaveProperty("password");
    });
  });
});
