
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

const createValidUserData = (overrides = {}) => {
  const baseData = {
    nombreCompleto: "Usuario Integración",
    rut: "12345678-9",
    email: "usuario.integracion@ubiobio.cl",
    rol: "usuario",
    password: "passwordValido123",
  };
  return { ...baseData, ...overrides };
};

describe("[INTEGRACIÓN] Rutas /api/user", () => {

  let server;
  let createdUserId;

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
    // Eliminar primero los hijos, luego los padres
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
  const adminCredentials = {
    nombreCompleto: "Admin Test Integracion",
    rut: "99999991-9",
    email: "admin.integracion1@ubiobio.cl",
    rol: "administrador",
    password: "AdminTest1234",
  };

  beforeEach(async () => {
    await limpiarBaseDeDatos();
    // Crear admin siempre desde cero
    const userRepo = testDataSource.getRepository("User");
    const hashedPassword = await encryptPassword(adminCredentials.password);
    await userRepo.save({
      ...adminCredentials,
      password: hashedPassword,
    });

    const loginRes = await request(server)
      .post("/api/auth/login")
      .send({ email: adminCredentials.email, password: adminCredentials.password });
    if (!loginRes.body.data || !loginRes.body.data.token) {
      console.error("Error al iniciar sesión:", loginRes.body);
    }
    freshToken = loginRes.body.data?.token;
  });

  it("Debería crear un usuario correctamente", async () => {
    const userData = createValidUserData();
    const res = await request(server)
      .post("/api/user")
      .set("Authorization", `Bearer ${freshToken}`)
      .send(userData);
    expect(res.status).toBe(201);
    expect(res.body.data).toHaveProperty("id");
    expect(res.body.data.email).toBe(userData.email);
    createdUserId = res.body.data.id;
  });

  it("Debería obtener un usuario por ID", async () => {
    const userData = createValidUserData({ email: "get.usuario@ubiobio.cl", rut: "11111111-1" });
    const { body: createdRes } = await request(server)
      .post("/api/user")
      .set("Authorization", `Bearer ${freshToken}`)
      .send(userData);
    const created = createdRes.data;
    const userDb = await testDataSource.getRepository("User").findOneBy({ id: created.id });
    const res = await request(server)
      .get(`/api/user/detail/?id=${created.id}`)
      .set("Authorization", `Bearer ${freshToken}`)
      .expect(200);
    expect(res.body.data.email).toBe(userData.email);
  });

  it("Debería actualizar un usuario", async () => {
    const userData = createValidUserData({ email: "update.usuario@ubiobio.cl", rut: "22222222-2" });
    const { body: createdRes } = await request(server)
      .post("/api/user")
      .set("Authorization", `Bearer ${freshToken}`)
      .send(userData);
    const created = createdRes.data;
    const userDb = await testDataSource.getRepository("User").findOneBy({ id: created.id });
    const nuevosDatos = {
      nombreCompleto: "Nombre Actualizado",
      email: userData.email,
      rut: userData.rut,
      rol: userData.rol
    };
    const res = await request(server)
      .patch(`/api/user/detail/?id=${created.id}`)
      .set("Authorization", `Bearer ${freshToken}`)
      .send(nuevosDatos);
    expect(res.status).toBe(200);
    expect(res.body.data?.nombreCompleto).toBe(nuevosDatos.nombreCompleto);
  });

  it("Debería eliminar un usuario", async () => {
    const userData = createValidUserData({ email: "delete.usuario@ubiobio.cl", rut: "33333333-3" });
    const { body: createdRes } = await request(server)
      .post("/api/user")
      .set("Authorization", `Bearer ${freshToken}`)
      .send(userData);
    const created = createdRes.data;
    const userDb = await testDataSource.getRepository("User").findOneBy({ id: created.id });
    const resDelete = await request(server)
      .delete(`/api/user/detail/?id=${created.id}`)
      .set("Authorization", `Bearer ${freshToken}`);
    expect(resDelete.status).toBe(200);
    expect(resDelete.body.message).toMatch(/eliminado correctamente/i);
    await request(server)
      .get(`/api/user/detail/?id=${created.id}`)
      .set("Authorization", `Bearer ${freshToken}`)
      .expect(404);
  });

  it("Debería fallar al crear usuario con email duplicado", async () => {
    const userData = createValidUserData({ email: "duplicado@ubiobio.cl", rut: "44444444-4" });
    const res1 = await request(server)
      .post("/api/user")
      .set("Authorization", `Bearer ${freshToken}`)
      .send(userData);
    const res2 = await request(server)
      .post("/api/user")
      .set("Authorization", `Bearer ${freshToken}`)
      .send({ ...userData, rut: "55555555-5" });
    expect(res2.status).toBe(400);
  });

  it("Debería fallar al crear usuario con rut duplicado", async () => {
    const userData = createValidUserData({ email: "rut1@ubiobio.cl", rut: "66666666-6" });
    const res1 = await request(server)
      .post("/api/user")
      .set("Authorization", `Bearer ${freshToken}`)
      .send(userData);
    const res2 = await request(server)
      .post("/api/user")
      .set("Authorization", `Bearer ${freshToken}`)
      .send({ ...userData, email: "rut2@ubiobio.cl" });
    expect(res2.status).toBe(400);
  });
});
