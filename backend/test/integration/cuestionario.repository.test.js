import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } from "vitest";
import { testDataSource } from "../../src/config/configDbTest.js";
import Cuestionario from "../../src/entity/cuestionario.entity.js";
import User from "../../src/entity/user.entity.js";

// ===============================================================================
// Operaciones en Base de Datos
// ===============================================================================
// --- Creación ---
// 4.1.1 Debe crear y guardar un cuestionario correctamente (Happy Path)
// 4.1.2 La entidad guardada debe contener todas las propiedades del esquema (id, idUser, nombre, fechaCreacion)
// 4.1.3 Debe asignar el timestamp 'fechaCreacion' correctamente al crear
// --- Búsqueda ---
// 4.2.1 Debe buscar un cuestionario por su ID
// 4.2.2 Debe buscar cuestionarios por 'idUser'
// 4.2.3 Debe buscar un cuestionario por 'idUser' y 'nombre'
// --- Actualización ---
// 4.3.1 Debe actualizar el nombre de un cuestionario existente
// --- Eliminación ---
// 4.4.1 Debe eliminar un cuestionario por su ID
// 4.4.2 Debe eliminar los cuestionarios de un usuario cuando el usuario es eliminado (Prueba de CASCADE)
// --- Relaciones ---
// 4.5.1 Debe poder cargar un cuestionario con su relación de 'preguntas' (incluso si está vacía)

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

describe("Operaciones en Base de Datos", () => {
  let queryRunner;
  let userRepository;
  let quizRepository;

  const createAndSaveTestUser = async (overrides = {}) => {
    const userData = {
      nombreCompleto: "Usuario de Prueba para Cuestionarios",
      rut: "11.111.111-1",
      email: "test.user.quiz@ubiobio.cl",
      rol: "usuario",
      password: "password123",
      ...overrides,
    };
    return userRepository.save(userRepository.create(userData));
  };

  beforeAll(async () => {
    // Inicializa la conexión para ESTE worker.
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
    quizRepository = queryRunner.manager.getRepository(Cuestionario);
  });

  afterEach(async () => {
    await queryRunner.rollbackTransaction();
    await queryRunner.release();
  });

  describe("Create", () => {
    it("4.1.1 Debe crear y guardar un cuestionario correctamente", async () => {
      const user = await createAndSaveTestUser();
      const quizData = { nombre: "Mi Primer Cuestionario", idUser: user.id };
      const savedQuiz = await quizRepository.save(
        quizRepository.create(quizData),
      );
      expect(savedQuiz).toBeDefined();
      expect(savedQuiz.id).toEqual(expect.any(Number));
      expect(savedQuiz.nombre).toBe("Mi Primer Cuestionario");
    });

    it("4.1.2 La entidad guardada debe contener todas las propiedades del esquema", async () => {
      const user = await createAndSaveTestUser();
      const quizData = { nombre: "Quiz de Esquema", idUser: user.id };
      const savedQuiz = await quizRepository.save(
        quizRepository.create(quizData),
      );
      const expectedProperties = ["id", "idUser", "nombre", "fechaCreacion"];
      expect(Object.keys(savedQuiz)).toEqual(
        expect.arrayContaining(expectedProperties),
      );
    });

    it("4.1.3 Debe asignar el timestamp 'fechaCreacion' correctamente al crear", async () => {
      const user = await createAndSaveTestUser();
      const savedQuiz = await quizRepository.save({
        nombre: "Quiz de Timestamp",
        idUser: user.id,
      });
      expect(savedQuiz.fechaCreacion).toBeInstanceOf(Date);
    });
  });

  describe("Read", () => {
    it("4.2.1 Debe buscar un cuestionario por su ID", async () => {
      const user = await createAndSaveTestUser();
      const savedQuiz = await quizRepository.save({
        nombre: "Quiz para Buscar",
        idUser: user.id,
      });
      const foundQuiz = await quizRepository.findOneBy({ id: savedQuiz.id });
      expect(foundQuiz).not.toBeNull();
      expect(foundQuiz.id).toBe(savedQuiz.id);
    });

    it("4.2.2 Debe buscar cuestionarios por 'idUser'", async () => {
      const user1 = await createAndSaveTestUser();
      await quizRepository.save({
        nombre: "Quiz 1 de User 1",
        idUser: user1.id,
      });
      await quizRepository.save({
        nombre: "Quiz 2 de User 1",
        idUser: user1.id,
      });
      const user2 = await createAndSaveTestUser({
        email: "user2@test.com",
        rut: "22.222.222-2",
      });
      await quizRepository.save({
        nombre: "Quiz 1 de User 2",
        idUser: user2.id,
      });
      const foundQuizzes = await quizRepository.findBy({ idUser: user1.id });
      expect(foundQuizzes).toHaveLength(2);
    });

    it("4.2.3 Debe buscar un cuestionario por 'idUser' y 'nombre'", async () => {
      const user = await createAndSaveTestUser();
      const nombreBuscado = "Cuestionario Específico";
      await quizRepository.save({ nombre: nombreBuscado, idUser: user.id });
      await quizRepository.save({
        nombre: "Otro Cuestionario",
        idUser: user.id,
      });
      const foundQuiz = await quizRepository.findOneBy({
        idUser: user.id,
        nombre: nombreBuscado,
      });
      expect(foundQuiz).not.toBeNull();
      expect(foundQuiz.nombre).toBe(nombreBuscado);
    });
  });

  describe("Update", () => {
    it("4.3.1 Debe actualizar el nombre de un cuestionario existente", async () => {
      const user = await createAndSaveTestUser();
      const quiz = await quizRepository.save({
        nombre: "Nombre Original",
        idUser: user.id,
      });
      const nuevoNombre = "Nombre Actualizado";
      quiz.nombre = nuevoNombre;
      await quizRepository.save(quiz);
      const updatedQuiz = await quizRepository.findOneBy({ id: quiz.id });
      expect(updatedQuiz.nombre).toBe(nuevoNombre);
    });
  });

  describe("Delete", () => {
    it("4.4.1 Debe eliminar un cuestionario por su ID", async () => {
      const user = await createAndSaveTestUser();
      const quiz = await quizRepository.save({
        nombre: "Para ser eliminado",
        idUser: user.id,
      });
      await quizRepository.delete({ id: quiz.id });
      const deletedQuiz = await quizRepository.findOneBy({ id: quiz.id });
      expect(deletedQuiz).toBeNull();
    });

    it("4.4.2 Debe eliminar los cuestionarios de un usuario cuando el usuario es eliminado (Prueba de CASCADE)", async () => {
      const user = await createAndSaveTestUser();
      const quiz1 = await quizRepository.save({
        nombre: "Quiz 1 para Cascada",
        idUser: user.id,
      });
      const quiz2 = await quizRepository.save({
        nombre: "Quiz 2 para Cascada",
        idUser: user.id,
      });
      await userRepository.delete({ id: user.id });
      const foundQuiz1 = await quizRepository.findOneBy({ id: quiz1.id });
      const foundQuiz2 = await quizRepository.findOneBy({ id: quiz2.id });
      expect(foundQuiz1).toBeNull();
      expect(foundQuiz2).toBeNull();
    });
  });

  describe("Relaciones", () => {
    it("4.5.1 Debe poder cargar un cuestionario con su relación de 'preguntas' (incluso si está vacía)", async () => {
      const user = await createAndSaveTestUser();
      const quiz = await quizRepository.save({
        nombre: "Quiz con Relaciones",
        idUser: user.id,
      });
      const quizWithRelations = await quizRepository.findOne({
        where: { id: quiz.id },
        relations: ["preguntas"],
      });
      expect(quizWithRelations).toHaveProperty("preguntas");
      expect(Array.isArray(quizWithRelations.preguntas)).toBe(true);
      expect(quizWithRelations.preguntas).toHaveLength(0);
    });
  });
});
