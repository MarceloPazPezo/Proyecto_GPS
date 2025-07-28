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
          nombreCompleto: "Victor Manuel Lopez Galvez",
          rut: "20322376-5",
          email: "administrador@ubiobio.cl",
          password: await encryptPassword("admin1234"),
          rol: "administrador",
        }),
      ),
      userRepository.save(
        userRepository.create({
          nombreCompleto: "Diego Sebastián Ampuero Belmar",
          rut: "21151897-9",
          email: "usuario1.2024@ubiobio.cl",
          password: await encryptPassword("user1234"),
          rol: "usuario",
        })
      ),
        userRepository.save(
          userRepository.create({
            nombreCompleto: "Alexander Benjamín Marcelo Carrasco Fuentes",
            rut: "1500001-1",
            email: "usuario1@ubiobio.cl",
            password: await encryptPassword("user1234"),
            rol: "usuario",
          }),
      ),
      userRepository.save(
        userRepository.create({
          nombreCompleto: "Pablo Andrés Castillo Fernández",
          rut: "1500002-2",
          email: "usuario2@ubiobio.cl",
          password: await encryptPassword("user1234"),
          rol: "usuario",
        }),
      ),
      userRepository.save(
        userRepository.create({
          nombreCompleto: "Cristian Andrés Salazar Jara",
          rut: "20000001-1",
          email: "encargado1@ubiobio.cl",
          password: await encryptPassword("encargado1234"),
          rol: "encargado_carrera",
        }),
      ),
      userRepository.save(
        userRepository.create({
          nombreCompleto: "Marcelo Alfredo Paz Pezo",
          rut: "20000002-2",
          email: "encargado2@ubiobio.cl",
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
    const encargado = await userRepository.findOne({ where: { email: "encargado1@ubiobio.cl" } });
    if (!encargado) throw new Error("No se encontró el encargado de carrera");


    await Promise.all([
      carreraRepository.save(
        carreraRepository.create({
          nombre: "Arquitectura",
          codigo: "29001",
          descripcion: "Forma arquitectos comprometidos con la sociedad y el medio ambiente, capaces de resolver problemas arquitectónicos y urbanísticos mediante planificación, diseño, ejecución y fiscalización de obras sostenibles. Destaca por su formación integral, acreditaciones (RIBA, CNA), más de 50 años de historia como la escuela más antigua del sur de Chile, y ofrece salida intermedia como Técnico de Nivel Superior en Arquitectura.",
          departamento: "Facultad de Arquitectura, Construcción y Diseño",
          idEncargado: encargado.id
        })
      ),
      carreraRepository.save(
        carreraRepository.create({
          nombre: "Bachillerato en Ciencias (Concepción)",
          codigo: "29015",
          descripcion: "Programa de 2 años que ofrece una sólida base científica (Matemáticas, Física, Química, Biología) para definir intereses vocacionales y acceder a carreras UBB con mayor éxito. Otorga el grado de Bachiller en Ciencias, es flexible y compatible con todas las carreras semestrales. Cuenta con laboratorios modernos y docentes con posgrado e investigación.",
          departamento: "Facultad de Ciencias",
          idEncargado: encargado.id
        })
      ),
      carreraRepository.save(
        carreraRepository.create({
          nombre: "Contador Público y Auditor (Concepción)",
          codigo: "29045",
          descripcion: "Forma profesionales con perspectiva global para elaborar, analizar y controlar información financiera y tributaria, dominando técnicas de control de gestión con tecnología. Capacitados para desempeñarse en instituciones públicas, privadas o de forma independiente en contabilidad, auditoría y tributación. Ofrece salida intermedia como Técnico de Nivel Superior en Contabilidad.",
          departamento: "Facultad de Ciencias Empresariales",
          idEncargado: encargado.id
        })
      ),
      carreraRepository.save(
        carreraRepository.create({
          nombre: "Derecho",
          codigo: "29012",
          descripcion: "Forma abogados con conocimiento integral y actualizado del Derecho, desde una perspectiva multidisciplinaria y práctica. Prepara para protección de derechos, asesoría jurídica y representación judicial/extrajudicial. Destaca por su énfasis en economía, administración e informática. Otorga Licenciatura en Ciencias Jurídicas y el título de Abogado por la Corte Suprema.",
          departamento: "Facultad de Ciencias Empresariales",
          idEncargado: encargado.id
        })
      ),
      carreraRepository.save(
        carreraRepository.create({
          nombre: "Diseño Industrial",
          codigo: "29004",
          descripcion: "Forma diseñadores industriales creativos y críticos, con enseñanza basada en casos reales y talleres progresivos. Capacita para desarrollar propuestas diferenciadoras y prototipos, trabajando colaborativamente. Ofrece salida intermedia como Técnico Universitario en Diseño y Comunicación. Destaca por más de 26 años de liderazgo, docentes experimentados e infraestructura con talleres de prototipos y laboratorios digitales.",
          departamento: "Facultad de Arquitectura, Construcción y Diseño",
          idEncargado: encargado.id
        })
      ),
      carreraRepository.save(
        carreraRepository.create({
          nombre: "Ingeniería Civil",
          codigo: "29021",
          descripcion: "Forma ingenieros civiles para mejorar el bienestar social y el desarrollo del país, con énfasis en excelencia académica, trabajo en equipo y adaptabilidad. Ofrece formación rigurosa en ciencias básicas y de ingeniería para desarrollar obras de construcción sostenibles. Capacita para desempeñarse en sectores público y privado, incluyendo consultorías. Incluye práctica profesional obligatoria.",
          departamento: "Departamento de Ingeniería Civil y Ambiental",
          idEncargado: encargado.id
        })
      ),
      carreraRepository.save(
        carreraRepository.create({
          nombre: "Ingeniería Civil Eléctrica",
          codigo: "29029",
          descripcion: "Desarrolla competencias para diseñar, evaluar y proponer soluciones tecnológicas en generación, transmisión y distribución de energía eléctrica. Enfatiza el uso racional y eficiente de la energía en aplicaciones industriales, residenciales y comerciales. Prepara para integrarse en equipos multidisciplinarios, contribuyendo al desarrollo regional/nacional con eficiencia energética y respeto ambiental. Requiere aptitud en matemáticas y física.",
          departamento: "Departamento de Ingeniería Eléctrica y Electrónica",
          idEncargado: encargado.id
        })
      ),
      carreraRepository.save(
        carreraRepository.create({
          nombre: "Ingeniería Civil en Automatización",
          codigo: "29028",
          descripcion: "Forma ingenieros en automatización para optimizar la productividad con maquinaria, control y TI. Fomenta adaptabilidad y aprendizaje rápido. Ofrece sólida formación en ciencias básicas, ingeniería, electricidad y electrónica para proyectos de control automático y robótica. Capacita para aplicar normativas ambientales y adaptarse a cambios tecnológicos. Alta empleabilidad.",
          departamento: "Departamento de Ingeniería Eléctrica y Electrónica",
          idEncargado: encargado.id
        })
      ),
      carreraRepository.save(
        carreraRepository.create({
          nombre: "Ingeniería Civil en Informática (Concepción)",
          codigo: "29027",
          descripcion: "Forma profesionales con base científica y práctica en computación, informática y gestión para satisfacer necesidades de información. Currículo abarca ciencias básicas, ingeniería, sistemas, software, bases de datos y gestión informática. Egresados destacan por adaptabilidad, autoaprendizaje, responsabilidad social y trabajo en equipo. Ofrece salida intermedia como Técnico de Nivel Superior Analista Programador Computacional.",
          departamento: "Departamento de Ciencias de la Computación y Tecnologías de la Información",
          idEncargado: encargado.id
        })
      ),
      carreraRepository.save(
        carreraRepository.create({
          nombre: "Ingeniería Civil Industrial",
          codigo: "29020",
          descripcion: "Ofrece sólida formación en ciencias básicas, ingeniería y aplicación a la especialidad, potenciando trabajo colaborativo, responsabilidad social, aprendizaje, liderazgo y comunicación. Forma profesionales transdisciplinares para la gestión organizacional, análisis y establecimiento de sistemas de producción y administración. Destaca en formulación/evaluación de proyectos, modelación/simulación de sistemas y gestión de recursos.",
          departamento: "Departamento de Ingeniería Industrial",
          idEncargado: encargado.id
        })
      ),
      carreraRepository.save(
        carreraRepository.create({
          nombre: "Ingeniería Civil Mecánica",
          codigo: "29026",
          descripcion: "Forma ingenieros civiles mecánicos para desafíos en transformación de energía, industria de procesos y gestión de sistemas productivos. Desarrollan actitud crítica, optimizan recursos e integran equipos multidisciplinarios. Requiere interés en física y matemáticas, con vocación analítica y eficiente. Promueve respeto a la diversidad, trabajo colaborativo, innovación y excelencia. Incluye práctica profesional obligatoria.",
          departamento: "Departamento de Ingeniería Mecánica",
          idEncargado: encargado.id
        })
      ),
      carreraRepository.save(
        carreraRepository.create({
          nombre: "Ingeniería Civil Química",
          codigo: "29019",
          descripcion: "Prepara ingenieros para diseñar, implementar, operar y optimizar procesos industriales, contribuyendo al desarrollo y competitividad nacional. Destaca por su enfoque en problemáticas medioambientales y eficiencia energética, con compromiso ético. Capacita para trabajar en diversos sectores industriales y de servicios. Ofrece intercambio estudiantil y cuenta con cuerpo académico de excelencia.",
          departamento: "Departamento de Ingeniería Química",
          idEncargado: encargado.id
        })
      ),
      carreraRepository.save(
        carreraRepository.create({
          nombre: "Ingeniería Comercial (Concepción)",
          codigo: "29049",
          descripcion: "Forma profesionales con capacidades científico-técnicas en economía y administración para planificación, organización, dirección y control en unidades económicas. Ofrece sólida base en administración y economía, con énfasis en creación y gestión de empresas. Fomenta pensamiento crítico, análisis, colaboración, gestión de recursos, emprendimiento, innovación y responsabilidad social.",
          departamento: "Facultad de Ciencias Empresariales",
          idEncargado: encargado.id
        })
      ),
      carreraRepository.save(
        carreraRepository.create({
          nombre: "Ingeniería de Ejecución en Computación e Informática",
          codigo: "29037",
          descripcion: "Forma profesionales para dirección de proyectos, administración de unidades informáticas y desarrollo de software/sistemas de información. Plan de estudios renovado, adaptado a necesidades del mercado. Egresados son adaptables, autodidactas, socialmente responsables y trabajan en equipo. Ofrece salida intermedia como Técnico Universitario en Computación e Informática.",
          departamento: "Departamento de Ciencias de la Computación y Tecnologías de la Información",
          idEncargado: encargado.id
        })
      ),
      carreraRepository.save(
        carreraRepository.create({
          nombre: "Ingeniería Eléctrica",
          codigo: "29017",
          descripcion: "Forma ingenieros eléctricos con compromiso en aprendizaje, diversidad, responsabilidad social/ambiental y sostenibilidad energética. Competentes en diseño, evaluación y soluciones tecnológicas para generación, transmisión y distribución de energía eléctrica, con uso eficiente. Plan de estudios incluye dos especializaciones certificadas, promoviendo interdisciplinariedad y ventajas competitivas.",
          departamento: "Departamento de Ingeniería Eléctrica y Electrónica",
          idEncargado: encargado.id
        })
      ),
      carreraRepository.save(
        carreraRepository.create({
          nombre: "Ingeniería Electrónica",
          codigo: "29016",
          descripcion: "Forma profesionales en ingeniería electrónica para diagnosticar, operar y asegurar el funcionamiento de equipos y sistemas electrónicos en el sector productivo. Fomenta colaboración multidisciplinaria y respeto ambiental. El plan de estudios enfatiza la adaptabilidad a cambios tecnológicos, ofreciendo electivos para certificaciones y movilidad.",
          departamento: "Departamento de Ingeniería Eléctrica y Electrónica",
          idEncargado: encargado.id
        })
      ),
      carreraRepository.save(
        carreraRepository.create({
          nombre: "Ingeniería en Construcción",
          codigo: "29005",
          descripcion: "Forma ingenieros constructores para el desarrollo sostenible de infraestructura regional y nacional. Ofrece formación rigurosa en ciencias básicas y de ingeniería para decisiones en construcción sostenible. Incluye salida intermedia como Técnico Universitario en Construcción y articulación con posgrados. Plan de estudios renovado en 2015, basado en SCT, facilita pasantías nacionales e internacionales.",
          departamento: "Departamento de Ciencias de la Construcción",
          idEncargado: encargado.id
        })
      ),
      carreraRepository.save(
        carreraRepository.create({
          nombre: "Ingeniería Estadística",
          codigo: "29018",
          descripcion: "Forma profesionales en ciencia de datos y estadística aplicada para interpretar y explicar fenómenos con datos. Enfatiza interés en matemática, estadística, tratamiento de datos y recursos computacionales. Egresados aplican habilidades en práctica profesional, perfeccionando liderazgo en ciencia de datos. Plan de estudios renovado con créditos transferibles facilita movilidad. Pueden trabajar en diversas industrias y servicios.",
          departamento: "Departamento de Estadística",
          idEncargado: encargado.id
        })
      ),
      carreraRepository.save(
        carreraRepository.create({
          nombre: "Ingeniería Mecánica",
          codigo: "29033",
          descripcion: "Forma ingenieros mecánicos con enfoque en impacto social y ambiental, comprometidos con desarrollo sostenible. Destacan por aprendizaje continuo, respeto a la diversidad y responsabilidad social. Abordan desafíos en transformación energética, industrias de procesos y gestión de sistemas productivos, optimizando recursos en equipos multidisciplinarios. Plan incluye Seminario de Grado y electivos para certificaciones y movilidad.",
          departamento: "Departamento de Ingeniería Mecánica",
          idEncargado: encargado.id
        })
      ),
      carreraRepository.save(
        carreraRepository.create({
          nombre: "Trabajo Social (Concepción)",
          codigo: "29010",
          descripcion: "Forma trabajadores sociales que usan la investigación para interpretar fenómenos sociales complejos, contribuyendo al diseño, implementación y evaluación de políticas públicas desde derechos humanos y justicia social. Ofrece sólida formación en investigación social para comprender realidades y desarrollar estrategias de intervención. Requiere motivación para trabajo en terreno y contacto directo con personas, grupos e instituciones.",
          departamento: "Departamento de Ciencias Sociales",
          idEncargado: encargado.id
        })
      ),
      carreraRepository.save(
        carreraRepository.create({
          nombre: "Bachillerato en Ciencias (Chillán)",
          codigo: "29068",
          descripcion: "Programa de 2 años que brinda una sólida base científica (Matemáticas, Física, Química, Biología) para definir intereses vocacionales y acceder a carreras UBB con mayor éxito. Otorga el grado de Bachiller en Ciencias, es flexible y compatible con todas las carreras semestrales. Cuenta con laboratorios modernos y docentes con posgrado e investigación.",
          departamento: "Facultad de Ciencias",
          idEncargado: encargado.id
        })
      ),
      carreraRepository.save(
        carreraRepository.create({
          nombre: "Contador Público y Auditor (Chillán)",
          codigo: "29063",
          descripcion: "Forma profesionales con perspectiva global para comprender el contexto de entidades comerciales y estatales. Capacita para preparar, analizar y controlar información financiera y tributaria, dominando técnicas de control de gestión con apoyo tecnológico. Pueden trabajar en instituciones públicas, privadas o de forma independiente en contabilidad, auditoría y tributación. Ofrece salida intermedia como Técnico de Nivel Superior en Contabilidad.",
          departamento: "Facultad de Ciencias Empresariales",
          idEncargado: encargado.id
        })
      ),
      carreraRepository.save(
        carreraRepository.create({
          nombre: "Diseño Gráfico",
          codigo: "29064",
          descripcion: "Forma profesionales en Diseño Gráfico para configurar mensajes visuales innovadores. Destaca por su sólida formación en nuevas tecnologías de información y producción, y alta inserción laboral. Los egresados se actualizan constantemente, trabajan colaborativamente y valoran el diseño en ámbitos social, cultural y económico. Pueden desempeñarse en diversos medios, agencias, instituciones o emprender. Ofrece salida intermedia como Técnico Superior en Producción Gráfica.",
          departamento: "Departamento de Comunicación Visual",
          idEncargado: encargado.id
        })
      ),
      carreraRepository.save(
        carreraRepository.create({
          nombre: "Enfermería",
          codigo: "29052",
          descripcion: "Forma profesionales de Enfermería con sólidos conocimientos científicos y humanísticos para proporcionar cuidados integrales y humanizados en todas las etapas del ciclo de vida (promoción, prevención, recuperación, rehabilitación y cuidados paliativos). Prepara para liderar la gestión de cuidados con ética y responsabilidad social, y contribuir a la investigación. Incluye prácticas clínicas tempranas en diversos entornos de salud.",
          departamento: "Departamento de Enfermería",
          idEncargado: encargado.id
        })
      ),
      carreraRepository.save(
        carreraRepository.create({
          nombre: "Fonoaudiología",
          codigo: "29055",
          descripcion: "Forma fonoaudiólogos competentes e integrales para responder a necesidades regionales/nacionales. Promueven, previenen, evalúan, diagnostican e intervienen en alteraciones audio-vestibulares, habla, deglución, lenguaje y voz. Actúan con ética y compromiso social, contribuyendo a la investigación. Pueden desempeñarse en salud, educación, campos artísticos y práctica privada.",
          departamento: "Departamento de Fonoaudiología",
          idEncargado: encargado.id
        })
      ),
      carreraRepository.save(
        carreraRepository.create({
          nombre: "Ingeniería Civil en Informática (Chillán)",
          codigo: "29057",
          descripcion: "Forma profesionales con base científica y práctica en computación, informática y gestión para satisfacer necesidades de información. Currículo abarca ciencias básicas, ingeniería, sistemas, software, bases de datos y gestión informática. Egresados destacan por adaptabilidad, autoaprendizaje, responsabilidad social y trabajo en equipo. Ofrece salida intermedia como Técnico Superior Analista Programador Computacional. Cuenta con Grupo de Robótica en Campus Chillán.",
          departamento: "Departamento de Ciencias de la Computación y Tecnologías de la Información",
          idEncargado: encargado.id
        })
      ),
      carreraRepository.save(
        carreraRepository.create({
          nombre: "Ingeniería Comercial (Chillán)",
          codigo: "29059",
          descripcion: "Forma profesionales con capacidades científico-técnicas en economía y administración para planificación, organización, dirección y control en unidades económicas. Ofrece sólida base en administración y economía, con énfasis en creación y gestión de empresas. Fomenta pensamiento crítico, análisis, colaboración, gestión de recursos, emprendimiento, innovación y responsabilidad social.",
          departamento: "Departamento de Economía y Finanzas",
          idEncargado: encargado.id
        })
      ),
      carreraRepository.save(
        carreraRepository.create({
          nombre: "Ingeniería en Alimentos",
          codigo: "29051",
          descripcion: "Forma profesionales con sólidos conocimientos en matemáticas, biología y química para la ciencia e ingeniería de alimentos. Capacita para diseñar, gestionar y optimizar procesos de transformación y conservación de alimentos, enfrentando innovaciones científico-tecnológicas. Fomenta habilidades analíticas, trabajo en equipo e investigación. Los graduados pueden trabajar en producción, calidad, gestión, I+D o academia.",
          departamento: "Departamento de Ingeniería en Alimentos",
          idEncargado: encargado.id
        })
      ),
      carreraRepository.save(
        carreraRepository.create({
          nombre: "Ingeniería en Recursos Naturales",
          codigo: "29069",
          descripcion: "Programa de 10 semestres que ofrece sólida base científica y formación profesional en gestión sostenible de recursos naturales. Incluye ciencias básicas, formación profesional, extracurricular y electivos. Egresados se distinguen por compromiso con aprendizaje, responsabilidad social y capacidad de integrar equipos para soluciones ambientales innovadoras. Pueden trabajar en sector público/privado y articular con posgrado.",
          departamento: "Departamento de Ciencias Básicas",
          idEncargado: encargado.id
        })
      ),
      carreraRepository.save(
        carreraRepository.create({
          nombre: "Medicina",
          codigo: "29065",
          descripcion: "Forma médicos de excelencia con alto sentido de responsabilidad social, comprometidos con la salud en Ñuble y el país, bajo un modelo biopsicosocial. Prepara para aprendizaje continuo, investigación, desarrollo e innovación en ciencias médicas. Otorga título de Médico Cirujano/a y Licenciatura en Medicina. Capacita para desempeñarse en sectores público y privado, rural y urbano.",
          departamento: "Departamento de Medicina",
          idEncargado: encargado.id
        })
      ),
      carreraRepository.save(
        carreraRepository.create({
          nombre: "Nutrición y Dietética",
          codigo: "29054",
          descripcion: "Forma profesionales en nutrición y dietética, competentes en el ámbito alimentario-nutricional. Capacita para intervenciones, programas educativos, gestión de planes y desarrollo científico para innovar. Ofrece formación en atención en salud, gestión, educación y ciencia. Pueden trabajar en nutrición clínica, comunitaria e institucional. Incluye electivos de certificación y articulación con Magíster en Salud Pública.",
          departamento: "Departamento de Nutrición y Dietética",
          idEncargado: encargado.id
        })
      ),
      carreraRepository.save(
        carreraRepository.create({
          nombre: "Pedagogía en Castellano y Comunicación",
          codigo: "29072",
          descripcion: "Forma profesionales para valorar, usar y enseñar el castellano creativa y adecuadamente. Ofrece sólida formación en ámbitos pedagógico, literario, lingüístico, estético y comunicacional, adaptándose a contextos chilenos. Egresados son competentes en lengua materna, promoviendo su aprendizaje como identidad cultural y medio de comunicación/producción literaria. Aplican TIC e investigación. Acreditada, con 47 años de experiencia.",
          departamento: "Departamento de Artes y Letras",
          idEncargado: encargado.id
        })
      ),
      carreraRepository.save(
        carreraRepository.create({
          nombre: "Pedagogía en Ciencias Naturales mención Biología o Física o Química",
          codigo: "29073",
          descripcion: "Forma profesores de educación media en Ciencias Naturales (Biología, Física o Química) con sólida formación disciplinar y pedagógica. Capacita para desempeñarse en diversos contextos educativos, alineados con políticas nacionales. Plan de estudios renovado en 2022, basado en competencias. Ofrece vinculación temprana con escuelas desde el segundo año. Egresados pueden ejercer en entornos educativos y centros de investigación.",
          departamento: "Departamento de Ciencias de la Educación",
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