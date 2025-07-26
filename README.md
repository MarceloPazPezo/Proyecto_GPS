# 📚 API REST - Sistema de Gestión de Tutorías GPS

- [📚 API REST - Sistema de Gestión de Tutorías GPS](#-api-rest---sistema-de-gestión-de-tutorías-gps)
  - [🏗️ Arquitectura del Proyecto](#️-arquitectura-del-proyecto)
    - [**Estructura General**](#estructura-general)
    - [**Backend - Arquitectura MVC**](#backend---arquitectura-mvc)
  - [🚀 Instalación y Configuración](#-instalación-y-configuración)
    - [**Prerrequisitos**](#prerrequisitos)
    - [**Configuración del Entorno**](#configuración-del-entorno)
  - [🔐 Autenticación y Autorización](#-autenticación-y-autorización)
    - [**Sistema de Roles**](#sistema-de-roles)
    - [**WebSockets y Tiempo Real**](#websockets-y-tiempo-real)
    - [**Autenticación JWT**](#autenticación-jwt)
  - [📋 API REST - Documentación Completa](#-api-rest---documentación-completa)
    - [**Formato de Respuestas**](#formato-de-respuestas)
      - [✅ **Respuesta Exitosa**](#-respuesta-exitosa)
      - [❌ **Error del Cliente (4xx)**](#-error-del-cliente-4xx)
      - [🔥 **Error del Servidor (5xx)**](#-error-del-servidor-5xx)
  - [🔑 1. AUTENTICACIÓN (`/auth`)](#-1-autenticación-auth)
    - [**POST `/auth/login`**](#post-authlogin)
    - [**POST `/auth/logout`**](#post-authlogout)
  - [👥 2. GESTIÓN DE USUARIOS (`/user`)](#-2-gestión-de-usuarios-user)
    - [**GET `/user/`**](#get-user)
    - [**POST `/user/`** 🔒 *Administrador*](#post-user--administrador)
    - [**GET `/user/detail/`** 🔒 *Administrador*](#get-userdetail--administrador)
    - [**PATCH `/user/detail/`** 🔒 *Administrador*](#patch-userdetail--administrador)
    - [**DELETE `/user/detail/`** 🔒 *Administrador*](#delete-userdetail--administrador)
    - [**POST `/user/import`** 🔒 *Administrador*](#post-userimport--administrador)
    - [**Rutas para Encargados de Carrera (`/user/mis-usuarios`)** 🔒](#rutas-para-encargados-de-carrera-usermis-usuarios-)
      - [**GET `/user/mis-usuarios`**](#get-usermis-usuarios)
      - [**POST `/user/mis-usuarios`**](#post-usermis-usuarios)
      - [**GET `/user/mis-usuarios/detail/`**](#get-usermis-usuariosdetail)
      - [**PATCH `/user/mis-usuarios/detail/`**](#patch-usermis-usuariosdetail)
      - [**DELETE `/user/mis-usuarios/detail/`**](#delete-usermis-usuariosdetail)
      - [**POST `/user/mis-usuarios/import`**](#post-usermis-usuariosimport)
  - [🎓 3. GESTIÓN DE CARRERAS (`/carrera`)](#-3-gestión-de-carreras-carrera)
    - [**GET `/carrera/`**](#get-carrera)
    - [**POST `/carrera/`** 🔒 *Administrador*](#post-carrera--administrador)
    - [**GET `/carrera/detail/`** 🔒 *Administrador*](#get-carreradetail--administrador)
    - [**PATCH `/carrera/detail/`** 🔒 *Administrador*](#patch-carreradetail--administrador)
    - [**DELETE `/carrera/detail/`** 🔒 *Administrador*](#delete-carreradetail--administrador)
    - [**POST `/carrera/import`** 🔒 *Administrador*](#post-carreraimport--administrador)
    - [**GET `/carrera/encargado/`** 🔒 *Encargado de Carrera*](#get-carreraencargado--encargado-de-carrera)
  - [📝 4. GESTIÓN DE CUESTIONARIOS (`/quiz`)](#-4-gestión-de-cuestionarios-quiz)
    - [**GET `/quiz/`**](#get-quiz)
    - [**POST `/quiz/`**](#post-quiz)
    - [**GET `/quiz/user/:idUser`**](#get-quizuseriduser)
    - [**GET `/quiz/all`**](#get-quizall)
    - [**PATCH `/quiz/`**](#patch-quiz)
    - [**DELETE `/quiz/`**](#delete-quiz)
    - [**POST `/quiz/addLote/:idCuestionario`**](#post-quizaddloteidcuestionario)
    - [**GET `/quiz/lote/:idCuestionario`**](#get-quizloteidcuestionario)
    - [**PATCH `/quiz/lote/:idCuestionario`**](#patch-quizloteidcuestionario)
  - [❓ 5. GESTIÓN DE PREGUNTAS (`/preguntas`)](#-5-gestión-de-preguntas-preguntas)
    - [**GET `/preguntas/cuestionario/:idCuestionario`**](#get-preguntascuestionarioidcuestionario)
    - [**GET `/preguntas/:id`**](#get-preguntasid)
    - [**POST `/preguntas/`**](#post-preguntas)
    - [**PATCH `/preguntas/update/:id`**](#patch-preguntasupdateid)
    - [**DELETE `/preguntas/del/:id`**](#delete-preguntasdelid)
  - [✅ 6. GESTIÓN DE RESPUESTAS (`/respuestas`)](#-6-gestión-de-respuestas-respuestas)
    - [**GET `/respuestas/:id`**](#get-respuestasid)
    - [**GET `/respuestas/pregunta/:idPreguntas`**](#get-respuestaspreguntaidpreguntas)
    - [**POST `/respuestas/`**](#post-respuestas)
    - [**PATCH `/respuestas/update/:id`**](#patch-respuestasupdateid)
    - [**DELETE `/respuestas/del/:id`**](#delete-respuestasdelid)
    - [**POST `/respuestas/addLotepRespuestas`**](#post-respuestasaddloteprespuestas)
  - [🖇️ 7. CONTENIDO COMPARTIDO (`/share`)](#️-7-contenido-compartido-share)
    - [**GET `/share/:idUser`**](#get-shareiduser)
    - [**GET `/share/get/`**](#get-shareget)
    - [**POST `/share/`**](#post-share)
    - [**DELETE `/share/`**](#delete-share)
  - [📊 8. EXPLORACIÓN (`/EX`)](#-8-exploración-ex)
    - [**GET `/EX/quizzes/:idUser`**](#get-exquizzesiduser)
  - [🗂️ 9. GESTIÓN DE MURALES (`/mural`)](#️-9-gestión-de-murales-mural)
    - [**POST `/mural/crearMural`**](#post-muralcrearmural)
    - [**GET `/mural/muralUsuario/:idUser`**](#get-muralmuralusuarioiduser)
    - [**GET `/mural/:id`**](#get-muralid)
    - [**PUT `/mural/:id`**](#put-muralid)
    - [**DELETE `/mural/:id`**](#delete-muralid)
    - [**PUT `/mural/save/:idMural`**](#put-muralsaveidmural)
  - [📋 10. GESTIÓN DE NOTAS ADHESIVAS (`/notas`)](#-10-gestión-de-notas-adhesivas-notas)
    - [**POST `/notas/crearNota`**](#post-notascrearnota)
    - [**GET `/notas/mural/:idMural`**](#get-notasmuralidmural)
    - [**GET `/notas/nota/:idNote`**](#get-notasnotaidnote)
    - [**PUT `/notas/:id`**](#put-notasid)
    - [**DELETE `/notas/:id`**](#delete-notasid)
  - [🌐 11. FUNCIONALIDADES WEBSOCKET (Socket.IO)](#-11-funcionalidades-websocket-socketio)
    - [**Configuración del Cliente**](#configuración-del-cliente)
    - [**Eventos de Salas**](#eventos-de-salas)
      - [**Crear Sala**](#crear-sala)
      - [**Unirse a Sala**](#unirse-a-sala)
      - [**Iniciar Actividad**](#iniciar-actividad)
    - [**Eventos de Quiz en Tiempo Real**](#eventos-de-quiz-en-tiempo-real)
      - [**Enviar Pregunta**](#enviar-pregunta)
      - [**Recibir Respuesta**](#recibir-respuesta)
    - [**Eventos de Pizarra de Ideas**](#eventos-de-pizarra-de-ideas)
      - [**Enviar Idea**](#enviar-idea)
      - [**Control de Timer**](#control-de-timer)
    - [**Eventos de Notas Adhesivas**](#eventos-de-notas-adhesivas)
      - [**Crear Nota**](#crear-nota)
      - [**Actualizar Nota**](#actualizar-nota)
      - [**Mover Nota**](#mover-nota)
      - [**Eliminar Nota**](#eliminar-nota)
    - [**Eventos del Servidor**](#eventos-del-servidor)
      - [**Escuchar Conexiones**](#escuchar-conexiones)
  - [🛠️ 12. GESTIÓN DE SESIONES (`/sesion`)](#️-12-gestión-de-sesiones-sesion)
    - [**Servicios Disponibles**](#servicios-disponibles)
      - [**Crear Sesión**](#crear-sesión)
      - [**Obtener Sesión**](#obtener-sesión)
      - [**Obtener Todas las Sesiones**](#obtener-todas-las-sesiones)
  - [🛡️ Middlewares de Seguridad](#️-middlewares-de-seguridad)
    - [**`authenticateJwt`**](#authenticatejwt)
    - [**`authorizeRoles(...roles)`**](#authorizerolesroles)
    - [**`upload.single('campo')` / `upload.any()`**](#uploadsinglecampo--uploadany)
  - [📁 Almacenamiento de Archivos](#-almacenamiento-de-archivos)
    - [**MinIO Configuration**](#minio-configuration)
    - [**Estructura de URLs**](#estructura-de-urls)
  - [🧪 Testing](#-testing)
    - [**Scripts disponibles**](#scripts-disponibles)
    - [**Estructura de tests**](#estructura-de-tests)
  - [🔧 Configuración de Desarrollo](#-configuración-de-desarrollo)
    - [**Scripts NPM**](#scripts-npm)
    - [**Variables de Entorno**](#variables-de-entorno)
  - [🚨 Problemas Conocidos y Mejoras Pendientes](#-problemas-conocidos-y-mejoras-pendientes)
    - [**Seguridad**](#seguridad)
    - [**Funcionalidades Pendientes**](#funcionalidades-pendientes)
    - [**Mejoras Sugeridas**](#mejoras-sugeridas)
  - [📞 Soporte y Contribución](#-soporte-y-contribución)
    - [**Autor**](#autor)
    - [**Contribuir**](#contribuir)
  - [📄 Licencia](#-licencia)
  - [🔗 Enlaces Útiles](#-enlaces-útiles)


## 🏗️ Arquitectura del Proyecto

### **Estructura General**
```
📁 Proyecto_GPS/
├── 📁 backend/          # API REST en Node.js/Express
├── 📁 frontend/         # Aplicación React
├── 📄 docker-compose.yml
└── 📄 README.md
```

### **Backend - Arquitectura MVC**
```
📁 backend/src/
├── 📁 controllers/      # Lógica de controladores
├── 📁 services/        # Lógica de negocio
├── 📁 entity/          # Entidades TypeORM
├── 📁 routes/          # Definición de rutas
├── 📁 middlewares/     # Middlewares de autenticación/autorización
├── 📁 validations/     # Esquemas de validación Joi
├── 📁 handlers/        # Manejadores de respuesta
├── 📁 config/          # Configuraciones
└── 📁 helpers/         # Funciones auxiliares
```

## 🚀 Instalación y Configuración

### **Prerrequisitos**
- Node.js v18+
- Docker & Docker Compose
- PostgreSQL 17
- MinIO (almacenamiento de archivos)

### **Configuración del Entorno**

1. **Clonar el repositorio**
```bash
git clone https://github.com/MarceloPazPezo/Proyecto_GPS.git
cd Proyecto_GPS
```

2. **Levantar servicios con Docker**
```bash
docker-compose up -d
```

3. **Instalar dependencias del backend**
```bash
cd backend
npm install
```

4. **Configurar variables de entorno** (.env)
```env
# Base de datos
DB_USERNAME=user_tutores
PASSWORD=password_tutores
DATABASE=db_tutores
HOST=localhost
PORT=3000

# JWT
ACCESS_TOKEN_SECRET=tu_secreto_jwt
cookieKey=tu_clave_cookie

# MinIO
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_USE_SSL=false
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET_NAME=uploads
```

5. **Ejecutar el backend**
```bash
npm run dev  # Desarrollo
npm start    # Producción
```

## 🔐 Autenticación y Autorización

### **Sistema de Roles**
- **administrador**: Acceso completo al sistema
- **encargado_carrera**: Gestión de usuarios de su carrera
- **tutor**: Funcionalidades de tutorías
- **tutorado**: Participación en tutorías
- **usuario**: Acceso básico

### **WebSockets y Tiempo Real**
El sistema implementa **Socket.IO** para funcionalidades en tiempo real:
- **Salas colaborativas**: Creación y gestión de salas para actividades
- **Quiz en tiempo real**: Respuestas sincronizadas entre participantes
- **Pizarra de ideas**: Colaboración en tiempo real
- **Notas adhesivas**: Sincronización de notas en murales
- **Gestión de participantes**: Conexión/desconexión en tiempo real

**Endpoint WebSocket**: `ws://localhost:3000`

### **Autenticación JWT**
- **Header requerido**: `Authorization: Bearer <token>`
- **Tiempo de expiración**: 24 horas
- **Cookie**: `jwt-auth` (frontend)

---

## 📋 API REST - Documentación Completa

**Base URL**: `http://localhost:3000/api`

### **Formato de Respuestas**

#### ✅ **Respuesta Exitosa**
```json
{
  "status": "Success",
  "message": "Descripción del resultado",
  "data": { /* datos retornados */ }
}
```

#### ❌ **Error del Cliente (4xx)**
```json
{
  "status": "Client error",
  "message": "Descripción del error",
  "details": { /* detalles específicos */ }
}
```

#### 🔥 **Error del Servidor (5xx)**
```json
{
  "status": "Server error",
  "message": "Descripción del error interno"
}
```

---

## 🔑 1. AUTENTICACIÓN (`/auth`)

### **POST `/auth/login`**
Autenticar usuario y obtener token JWT.

**Body:**
```json
{
  "email": "usuario@ubiobio.cl",
  "password": "contraseña123"
}
```

**Respuesta (200):**
```json
{
  "status": "Success",
  "message": "Inicio de sesión exitoso",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Validaciones:**
- Email: 15-35 caracteres, dominios permitidos: `@gmail.cl`, `@gmail.com`, `@alumnos.ubiobio.cl`, `@ubiobio.cl`
- Password: 8-26 caracteres, solo letras y números

### **POST `/auth/logout`**
Cerrar sesión del usuario.

**Headers:** `Authorization: Bearer <token>`

**Respuesta (200):**
```json
{
  "status": "Success",
  "message": "Sesión cerrada exitosamente"
}
```

---

## 👥 2. GESTIÓN DE USUARIOS (`/user`)

**Middlewares aplicados:**
- `authenticateJwt`: Todas las rutas requieren autenticación

### **GET `/user/`**
Listar todos los usuarios.

**Query Parameters:**
- `rol` (opcional): Filtrar por rol específico

**Respuesta (200):**
```json
{
  "status": "Success",
  "message": "Usuarios encontrados",
  "data": [
    {
      "id": 1,
      "nombreCompleto": "Juan Pérez García",
      "rut": "12.345.678-9",
      "email": "juan.perez@ubiobio.cl",
      "rol": "usuario",
      "idCarrera": 1
    }
  ]
}
```

### **POST `/user/`** 🔒 *Administrador*
Crear nuevo usuario.

**Body:**
```json
{
  "nombreCompleto": "María González López",
  "rut": "98.765.432-1",
  "email": "maria.gonzalez@ubiobio.cl",
  "password": "password123",
  "rol": "usuario",
  "idCarrera": 1
}
```

**Validaciones:**
- `nombreCompleto`: 15-50 caracteres, solo letras y espacios
- `rut`: Formato chileno válido (xx.xxx.xxx-x)
- `email`: Dominio autorizado
- `password`: 8-26 caracteres alfanuméricos
- `rol`: Uno de los roles válidos
- `idCarrera`: Obligatorio para roles tutor/tutorado

### **GET `/user/detail/`** 🔒 *Administrador*
Obtener usuario específico.

**Query Parameters (uno requerido):**
- `id`: ID del usuario
- `email`: Email del usuario
- `rut`: RUT del usuario

### **PATCH `/user/detail/`** 🔒 *Administrador*
Actualizar usuario.

**Query:** Identificador del usuario (id, email o rut)
**Body:** Campos a actualizar (parcial)

### **DELETE `/user/detail/`** 🔒 *Administrador*
Eliminar usuario.

**Query:** Identificador del usuario

### **POST `/user/import`** 🔒 *Administrador*
Importar múltiples usuarios.

**Body:**
```json
{
  "users": [
    {
      "nombreCompleto": "Usuario 1",
      "rut": "11.111.111-1",
      "email": "usuario1@ubiobio.cl",
      "password": "password123",
      "rol": "usuario"
    }
  ]
}
```

### **Rutas para Encargados de Carrera (`/user/mis-usuarios`)** 🔒

#### **GET `/user/mis-usuarios`**
Listar usuarios de las carreras asignadas al encargado.

#### **POST `/user/mis-usuarios`**
Crear usuario en carreras del encargado.

#### **GET `/user/mis-usuarios/detail/`**
Obtener usuario específico del encargado.

**Query:** `id` del usuario

#### **PATCH `/user/mis-usuarios/detail/`**
Actualizar usuario del encargado.

#### **DELETE `/user/mis-usuarios/detail/`**
Eliminar usuario del encargado.

#### **POST `/user/mis-usuarios/import`**
Importar usuarios para el encargado.

---

## 🎓 3. GESTIÓN DE CARRERAS (`/carrera`)

### **GET `/carrera/`**
Listar todas las carreras.

**Respuesta (200):**
```json
{
  "status": "Success",
  "message": "Carreras encontradas",
  "data": [
    {
      "id": 1,
      "nombre": "Ingeniería Civil en Informática",
      "codigo": "ICI-UBB",
      "descripcion": "Carrera de ingeniería...",
      "departamento": "Departamento de Sistemas de Información",
      "idEncargado": 5
    }
  ]
}
```

### **POST `/carrera/`** 🔒 *Administrador*
Crear nueva carrera.

**Body:**
```json
{
  "nombre": "Ingeniería Civil en Informática",
  "codigo": "ICI-UBB",
  "descripcion": "Descripción de la carrera",
  "departamento": "Departamento de Sistemas de Información",
  "idEncargado": 5
}
```

**Validaciones:**
- `nombre`: 5-100 caracteres, requerido
- `codigo`: 2-10 caracteres, requerido
- `descripcion`: 10-500 caracteres, opcional
- `departamento`: 5-100 caracteres, requerido
- `idEncargado`: ID válido de usuario, requerido

### **GET `/carrera/detail/`** 🔒 *Administrador*
Obtener carrera específica.

**Query Parameters:**
- `id`: ID de la carrera
- `nombre`: Nombre de la carrera

### **PATCH `/carrera/detail/`** 🔒 *Administrador*
Actualizar carrera.

### **DELETE `/carrera/detail/`** 🔒 *Administrador*
Eliminar carrera.

**Query Parameters:**
- `id`: ID de la carrera
- `codigo`: Código de la carrera

### **POST `/carrera/import`** 🔒 *Administrador*
Importar múltiples carreras.

### **GET `/carrera/encargado/`** 🔒 *Encargado de Carrera*
Obtener carreras asignadas al encargado autenticado.

---

## 📝 4. GESTIÓN DE CUESTIONARIOS (`/quiz`)

### **GET `/quiz/`**
Obtener cuestionario específico.

**Query Parameters:**
- `id`: ID del cuestionario
- `idUser` + `nombre`: Usuario y nombre del cuestionario

**Respuesta (200):**
```json
{
  "status": "Success",
  "message": "Cuestionario encontrado",
  "data": {
    "id": 1,
    "nombre": "Cuestionario de Matemáticas",
    "idUser": 5,
    "fechaCreacion": "2025-01-15T10:30:00Z"
  }
}
```

### **POST `/quiz/`**
Crear nuevo cuestionario.

**Body:**
```json
{
  "nombre": "Cuestionario de Matemáticas Básicas",
  "idUser": 5
}
```

**Validaciones:**
- `nombre`: 1-120 caracteres, solo letras, números y espacios
- `idUser`: ID de usuario válido, requerido

### **GET `/quiz/user/:idUser`**
Obtener cuestionarios de un usuario específico.

**Path Parameters:**
- `idUser`: ID del usuario

### **GET `/quiz/all`**
Listar todos los cuestionarios.

### **PATCH `/quiz/`**
Actualizar cuestionario.

**Query Parameters:**
- `id`: ID del cuestionario
- `idUser`: ID del usuario
- `nombre`: Nombre del cuestionario

**Body:** Campos a actualizar

### **DELETE `/quiz/`**
Eliminar cuestionario.

**Body:**
```json
{
  "id": 1,
  "idUser": 5,
  "nombre": "Nombre del cuestionario"
}
```

### **POST `/quiz/addLote/:idCuestionario`**
Agregar lote de preguntas con respuestas.

**Path Parameters:**
- `idCuestionario`: ID del cuestionario

**Body:** Array de preguntas con sus respuestas
**Content-Type:** `multipart/form-data` (para imágenes)

**Ejemplo:**
```json
{
  "preguntas": [
    {
      "texto": "¿Cuál es la capital de Chile?",
      "imagenField": "imagen1",
      "Respuestas": [
        {
          "textoRespuesta": "Santiago",
          "correcta": true
        },
        {
          "textoRespuesta": "Valparaíso",
          "correcta": false
        }
      ]
    }
  ]
}
```

### **GET `/quiz/lote/:idCuestionario`**
Obtener todas las preguntas y respuestas de un cuestionario.

### **PATCH `/quiz/lote/:idCuestionario`**
Actualizar cuestionario completo (preguntas y respuestas).

**Body:**
```json
{
  "idUser": 5,
  "titulo": "Nuevo título del cuestionario",
  "preguntas": [
    {
      "id": 1,
      "texto": "Pregunta actualizada",
      "respuestas": [
        {
          "id": 1,
          "textoRespuesta": "Respuesta actualizada",
          "correcta": true
        }
      ]
    }
  ]
}
```

---

## ❓ 5. GESTIÓN DE PREGUNTAS (`/preguntas`)

### **GET `/preguntas/cuestionario/:idCuestionario`**
Obtener preguntas de un cuestionario.

**Path Parameters:**
- `idCuestionario`: ID del cuestionario

### **GET `/preguntas/:id`**
Obtener pregunta específica.

### **POST `/preguntas/`**
Crear nueva pregunta.

**Content-Type:** `multipart/form-data`

**Form Data:**
- `texto`: Texto de la pregunta (1-500 caracteres)
- `idCuestionario`: ID del cuestionario
- `imagenPregunta`: Archivo de imagen (opcional)

### **PATCH `/preguntas/update/:id`**
Actualizar pregunta.

**Content-Type:** `multipart/form-data`

### **DELETE `/preguntas/del/:id`**
Eliminar pregunta.

---

## ✅ 6. GESTIÓN DE RESPUESTAS (`/respuestas`)

### **GET `/respuestas/:id`**
Obtener respuesta específica.

### **GET `/respuestas/pregunta/:idPreguntas`**
Obtener respuestas de una pregunta.

### **POST `/respuestas/`**
Crear nueva respuesta.

**Body:**
```json
{
  "textoRespuesta": "Respuesta a la pregunta",
  "idPreguntas": 1,
  "correcta": true
}
```

**Validaciones:**
- `textoRespuesta`: 1-120 caracteres, requerido
- `idPreguntas`: ID de pregunta válido, requerido
- `correcta`: Booleano, requerido

### **PATCH `/respuestas/update/:id`**
Actualizar respuesta.

### **DELETE `/respuestas/del/:id`**
Eliminar respuesta.

### **POST `/respuestas/addLotepRespuestas`**
Agregar múltiples respuestas.

**Body:**
```json
{
  "respuestas": [
    {
      "textoRespuesta": "Respuesta 1",
      "correcta": true
    },
    {
      "textoRespuesta": "Respuesta 2",
      "correcta": false
    }
  ]
}
```

---

## 🖇️ 7. CONTENIDO COMPARTIDO (`/share`)

### **GET `/share/:idUser`**
Obtener contenido compartido con un usuario.

### **GET `/share/get/`**
Obtener contenido compartido específico.

**Query Parameters:**
- `idCuestionario`: ID del cuestionario
- `idUser`: ID del usuario

### **POST `/share/`**
Compartir contenido.

**Body:**
```json
{
  "idCuestionario": 1,
  "idUser": 5
}
```

### **DELETE `/share/`**
Eliminar contenido compartido.

---

## 📊 8. EXPLORACIÓN (`/EX`)

### **GET `/EX/quizzes/:idUser`**
Obtener cuestionarios disponibles para un usuario específico.

---

## 🗂️ 9. GESTIÓN DE MURALES (`/mural`)

### **POST `/mural/crearMural`**
Crear nuevo mural.

**Body:**
```json
{
  "titulo": "Mi Mural de Ideas",
  "descripcion": "Descripción del mural",
  "idUser": 5
}
```

### **GET `/mural/muralUsuario/:idUser`**
Obtener murales de un usuario.

### **GET `/mural/:id`**
Obtener mural específico.

### **PUT `/mural/:id`**
Actualizar mural.

### **DELETE `/mural/:id`**
Eliminar mural.

### **PUT `/mural/save/:idMural`**
Guardar configuración de notas en el mural.

**Body:**
```json
{
  "notes": [
    {
      "id": 1,
      "posx": 100,
      "posy": 150,
      "titulo": "Nota 1",
      "descripcion": "Contenido de la nota",
      "color": "#ffeb3b"
    }
  ]
}
```

---

## 📋 10. GESTIÓN DE NOTAS ADHESIVAS (`/notas`)

⚠️ **NOTA DE SEGURIDAD**: Estas rutas tienen autenticación implementada pero están comentadas en el código.

### **POST `/notas/crearNota`**
Crear nueva nota adhesiva.

**Body:**
```json
{
  "titulo": "Título de la nota",
  "descripcion": "Contenido de la nota",
  "color": "#ffeb3b",
  "posx": 100,
  "posy": 150,
  "idMural": 1
}
```

**Validaciones:**
- `titulo`: Mínimo 3 caracteres (si se proporciona)
- `color`: Formato hexadecimal válido (#rrggbb)
- `posx`, `posy`: Números válidos

### **GET `/notas/mural/:idMural`**
Obtener notas de un mural.

### **GET `/notas/nota/:idNote`**
Obtener nota específica.

### **PUT `/notas/:id`**
Actualizar nota.

### **DELETE `/notas/:id`**
Eliminar nota.

---

## 🌐 11. FUNCIONALIDADES WEBSOCKET (Socket.IO)

### **Configuración del Cliente**
```javascript
import { io } from 'socket.io-client';
const socket = io('http://localhost:3000');
```

### **Eventos de Salas**

#### **Crear Sala**
```javascript
socket.emit('create', {
  sala: 'nombre-sala',
  tipo: 'quiz' // o 'pizarra', 'notas'
});
```

#### **Unirse a Sala**
```javascript
socket.emit('join', {
  sala: 'nombre-sala',
  nickname: 'nombre-usuario'
});
```

#### **Iniciar Actividad**
```javascript
socket.emit('start', {
  actividad: 'quiz' // o 'pizarra', 'notas'
});
```

### **Eventos de Quiz en Tiempo Real**

#### **Enviar Pregunta**
```javascript
socket.emit('opt', {
  pregunta: 'Texto de la pregunta',
  respuestas: ['A', 'B', 'C', 'D']
});
```

#### **Recibir Respuesta**
```javascript
socket.emit('answer', {
  id: 1,
  correcta: true
});
```

### **Eventos de Pizarra de Ideas**

#### **Enviar Idea**
```javascript
socket.emit('respuesta', {
  texto: 'Mi idea creativa',
  usuario: 'nombre-usuario'
});
```

#### **Control de Timer**
```javascript
socket.emit('timer', {
  time: 300 // segundos
});
```

### **Eventos de Notas Adhesivas**

#### **Crear Nota**
```javascript
socket.emit('addNote', {
  titulo: 'Nueva nota',
  descripcion: 'Contenido',
  color: '#ffeb3b',
  posx: 100,
  posy: 150
});
```

#### **Actualizar Nota**
```javascript
socket.emit('updateNote', {
  id: 1,
  titulo: 'Nota actualizada',
  posx: 120,
  posy: 180
});
```

#### **Mover Nota**
```javascript
socket.emit('moveNote', {
  id: 1,
  posx: 200,
  posy: 250
});
```

#### **Eliminar Nota**
```javascript
socket.emit('deleteNote', noteId);
```

### **Eventos del Servidor**

#### **Escuchar Conexiones**
```javascript
socket.on('message', (data) => {
  console.log('Mensaje del servidor:', data);
});

socket.on('join', (data) => {
  console.log('Usuario se unió:', data.nickname);
});

socket.on('start', (data) => {
  console.log('Actividad iniciada:', data.actividad);
});

socket.on('finnish', () => {
  console.log('Sesión terminada');
});
```

---

## 🛠️ 12. GESTIÓN DE SESIONES (`/sesion`)

⚠️ **NOTA**: Esta funcionalidad existe en el código pero no tiene rutas implementadas.

### **Servicios Disponibles**

#### **Crear Sesión**
```javascript
// Service: createSesionService(sesionData)
const sesionData = {
  idCuestionario: 1,
  idUser: 5
};
```

#### **Obtener Sesión**
```javascript
// Service: getSesionService(query)
const query = {
  idCuestionario: 1,
  idUser: 5
};
```

#### **Obtener Todas las Sesiones**
```javascript
// Service: getSesionesService()
```

---

## 🛡️ Middlewares de Seguridad

### **`authenticateJwt`**
Valida el token JWT en el header Authorization.

**Uso:**
```javascript
router.use(authenticateJwt)
```

### **`authorizeRoles(...roles)`**
Autoriza acceso basado en roles de usuario.

**Uso:**
```javascript
router.post("/", authorizeRoles("administrador"), createUser)
router.get("/mis-usuarios", authorizeRoles("encargado_carrera"), getMisUsuarios)
```

### **`upload.single('campo')` / `upload.any()`**
Manejo de archivos con MinIO.

---

## 📁 Almacenamiento de Archivos

### **MinIO Configuration**
- **Endpoint**: `localhost:9000`
- **Console**: `localhost:9002`
- **Bucket**: `uploads`
- **Tipos soportados**: Imágenes para preguntas

### **Estructura de URLs**
```
http://localhost:9000/uploads/preguntas/imagen-123456.jpg
```

---

## 🧪 Testing

### **Scripts disponibles**
```bash
npm test         # Ejecutar tests
npm run test:c   # Tests con cobertura
npm run test:w   # Tests en modo watch
npm run test:ui  # Interfaz visual de tests
```

### **Estructura de tests**
```
📁 backend/test/
├── 📁 unit/           # Tests unitarios
│   ├── 📁 services/   # Tests de servicios
│   └── 📁 validations/# Tests de validaciones Joi
└── 📁 integration/    # Tests de integración
```

---

## 🔧 Configuración de Desarrollo

### **Scripts NPM**
```bash
npm start        # Ejecutar en producción
npm run dev      # Desarrollo con nodemon
npm run lint     # Verificar estilo de código
npm run lint:fix # Corregir problemas de estilo
npm run format   # Formatear código con Prettier
```

### **Variables de Entorno**
```env
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=5432
LOG_LEVEL=debug
```

---

## 🚨 Problemas Conocidos y Mejoras Pendientes

### **Seguridad**
- ⚠️ Rutas de notas con autenticación comentada
- ⚠️ CORS muy permisivo (`origin: true`)
- ⚠️ Configuración de cookies insegura para producción
- ⚠️ Rutas EX duplicadas en `index.routes.js`

### **Funcionalidades Pendientes**
- ❌ Rutas de sesiones no implementadas (servicio existe)
- ❌ Validaciones de sesiones no creadas
- ❌ WebSocket authentication middleware

### **Mejoras Sugeridas**
1. **Implementar rate limiting**
2. **Agregar validación de tipos de archivo**
3. **Implementar logs estructurados**
4. **Configurar HTTPS para producción**
5. **Agregar paginación a listados**
6. **Implementar caché para consultas frecuentes**
7. **Habilitar autenticación en rutas de notas**
8. **Implementar validaciones para WebSockets**
9. **Corregir duplicación de rutas EX**
10. **Crear rutas para gestión de sesiones**

---

## 📞 Soporte y Contribución

### **Autor**
- **Nombre**: Marcelo Paz Pezo
- **Email**: [contacto]
- **GitHub**: MarceloPazPezo

### **Contribuir**
1. Fork del repositorio
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit de cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

---

## 🔗 Enlaces Útiles

- **API Base**: `http://localhost:3000/api`
- **PostgreSQL**: `localhost:5433`
- **MinIO Console**: `http://localhost:9002`
- **Documentación TypeORM**: https://typeorm.io/
- **Documentación Joi**: https://joi.dev/

---

*Documentación generada para el Sistema de Gestión de Tutorías GPS - Versión 1.0.0*
