import {
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
  afterEach,
} from "vitest";
import { testDataSource } from "../../src/config/configDbTest.js";
import User from "../../src/entity/user.entity.js";
import Cuestionario from "../../src/entity/cuestionario.entity.js";
import Preguntas from "../../src/entity/preguntas.entity.js";
import Respuesta from "../../src/entity/respuesta.entity.js";

// ===============================================================================
// Operaciones en Base de Datos
// ===============================================================================
// --- Creación ---
// 4.1.1 Debe crear y guardar una respuesta correctamente
// 4.1.2 La entidad guardada debe contener todas las propiedades del esquema
// 4.1.3 Debe respetar el valor 'default: false' para el campo 'correcta' si no se especifica
// --- Búsqueda ---
// 4.2.1 Debe buscar una respuesta por su ID (y idPreguntas, si la clave es compuesta)
// 4.2.2 Debe buscar todas las respuestas de una pregunta por 'idPreguntas'
// --- Actualización ---
// 4.3.1 Debe actualizar el 'textoRespuesta' de una respuesta existente
// 4.3.2 Debe actualizar el campo 'correcta' (ej: de false a true) de una respuesta existente
// --- Eliminación ---
// 4.4.1 Debe eliminar una respuesta por su ID (y/o idPreguntas)
// 4.4.2 Debe eliminar las respuestas cuando su pregunta padre es eliminada (Prueba de CASCADE)
// --- Relaciones ---
// 4.5.1 Debe poder cargar una respuesta con su relación a la pregunta ('idPreguntas')

describe("Operaciones en Base de Datos", () => {
  let queryRunner;
  let userRepository;
  let quizRepository;
  let questionRepository;
  let respuestaRepository;

  const createAndSaveTestUser = async () => {
    const userData = {
      nombreCompleto: "Usuario de Prueba para Respuestas",
      rut: "33.333.333-3",
      email: "test.user.respuestas@ubiobio.cl",
      rol: "usuario",
      password: "password123",
    };
    return userRepository.save(userRepository.create(userData));
  };

  const createAndSaveTestQuiz = async (user) => {
    const quizData = {
      nombre: "Cuestionario para Respuestas",
      idUser: user.id,
    };
    return quizRepository.save(quizRepository.create(quizData));
  };

  const createAndSaveTestQuestion = async (quiz) => {
    const questionData = {
      texto: "Pregunta de Prueba",
      idCuestionario: quiz.id,
    };
    return questionRepository.save(questionRepository.create(questionData));
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
    respuestaRepository = queryRunner.manager.getRepository(Respuesta);
  });

  afterEach(async () => {
    await queryRunner.rollbackTransaction();
    await queryRunner.release();
  });

  describe("Create", () => {
    it("4.1.1 Debe crear y guardar una respuesta correctamente", async () => {
      const user = await createAndSaveTestUser();
      const quiz = await createAndSaveTestQuiz(user);
      const question = await createAndSaveTestQuestion(quiz);
      const respuestaData = {
        textoRespuesta: "Respuesta A",
        correcta: true,
        idPreguntas: question.id,
      };
      const savedRespuesta = await respuestaRepository.save(respuestaData);
      expect(savedRespuesta).toBeDefined();
      expect(savedRespuesta.id).toEqual(expect.any(Number));
      expect(savedRespuesta.textoRespuesta).toBe("Respuesta A");
      expect(savedRespuesta.correcta).toBe(true);
    });

    it("4.1.2 La entidad guardada debe contener todas las propiedades del esquema", async () => {
      const user = await createAndSaveTestUser();
      const quiz = await createAndSaveTestQuiz(user);
      const question = await createAndSaveTestQuestion(quiz);
      const savedRespuesta = await respuestaRepository.save({
        textoRespuesta: "Test",
        correcta: false,
        idPreguntas: question.id,
      });
      const expectedProperties = [
        "id",
        "textoRespuesta",
        "correcta",
        "idPreguntas",
      ];
      expect(Object.keys(savedRespuesta)).toEqual(
        expect.arrayContaining(expectedProperties),
      );
    });

    it("4.1.3 Debe respetar el valor 'default: false' para el campo 'correcta' si no se especifica", async () => {
      const user = await createAndSaveTestUser();
      const quiz = await createAndSaveTestQuiz(user);
      const question = await createAndSaveTestQuestion(quiz);
      const savedRespuesta = await respuestaRepository.save({
        textoRespuesta: "Respuesta sin booleano",
        idPreguntas: question.id,
      });
      expect(savedRespuesta.correcta).toBe(false);
    });
  });

  describe("Read", () => {
    it("4.2.1 Debe buscar una respuesta por su clave primaria compuesta", async () => {
      const user = await createAndSaveTestUser();
      const quiz = await createAndSaveTestQuiz(user);
      const question = await createAndSaveTestQuestion(quiz);
      const respuesta = await respuestaRepository.save({
        textoRespuesta: "Respuesta para buscar",
        correcta: true,
        idPreguntas: question.id,
      });

      const foundRespuesta = await respuestaRepository.findOneBy({
        id: respuesta.id,
        idPreguntas: respuesta.idPreguntas,
      });

      expect(foundRespuesta).not.toBeNull();
      expect(foundRespuesta.id).toBe(respuesta.id);
    });

    it("4.2.2 Debe buscar todas las respuestas de una pregunta por 'idPreguntas'", async () => {
      const user = await createAndSaveTestUser();
      const quiz = await createAndSaveTestQuiz(user);
      const question1 = await createAndSaveTestQuestion(quiz);
      await respuestaRepository.save({
        textoRespuesta: "R1P1",
        correcta: true,
        idPreguntas: question1.id,
      });
      await respuestaRepository.save({
        textoRespuesta: "R2P1",
        correcta: false,
        idPreguntas: question1.id,
      });
      const question2 = await createAndSaveTestQuestion(quiz);
      await respuestaRepository.save({
        textoRespuesta: "R1P2",
        correcta: true,
        idPreguntas: question2.id,
      });
      const foundRespuestas = await respuestaRepository.findBy({
        idPreguntas: question1.id,
      });
      expect(foundRespuestas).toHaveLength(2);
    });
  });

  describe("Update", () => {
    it("4.3.1 Debe actualizar el 'textoRespuesta' de una respuesta existente", async () => {
      const user = await createAndSaveTestUser();
      const quiz = await createAndSaveTestQuiz(user);
      const question = await createAndSaveTestQuestion(quiz);
      const respuesta = await respuestaRepository.save({
        textoRespuesta: "Texto original",
        correcta: false,
        idPreguntas: question.id,
      });
      const nuevoTexto = "Este es el texto actualizado";
      respuesta.textoRespuesta = nuevoTexto;
      await respuestaRepository.save(respuesta);
      const updatedRespuesta = await respuestaRepository.findOneBy({
        id: respuesta.id,
        idPreguntas: respuesta.idPreguntas,
      });
      expect(updatedRespuesta.textoRespuesta).toBe(nuevoTexto);
    });

    it("4.3.2 Debe actualizar el campo 'correcta' (ej: de false a true) de una respuesta existente", async () => {
      const user = await createAndSaveTestUser();
      const quiz = await createAndSaveTestQuiz(user);
      const question = await createAndSaveTestQuestion(quiz);
      const respuesta = await respuestaRepository.save({
        textoRespuesta: "Respuesta a corregir",
        correcta: false,
        idPreguntas: question.id,
      });
      respuesta.correcta = true;
      await respuestaRepository.save(respuesta);
      const updatedRespuesta = await respuestaRepository.findOneBy({
        id: respuesta.id,
        idPreguntas: respuesta.idPreguntas,
      });
      expect(updatedRespuesta.correcta).toBe(true);
    });
  });

  describe("Delete", () => {
    it("4.4.1 Debe eliminar una respuesta por su clave primaria compuesta", async () => {
      const user = await createAndSaveTestUser();
      const quiz = await createAndSaveTestQuiz(user);
      const question = await createAndSaveTestQuestion(quiz);
      const respuesta = await respuestaRepository.save({
        textoRespuesta: "Respuesta a eliminar",
        correcta: false,
        idPreguntas: question.id,
      });
      await respuestaRepository.delete({
        id: respuesta.id,
        idPreguntas: respuesta.idPreguntas,
      });
      const deletedRespuesta = await respuestaRepository.findOneBy({
        id: respuesta.id,
        idPreguntas: respuesta.idPreguntas,
      });
      expect(deletedRespuesta).toBeNull();
    });

    it("4.4.2 Debe eliminar las respuestas cuando su pregunta padre es eliminada (Prueba de CASCADE)", async () => {
      const user = await createAndSaveTestUser();
      const quiz = await createAndSaveTestQuiz(user);
      const question = await createAndSaveTestQuestion(quiz);
      const respuesta = await respuestaRepository.save({
        textoRespuesta: "Respuesta para cascada",
        correcta: false,
        idPreguntas: question.id,
      });
      await questionRepository.delete({ id: question.id });
      const foundRespuesta = await respuestaRepository.findOneBy({
        id: respuesta.id,
      });
      expect(foundRespuesta).toBeNull();
    });
  });

  describe("Relaciones", () => {
    it("4.5.1 Debe poder cargar una respuesta con su relación a la pregunta ('idPreguntas')", async () => {
      const user = await createAndSaveTestUser();
      const quiz = await createAndSaveTestQuiz(user);
      const question = await createAndSaveTestQuestion(quiz);
      const respuesta = await respuestaRepository.save({
        textoRespuesta: "Respuesta con relación",
        correcta: false,
        idPreguntas: question.id,
      });
      const respuestaWithRelation = await respuestaRepository.findOne({
        where: { id: respuesta.id, idPreguntas: respuesta.idPreguntas },
        relations: ["idPreguntas"],
      });
      expect(respuestaWithRelation).toHaveProperty("idPreguntas");
      expect(typeof respuestaWithRelation.idPreguntas).toBe("object");
      expect(respuestaWithRelation.idPreguntas).not.toBeNull();
      expect(respuestaWithRelation.idPreguntas.id).toBe(question.id);
    });
  });
});
