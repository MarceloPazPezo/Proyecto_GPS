import { vi, describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import { testDataSource } from "../../src/config/configDbTest.js";
import { encryptPassword } from "../../src/helpers/bcrypt.helper.js";
vi.mock("../../src/config/configDb.js", () => ({
  AppDataSource: testDataSource
}));
vi.mock("../../src/config/configEnv.js", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    ACCESS_TOKEN_SECRET: "este-es-un-secreto-para-pruebas-consistente",
  };
});
import request from "supertest";
import app from "../../src/app.js";

const adminCredentials = {
  nombreCompleto: "Admin Test Integracion",
  rut: "99999992-9",
  email: "admin.integracion2@ubiobio.cl",
  rol: "administrador",
  password: "AdminTest1234",
};

// const createValidQuizData = (overrides = {}) => ({
//   nombre: "Cuestionario Integración",
//   descripcion: "Un cuestionario de prueba",
//   idUser: 1, // Se ajusta luego con el id real
//   ...overrides,
// });

describe("[INTEGRACIÓN] Rutas /api/cuestionario", () => {
  let server;
  let userId;


  // Elimina en orden inverso de dependencias para evitar errores de FK
  const limpiarBaseDeDatos = async () => {
    const entities = [
      "Compartido", // depende de User, Mural, Sesion, Cuestionario
      "Sesion",     // depende de User, Mural
      "Mural",      // depende de User
      "Cuestionario", // depende de User
      "Carrera",    // puede ser padre de User
      "User"        // padre de casi todo
    ];
    for (const entity of entities) {
      await testDataSource.getRepository(entity).delete({});
    }
  };

  beforeAll(async () => {
    await testDataSource.initialize();
    server = app.listen(0);
  });

  afterAll(async () => {
    await testDataSource.destroy();
    server.close();
  });

  let freshToken;
  beforeEach(async () => {
    await limpiarBaseDeDatos();
    // Crear admin y obtener token
    const userRepo = testDataSource.getRepository("User");
    const hashedPassword = await encryptPassword(adminCredentials.password);
    const admin = await userRepo.save({
      ...adminCredentials,
      password: hashedPassword,
    });
    userId = admin.id;
    const loginRes = await request(server)
      .post("/api/auth/login")
      .send({ email: adminCredentials.email, password: adminCredentials.password });
    freshToken = loginRes.body.data?.token;
  });

  it("Debería crear un cuestionario correctamente", async () => {
    const quizData = { nombre: "alvssdasdad", idUser: userId };
    const res = await request(server)
      .post("/api/quiz")
      .set("Authorization", `Bearer ${freshToken}`)
      .send(quizData);
    expect(res.status).toBe(201);
    expect(res.body.data).toHaveProperty("id");
    expect(res.body.data.nombre).toBe(quizData.nombre);
  });

  it("Debería obtener los cuestionarios de un usuario", async () => {
    const quizData = { nombre: "alvssdasdad", idUser: userId };
    const createRes = await request(server)
      .post("/api/quiz")
      .set("Authorization", `Bearer ${freshToken}`)
      .send(quizData);
    const res = await request(server)
      .get(`/api/quiz/user/${userId}`)
      .set("Authorization", `Bearer ${freshToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data[0].idUser).toBe(userId);
  });

  it("Debería actualizar un cuestionario", async () => {
    const quizData = { nombre: "alvssdasdad", idUser: userId };
    const createRes = await request(server)
      .post("/api/quiz")
      .set("Authorization", `Bearer ${freshToken}`)
      .send(quizData);
    if (createRes.status !== 201) {
      console.log("[TEST][Actualizar cuestionario][Creación] status:", createRes.status, "body:", createRes.body);
    }
    const quizId = Number(createRes.body.data?.id);
    const nuevosDatos = { nombre: "Nuevo Nombre", idUser: Number(userId) };
    const res = await request(server)
      .patch(`/api/quiz?id=${quizId}`)
      .set("Authorization", `Bearer ${freshToken}`)
      .send(nuevosDatos);
    if (res.status !== 200) {
      console.log("[TEST][Actualizar cuestionario] status:", res.status, "body:", res.body);
    }
    expect(res.status).toBe(200);
    expect(res.body.data.nombre).toBe("Nuevo Nombre");
  });

  it("Debería eliminar un cuestionario", async () => {
    const quizData = { nombre: "alvssdasdad", idUser: userId };
    const createRes = await request(server)
      .post("/api/quiz")
      .set("Authorization", `Bearer ${freshToken}`)
      .send(quizData);
    if (createRes.status !== 201) {
      console.log("[TEST][Eliminar cuestionario][Creación] status:", createRes.status, "body:", createRes.body);
    }
    const quizId = createRes.body.data?.id;
    const res = await request(server)
      .delete("/api/quiz")
      .set("Authorization", `Bearer ${freshToken}`)
      .send({ id: quizId });
    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/eliminado/i);
  });

  it("Debería agregar preguntas en lote a un cuestionario", async () => {
    const quizData = { nombre: "alvssdasdad", idUser: userId };
    const createRes = await request(server)
      .post("/api/quiz")
      .set("Authorization", `Bearer ${freshToken}`)
      .send(quizData);
    const quizId = createRes.body.data?.id;
    const preguntasLote = [
      {
        texto: "¿Cuál es la capital de Francia?",
        Respuestas: [
          { textoRespuesta: "París", correcta: true },
          { textoRespuesta: "Londres", correcta: false },
          { textoRespuesta: "Madrid", correcta: false }
        ]
      },
      {
        texto: "¿Cuánto es 2 + 2?",
        Respuestas: [
          { textoRespuesta: "3", correcta: false },
          { textoRespuesta: "4", correcta: true },
          { textoRespuesta: "5", correcta: false }
        ]
      }
    ];
    const res = await request(server)
      .post(`/api/quiz/addLote/${quizId}`)
      .set("Authorization", `Bearer ${freshToken}`)
      .send(preguntasLote);
    expect([200,201]).toContain(res.status);
    expect(res.body.message).toBe("Preguntas y respuestas añadidas exitosamente");
  });

  it("Debería obtener preguntas y respuestas de un cuestionario", async () => {
    const quizData = { nombre: "alvssdasdad", idUser: userId };
    const createRes = await request(server)
      .post("/api/quiz")
      .set("Authorization", `Bearer ${freshToken}`)
      .send(quizData);
    const quizId = createRes.body.data?.id;
    // Agregar preguntas primero
    const preguntasLote = [
      {
        texto: "¿Cuál es la capital de Francia?",
        Respuestas: [
          { textoRespuesta: "París", correcta: true },
          { textoRespuesta: "Londres", correcta: false },
          { textoRespuesta: "Madrid", correcta: false }
        ]
      },
      {
        texto: "¿Cuánto es 2 + 2?",
        Respuestas: [
          { textoRespuesta: "3", correcta: false },
          { textoRespuesta: "4", correcta: true },
          { textoRespuesta: "5", correcta: false }
        ]
      }
    ];
    await request(server)
      .post(`/api/quiz/addLote/${quizId}`)
      .set("Authorization", `Bearer ${freshToken}`)
      .send(preguntasLote);
    // Obtener preguntas y respuestas
    const res = await request(server)
      .get(`/api/quiz/lote/${quizId}`)
      .set("Authorization", `Bearer ${freshToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });
});
