"use strict";
import User from "../entity/user.entity.js";
import Carrera from "../entity/carrera.entity.js";
import Mural from "../entity/mural.entity.js";
import Notas from "../entity/stickyNotes.entity.js";
import { AppDataSource } from "./configDb.js";
import { encryptPassword } from "../helpers/bcrypt.helper.js";

async function createUsers() {
  try {
    const userRepository = AppDataSource.getRepository(User);

    const count = await userRepository.count();
    if (count > 0) return;

    await Promise.all([
      userRepository.save(
        userRepository.create({
          nombreCompleto: "Diego Alexis Salazar Jara",
          rut: "21308770-3",
          email: "administrador2024@gmail.cl",
          password: await encryptPassword("admin1234"),
          rol: "administrador",
        }),
      ),
      userRepository.save(
        userRepository.create({
          nombreCompleto: "Diego Sebastián Ampuero Belmar",
          rut: "21151897-9",
          email: "usuario1.2024@gmail.cl",
          password: await encryptPassword("user1234"),
          rol: "usuario",
        })
      ),
        userRepository.save(
          userRepository.create({
            nombreCompleto: "Alexander Benjamín Marcelo Carrasco Fuentes",
            rut: "20630735-8",
            email: "usuario2.2024@gmail.cl",
            password: await encryptPassword("user1234"),
            rol: "usuario",
          }),
      ),
      userRepository.save(
        userRepository.create({
          nombreCompleto: "Pablo Andrés Castillo Fernández",
          rut: "20738450-K",
          email: "usuario3.2024@gmail.cl",
          password: await encryptPassword("user1234"),
          rol: "usuario",
        }),
      ),
      userRepository.save(
        userRepository.create({
          nombreCompleto: "Felipe Andrés Henríquez Zapata",
          rut: "20976635-3",
          email: "usuario4.2024@gmail.cl",
          password: await encryptPassword("user1234"),
          rol: "usuario",
        }),
      ),
      userRepository.save(
        userRepository.create({
          nombreCompleto: "Diego Alexis Meza Ortega",
          rut: "21172447-1",
          email: "usuario5.2024@gmail.cl",
          password: await encryptPassword("user1234"),
          rol: "usuario",
        }),
      ),
      userRepository.save(
        userRepository.create({
          nombreCompleto: "Juan Pablo Rosas Martin",
          rut: "20738415-1",
          email: "usuario6.2024@gmail.cl",
          password: await encryptPassword("user1234"),
          rol: "usuario",
        }),
      ),
      userRepository.save(
        userRepository.create({
          nombreCompleto: "Cristian Andrés Salazar Jara",
          rut: "21000000-3",
          email: "encargado1.2025@ubiobio.cl",
          password: await encryptPassword("encargado1234"),
          rol: "encargado_carrera",
        }),
      ),
    ]);
    console.log("* => Usuarios creados exitosamente");
  } catch (error) {
    console.error("Error al crear usuarios:", error);
  }
}

async function createCarreras() {
  try {
    const carreraRepository = AppDataSource.getRepository(Carrera);
    const userRepository = AppDataSource.getRepository(User);
    const count = await carreraRepository.count();
    if (count > 0) return;

    // Buscar el encargado por email
    const encargado = await userRepository.findOne({ where: { email: "encargado1.2025@ubiobio.cl" } });
    if (!encargado) throw new Error("No se encontró el encargado de carrera");


    await Promise.all([
      carreraRepository.save(
        carreraRepository.create({
          nombre: "Ingeniería Civil Informática",
          codigo: "29027",
          descripcion: "La carrera que forma a los arquitectos del software y los magos de la tecnología.",
          departamento: "Departamento de Informática y Computación",
          idEncargado: encargado.id
        })
      ),
      carreraRepository.save(
        carreraRepository.create({
          nombre: "Ingeniería Civil Industrial",
          codigo: "IND-UUBB-2",
          descripcion: "Donde nacen los líderes de la gestión y la optimización de procesos.",
          departamento: "Departamento de Ingeniería Industrial",
          idEncargado: encargado.id
        })
      ),
      carreraRepository.save(
        carreraRepository.create({
          nombre: "Ingeniería Comercial",
          codigo: "COM-UUBB-3",
          descripcion: "La cuna de los estrategas del mundo empresarial y financiero.",
          departamento: "Departamento de Ciencias Empresariales",
          idEncargado: encargado.id
        })
      ),
      carreraRepository.save(
        carreraRepository.create({
          nombre: "Ingeniería en Ejecución Mecánica",
          codigo: "MEC-UUBB-4",
          descripcion: "Donde la fuerza y la precisión se unen para crear el futuro.",
          departamento: "Departamento de Ingeniería Mecánica",
          idEncargado: encargado.id
        })
      ),
      carreraRepository.save(
        carreraRepository.create({
          nombre: "Ingeniería en Construcción",
          codigo: "CON-UUBB-5",
          descripcion: "Formando a los constructores de sueños y ciudades.",
          departamento: "Departamento de Ingeniería Civil y Construcción",
          idEncargado: encargado.id
        })
      ),
    ]);
    console.log(`* => Carreras asociadas a ${encargado.nombreCompleto}`);
  } catch (error) {
    console.error("Error al crear carreras:", error);
  }
}

async function createtutor() {
  const userRepository = AppDataSource.getRepository(User);
  const carreraRepository = AppDataSource.getRepository(Carrera);
    const carrera = await carreraRepository.findOne({ where: { codigo: "29027" } });
    if (!carrera) throw new Error("No se encontró la carrera");

  const usuario = await userRepository.findOne({ where: { email: "tutor2025@ubiobio.cl" } });
    if (usuario) return;

    await Promise.all([
      userRepository.save(
        userRepository.create({
          nombreCompleto: "Martin Fuenzalida",
          rut: "21312050-6",
          email: "tutor2025@ubiobio.cl",
          password: await encryptPassword("tutor1234"),
          rol: "tutor",
          idCarrera: carrera.id
        }),
      )
    ]);
}

async function createMural() {
  const muralRepository = AppDataSource.getRepository(Mural);
  const userRepository = AppDataSource.getRepository(User);
  const count = await muralRepository.count();
    if (count > 0) return;

  const usuario = await userRepository.findOne({ where: { email: "tutor2025@ubiobio.cl" } });
  if (!usuario) throw new Error("No se encontró el usuario");

  await Promise.all([
    muralRepository.save(
      muralRepository.create({
        titulo: "Gente de confianza",
        idUser: usuario.id
      })
    )
  ]);
}

async function createNotas() {
  const muralRepository = AppDataSource.getRepository(Mural);
  const notasRepository = AppDataSource.getRepository(Notas);
  const count = await notasRepository.count();
    if(count > 0) return;

    const mural = await muralRepository.findOne({ where: { titulo: "Gente de confianza" } });
    if (!mural) throw new Error("No se encontró el mural");
  
    await Promise.all([
      notasRepository.save(
        notasRepository.create({
          titulo: "Mi familia",
          descripcion: "Ellos siempre han estado ahi",
          color: "#bbf7d0",
          posx: 0.6000061035156,
          posy: 274.7999572753906,
          idMural: mural.id
        }),  
      ),
      notasRepository.save(
        notasRepository.create({
          titulo: "Mi amigos",
          descripcion: "jp, marcelo, jerson, nico, basti",
          color: "#ddd6fe",
          posx: 0,
          posy: 0,
          idMural: mural.id
        }),  
      ),
      notasRepository.save(
        notasRepository.create({
          titulo: "Mi mascota",
          descripcion: "Mi perrito que se llama copito y es blanco",
          color: "#fca5a5",
          posx: 212,
          posy: 369,
          idMural: mural.id
        }),  
      ),
    ])
}
export { createUsers, createCarreras, createtutor, createMural, createNotas };