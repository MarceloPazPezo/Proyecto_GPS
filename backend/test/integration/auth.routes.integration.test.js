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
  rut: "99999990-9",
  email: "admin.integracion0@ubiobio.cl",
  rol: "administrador",
  password: "AdminTest1234",
};

describe("[INTEGRACIÓN] Rutas /api/auth", () => {
  let server;
  let adminToken;


  const limpiarBaseDeDatos = async () => {
    const entities = [
      "Compartido",
      "Sesion",
      "Mural",
      "Cuestionario",
      "Carrera",
      "User"
    ];
    for (const entity of entities) {
      await testDataSource.getRepository(entity).delete({});
    }
  };

  beforeAll(async () => {
    await testDataSource.initialize();
    server = app.listen(0);
  });

  beforeEach(async () => {
    await limpiarBaseDeDatos();
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
      console.error("[AUTH TEST] Error al iniciar sesión:", loginRes.body);
    }
    adminToken = loginRes.body.data?.token;
  });

  it("Debería iniciar sesión correctamente con credenciales válidas", async () => {
    const res = await request(server)
      .post("/api/auth/login")
      .send({ email: adminCredentials.email, password: adminCredentials.password });
    // console.log("[AUTH TEST][Login válido] status:", res.status, "body:", res.body);
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty("token");
  });

  it("Debería fallar al iniciar sesión con contraseña incorrecta", async () => {
    const res = await request(server)
      .post("/api/auth/login")
      .send({ email: adminCredentials.email, password: "incorrecta" });
    // console.log("[AUTH TEST][Login pass incorrecta] status:", res.status, "body:", res.body);
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Error iniciando sesión");
  });

  it("Debería fallar al iniciar sesión con email inexistente", async () => {
    const res = await request(server)
      .post("/api/auth/login")
      .send({ email: "noexiste@ubiobio.cl", password: "algoalgo" });
    // console.log("[AUTH TEST][Login email inexistente] status:", res.status, "body:", res.body);
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Error iniciando sesión");
  });
});
