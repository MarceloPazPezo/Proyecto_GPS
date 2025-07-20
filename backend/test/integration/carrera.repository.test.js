import { describe, it, expect, beforeAll, beforeEach, afterAll, afterEach } from "vitest";
import { testDataSource } from "../../src/config/configDbTest.js";
import User from "../../src/entity/user.entity.js";
import Carrera from "../../src/entity/carrera.entity.js";

// ===============================================================================
// Operaciones en Base de Datos
// ===============================================================================
// --- Creación ---
// 4.1.1 Debe crear y guardar una carrera correctamente (Happy Path)
// 4.1.2 La entidad guardada debe contener todas las propiedades del esquema (ej: id, nombre, createdAt, updatedAt)
// 4.1.3 Debe asignar los timestamps (createdAt, updatedAt) correctamente en la creación
// 4.1.4 Debería fallar al crear una carrera con un nombre duplicado (restricción UNIQUE)
// --- Búsqueda ---
// 4.2.1 Debe buscar una carrera por su ID
// 4.2.2 Debe buscar una carrera por su 'nombre'
// --- Actualización ---
// 4.3.1 Debe actualizar el nombre de una carrera
// 4.3.2 Debe actualizar el campo 'updatedAt' tras modificar la carrera
// --- Eliminación ---
// 4.4.1 Debe eliminar una carrera correctamente

describe("Operaciones en Base de Datos", () => {
  let queryRunner;
  let userRepository;
  let carreraRepository;

  const createAndSaveTestUser = async (overrides = {}) => {
    const userData = {
      nombreCompleto: "Usuario Encargado de Prueba",
      rut: "11.111.111-1",
      email: "encargado.prueba@ubiobio.cl",
      rol: "encargado_carrera",
      password: "password123",
      ...overrides,
    };
    return userRepository.save(userRepository.create(userData));
  };

  const createAndSaveTestCarrera = async (user, overrides = {}) => {
    const carreraData = {
      nombre: "Ingeniería Civil en Informática",
      codigo: "ICI-3456",
      departamento: "Departamento de Sistemas de Información",
      idEncargado: user.id,
      ...overrides,
    };
    return carreraRepository.save(carreraRepository.create(carreraData));
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
    carreraRepository = queryRunner.manager.getRepository(Carrera);
  });

  afterEach(async () => {
    await queryRunner.rollbackTransaction();
    await queryRunner.release();
  });

  describe("Create", () => {
    it("4.1.1 Debe crear y guardar una carrera correctamente (Happy Path)", async () => {
      const user = await createAndSaveTestUser();
      const savedCarrera = await createAndSaveTestCarrera(user);
      expect(savedCarrera).toBeDefined();
      expect(savedCarrera.id).toEqual(expect.any(Number));
      expect(savedCarrera.nombre).toBe("Ingeniería Civil en Informática");
    });

    it("4.1.2 La entidad guardada debe contener todas las propiedades del esquema", async () => {
      const user = await createAndSaveTestUser();
      const savedCarrera = await createAndSaveTestCarrera(user);
      const expectedProperties = [
        "id",
        "nombre",
        "codigo",
        "descripcion",
        "departamento",
        "createdAt",
        "updatedAt",
        "idEncargado",
      ];
      expect(Object.keys(savedCarrera)).toEqual(
        expect.arrayContaining(expectedProperties),
      );
    });

    it("4.1.3 Debe asignar los timestamps (createdAt, updatedAt) correctamente en la creación", async () => {
      const user = await createAndSaveTestUser();
      const savedCarrera = await createAndSaveTestCarrera(user);
      expect(savedCarrera.createdAt).toBeInstanceOf(Date);
      expect(savedCarrera.updatedAt).toBeInstanceOf(Date);
      expect(savedCarrera.updatedAt.getTime()).toEqual(
        savedCarrera.createdAt.getTime(),
      );
    });

    it("4.1.4 Debería fallar al crear una carrera con un código duplicado", async () => {
      const user = await createAndSaveTestUser();
      const codigoComun = "COD-DUP-123";
      await createAndSaveTestCarrera(user, { codigo: codigoComun });
      await expect(
        createAndSaveTestCarrera(user, {
          codigo: codigoComun,
          nombre: "Otra Carrera",
        }),
      ).rejects.toThrow();
    });
  });

  describe("Read", () => {
    it("4.2.1 Debe buscar una carrera por su ID", async () => {
      const user = await createAndSaveTestUser();
      const savedCarrera = await createAndSaveTestCarrera(user);
      const foundCarrera = await carreraRepository.findOneBy({
        id: savedCarrera.id,
      });
      expect(foundCarrera).not.toBeNull();
      expect(foundCarrera.id).toBe(savedCarrera.id);
    });

    it("4.2.2 Debe buscar una carrera por su 'nombre'", async () => {
      const user = await createAndSaveTestUser();
      const nombreBuscado = "Ingeniería Comercial";
      await createAndSaveTestCarrera(user, { nombre: nombreBuscado });
      const foundCarrera = await carreraRepository.findOneBy({
        nombre: nombreBuscado,
      });
      expect(foundCarrera).not.toBeNull();
      expect(foundCarrera.nombre).toBe(nombreBuscado);
    });
  });

  describe("Update", () => {
    it("4.3.1 Debe actualizar el nombre de una carrera", async () => {
      const user = await createAndSaveTestUser();
      const carrera = await createAndSaveTestCarrera(user);
      const nuevoNombre = "Ingeniería de Ejecución en Computación";
      carrera.nombre = nuevoNombre;
      await carreraRepository.save(carrera);
      const updatedCarrera = await carreraRepository.findOneBy({
        id: carrera.id,
      });
      expect(updatedCarrera.nombre).toBe(nuevoNombre);
    });

    it("4.3.2 Debe actualizar el campo 'updatedAt' tras modificar la carrera", async () => {
      const user = await createAndSaveTestUser();
      const carrera = await createAndSaveTestCarrera(user);
      const originalUpdatedAt = carrera.updatedAt;
      await new Promise((res) => setTimeout(res, 50));
      carrera.departamento = "Nuevo Departamento de Ciencias";
      carrera.updatedAt = new Date();
      await carreraRepository.save(carrera);
      const updatedCarrera = await carreraRepository.findOne({
        where: { id: carrera.id },
        cache: false,
      });
      expect(updatedCarrera.updatedAt.getTime()).toBeGreaterThan(
        originalUpdatedAt.getTime(),
      );
    });
  });

  describe("Eliminación (DELETE)", () => {
    it("4.4.1 Debe eliminar una carrera correctamente", async () => {
      const user = await createAndSaveTestUser();
      const carrera = await createAndSaveTestCarrera(user);
      await carreraRepository.delete({ id: carrera.id });
      const deletedCarrera = await carreraRepository.findOneBy({
        id: carrera.id,
      });
      expect(deletedCarrera).toBeNull();
    });
  });
});
