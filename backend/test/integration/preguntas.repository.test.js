import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } from "vitest";
import { testDataSource } from "../../src/config/configDbTest.js";
import User from "../../src/entity/user.entity.js";
import Cuestionario from "../../src/entity/cuestionario.entity.js";
import Preguntas from "../../src/entity/preguntas.entity.js";

// ===============================================================================
// Operaciones en Base de Datos
// ===============================================================================
// --- Creación ---
// 3.1.1 Debe crear y guardar una pregunta correctamente (solo con campos requeridos)
// 3.1.2 Debe crear y guardar una pregunta con campos opcionales (imagenUrl, imagenKey)
// 3.1.3 La entidad guardada debe contener todas las propiedades del esquema
// --- Búsqueda ---
// 3.2.1 Debe buscar una pregunta por su ID
// 3.2.2 Debe buscar todas las preguntas de un cuestionario por 'idCuestionario'
// --- Actualización ---
// 3.3.1 Debe actualizar el texto de una pregunta existente
// 3.3.2 Debe actualizar los campos de imagen (añadir, modificar o eliminar) de una pregunta
// --- Eliminación ---
// 3.4.1 Debe eliminar una pregunta por su ID
// 3.4.2 Debe eliminar las preguntas cuando su cuestionario padre es eliminado (Prueba de CASCADE)
// --- Relaciones ---
// 3.5.1 Debe poder cargar una pregunta con su relación de 'respuestas' (incluso si está vacía)

describe("Operaciones en Base de Datos", () => {
  let queryRunner;
  let userRepository;
  let quizRepository;
  let questionRepository;

  const createAndSaveTestUser = async () => {
    const userData = {
      nombreCompleto: "Usuario de Prueba para Preguntas",
      rut: "11.111.111-1",
      email: "test.user.preguntas@ubiobio.cl",
      rol: "usuario",
      password: "password123",
    };
    return userRepository.save(userRepository.create(userData));
  };
  
  const createAndSaveTestQuiz = async (user) => {
    const quizData = { nombre: "Cuestionario de Prueba", idUser: user.id };
    return quizRepository.save(quizRepository.create(quizData));
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
    quizRepository = queryRunner.manager.getRepository(Cuestionario);
    questionRepository = queryRunner.manager.getRepository(Preguntas);
  });

  afterEach(async () => {
    await queryRunner.rollbackTransaction();
    await queryRunner.release();
  });

  describe("Create", () => {
    it("3.1.1 Debe crear y guardar una pregunta correctamente (solo con campos requeridos)", async () => {
      const user = await createAndSaveTestUser();
      const quiz = await createAndSaveTestQuiz(user);
      const questionData = { texto: "¿Cuál es la raíz cuadrada de 9?", idCuestionario: quiz.id };
      const savedQuestion = await questionRepository.save(questionRepository.create(questionData));
      expect(savedQuestion).toBeDefined();
      expect(savedQuestion.id).toEqual(expect.any(Number));
      expect(savedQuestion.texto).toBe(questionData.texto);
      expect(savedQuestion.imagenUrl).toBeNull();
    });

    it("3.1.2 Debe crear y guardar una pregunta con campos opcionales (imagenUrl, imagenKey)", async () => {
      const user = await createAndSaveTestUser();
      const quiz = await createAndSaveTestQuiz(user);
      const questionData = { 
        texto: "¿Qué representa esta imagen?", 
        idCuestionario: quiz.id,
        imagenUrl: "http://example.com/image.png",
        imagenKey: "uploads/image.png"
      };
      const savedQuestion = await questionRepository.save(questionData);
      expect(savedQuestion.imagenUrl).toBe(questionData.imagenUrl);
      expect(savedQuestion.imagenKey).toBe(questionData.imagenKey);
    });

    it("3.1.3 La entidad guardada debe contener todas las propiedades del esquema", async () => {
        const user = await createAndSaveTestUser();
        const quiz = await createAndSaveTestQuiz(user);
        const savedQuestion = await questionRepository.save({ texto: "Test", idCuestionario: quiz.id });
        const expectedProperties = ["id", "texto", "imagenUrl", "imagenKey", "idCuestionario"];
        expect(Object.keys(savedQuestion)).toEqual(expect.arrayContaining(expectedProperties));
    });
  });

  describe("Read", () => {
    it("3.2.1 Debe buscar una pregunta por su ID", async () => {
        const user = await createAndSaveTestUser();
        const quiz = await createAndSaveTestQuiz(user);
        const question = await questionRepository.save({ texto: "Pregunta para buscar", idCuestionario: quiz.id });
        const foundQuestion = await questionRepository.findOneBy({ id: question.id });
        expect(foundQuestion).not.toBeNull();
        expect(foundQuestion.id).toBe(question.id);
    });

    it("3.2.2 Debe buscar todas las preguntas de un cuestionario por 'idCuestionario'", async () => {
        const user = await createAndSaveTestUser();
        const quiz1 = await createAndSaveTestQuiz(user);
        await questionRepository.save({ texto: "P1Q1", idCuestionario: quiz1.id });
        await questionRepository.save({ texto: "P2Q1", idCuestionario: quiz1.id });
        const quiz2 = await createAndSaveTestQuiz(user);
        await questionRepository.save({ texto: "P1Q2", idCuestionario: quiz2.id });
        const foundQuestions = await questionRepository.findBy({ idCuestionario: quiz1.id });
        expect(foundQuestions).toHaveLength(2);
    });
  });

  describe("Update", () => {
    it("3.3.1 Debe actualizar el texto de una pregunta existente", async () => {
        const user = await createAndSaveTestUser();
        const quiz = await createAndSaveTestQuiz(user);
        const question = await questionRepository.save({ texto: "Texto original", idCuestionario: quiz.id });
        const nuevoTexto = "Este es el texto actualizado";
        question.texto = nuevoTexto;
        await questionRepository.save(question);
        const updatedQuestion = await questionRepository.findOneBy({ id: question.id });
        expect(updatedQuestion.texto).toBe(nuevoTexto);
    });

    it("3.3.2 Debe actualizar los campos de imagen (añadir, modificar o eliminar) de una pregunta", async () => {
        const user = await createAndSaveTestUser();
        const quiz = await createAndSaveTestQuiz(user);
        const question = await questionRepository.save({ texto: "Pregunta sobre imágenes", idCuestionario: quiz.id });
        question.imagenUrl = "url1";
        question.imagenKey = "key1";
        await questionRepository.save(question);
        let updatedQuestion = await questionRepository.findOneBy({ id: question.id });
        expect(updatedQuestion.imagenUrl).toBe("url1");
        question.imagenUrl = "url2";
        question.imagenKey = "key2";
        await questionRepository.save(question);
        updatedQuestion = await questionRepository.findOneBy({ id: question.id });
        expect(updatedQuestion.imagenUrl).toBe("url2");
        question.imagenUrl = null;
        question.imagenKey = null;
        await questionRepository.save(question);
        updatedQuestion = await questionRepository.findOneBy({ id: question.id });
        expect(updatedQuestion.imagenUrl).toBeNull();
    });
  });

  describe("Delete", () => {
    it("3.4.1 Debe eliminar una pregunta por su ID", async () => {
        const user = await createAndSaveTestUser();
        const quiz = await createAndSaveTestQuiz(user);
        const question = await questionRepository.save({ texto: "Pregunta a eliminar", idCuestionario: quiz.id });
        await questionRepository.delete({ id: question.id });
        const deletedQuestion = await questionRepository.findOneBy({ id: question.id });
        expect(deletedQuestion).toBeNull();
    });

    it("3.4.2 Debe eliminar las preguntas cuando su cuestionario padre es eliminado (Prueba de CASCADE)", async () => {
        const user = await createAndSaveTestUser();
        const quiz = await createAndSaveTestQuiz(user);
        const question = await questionRepository.save({ texto: "Pregunta para cascada", idCuestionario: quiz.id });
        await quizRepository.delete({ id: quiz.id });
        const foundQuestion = await questionRepository.findOneBy({ id: question.id });
        expect(foundQuestion).toBeNull();
    });
  });

  describe("Relaciones", () => {
    it("3.5.1 Debe poder cargar una pregunta con su relación de 'respuestas' (incluso si está vacía)", async () => {
        const user = await createAndSaveTestUser();
        const quiz = await createAndSaveTestQuiz(user);
        const question = await questionRepository.save({ texto: "Pregunta con relación", idCuestionario: quiz.id });
        const questionWithRelations = await questionRepository.findOne({
            where: { id: question.id },
            relations: ["respuestas"],
        });
        expect(questionWithRelations).toHaveProperty("respuestas");
        expect(Array.isArray(questionWithRelations.respuestas)).toBe(true);
        expect(questionWithRelations.respuestas).toHaveLength(0);
    });
  });
});