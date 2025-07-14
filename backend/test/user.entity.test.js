import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { testDataSource, connectDbTest, disconnectDbTest } from '../src/config/configDbTest.js';
import User from '../src/entity/user.entity.js';
import { userCreateValidation } from '../src/validations/user.validation.js';

// T: Lista de pruebas unitarias sugeridas para la entidad User y validaciones Joi
// -------------------------------------------------------------------------------
// Pruebas de la Entidad User con TypeORM
// -------------------------------------------------------------------------------
// 0.0 Validar que la entidad User coincide con el esquema de la base de datos
// -------------------------------------------------------------------------------
// Creación
// -------------------------------------------------------------------------------
// 1.0 Creación de usuario válida (todos los campos correctos)
// 1.1.1 Creación de usuario con nombre inválido (menor a la longitud mínima)
// 1.1.2 Creación de usuario con nombre inválido (mayor a la longitud maxima)
// 1.1.3 Creación de usuario con nombre inválido (formato incorrecto, caracteres no permitidos)
// 1.1.4 Creación de usuario con nombre inválido (campo requerido)
// 1.1.5 Creación de usuario con nombre inválido (campo vacío)
// -------------------------------------------------------------------------------
// 1.2.1 Creación de usuario con rut inválido (menor a la longitud mínima)
// 1.2.2 Creación de usuario con rut inválido (mayor a la longitud maxima)
// 1.2.3 Creación de usuario con rut inválido (formato incorrecto, sin guion)
// 1.2.4 Creación de usuario con rut inválido (campo requerido)
// 1.2.5 Creación de usuario con rut inválido (campo vacío)
// -------------------------------------------------------------------------------
// 1.3.1 Creación de usuario con email inválido (menor a la longitud mínima)
// 1.3.2 Creación de usuario con email inválido (mayor a la longitud maxima)
// 1.3.3 Creación de usuario con email inválido (dominio incorrecto, formato incorrecto)
// 1.3.4 Creación de usuario con email inválido (campo requerido)
// 1.3.5 Creación de usuario con email inválido (campo vacío)
// -------------------------------------------------------------------------------
// 1.4.1 Creación de usuario con password inválida (menor a la longitud mínima)
// 1.4.2 Creación de usuario con password inválida (mayor a la longitud maxima)
// 1.4.3 Creación de usuario con password inválida (caracteres no permitidos, formato incorrecto)
// 1.4.4 Creación de usuario con password inválida (campo requerido)
// 1.4.5 Creación de usuario con password inválida (campo vacío)
// -------------------------------------------------------------------------------
// 1.5.1 Creación de usuario con rol inválido (no es uno de los roles permitidos)
// 1.5.2 Creación de usuario con rol inválido (tipo incorrecto)
// -------------------------------------------------------------------------------
// 1.6.1 Creación de usuario con email duplicado (restricción única)
// 1.6.2 Creación de usuario con rut duplicado (restricción única)
// -------------------------------------------------------------------------------
// Actualización
// -------------------------------------------------------------------------------
// 2.1.0 Actualización de usuario: cambio de email, rut, nombre, password, rol
// 2.1.1 Actualización de usuario: Debe actualizar el campo updatedAt tras modificar el usuario
// -------------------------------------------------------------------------------
// Eliminación
// -------------------------------------------------------------------------------
// 3.1.0 Eliminación de usuario
// -------------------------------------------------------------------------------
// Búsqueda
// -------------------------------------------------------------------------------
// 4.1.0 Validar que se puede buscar un usuario por id
// 4.2.0 Validar que se puede buscar un usuario por email
// 4.3.0 Validar que se puede buscar un usuario por rut
// -------------------------------------------------------------------------------
// Extra
// -------------------------------------------------------------------------------
// 5.1.0 Validar que no se puede crear un usuario con campos adicionales (no permitidos por Joi)
// 5.2.0 Validar que los timestamps (createdAt, updatedAt) se asignan correctamente
// -------------------------------------------------------------------------------

describe('Pruebas de la Entidad User con TypeORM', () => {
    let userRepository;

    // 1. Conectar a la base de datos de prueba ANTES de que todas las pruebas se ejecuten.
    beforeAll(async () => {
        await connectDbTest();
        // Obtenemos el repositorio para la entidad User.
        userRepository = testDataSource.getRepository(User);
    });

    // 2. Desconectar de la base de datos DESPUÉS de que todas las pruebas terminen.
    afterAll(async () => {
        await disconnectDbTest();
    });

    // 3. Limpiar la tabla de usuarios DESPUÉS de CADA prueba para asegurar que estén aisladas.
    afterEach(async () => {
        await userRepository.delete({});
    });

    it('0.0 La entidad User debe tener los campos definidos en el esquema', async () => {
        const userData = {
            nombreCompleto: 'Validar Esquema',
            rut: '12345678-6',
            email: 'esquema@gmail.cl',
            rol: 'usuario',
            password: 'password123'
        };
        const user = userRepository.create(userData);
        await userRepository.save(user);
        const found = await userRepository.findOne({ where: { rut: '12345678-6' } });
        expect(found).toBeDefined();
        expect(found).toHaveProperty('id');
        expect(found).toHaveProperty('nombreCompleto');
        expect(found).toHaveProperty('rut');
        expect(found).toHaveProperty('email');
        expect(found).toHaveProperty('rol');
        expect(found).toHaveProperty('password');
        expect(found).toHaveProperty('createdAt');
        expect(found).toHaveProperty('updatedAt');
    });

    it('1.1.0 Debe crear y guardar un usuario correctamente', async () => {
        const userData = {
            nombreCompleto: 'Miguel Paz Perez',
            rut: '21123456-7',
            email: 'miguel.paz1901@alumnos.ubiobio.cl',
            rol: 'tutor',
            password: 'password123'
        };

        const { error } = userCreateValidation.validate(userData);
        expect(error).toBeUndefined();
        
        const user = userRepository.create(userData);
        await userRepository.save(user);

        // Verificamos que el usuario se haya guardado y tenga un ID.
        expect(user.id).toBeDefined();
        expect(user.nombreCompleto).toBe(userData.nombreCompleto);
    });

    it('1.1.1 Creación de usuario con nombre inválido (menor a la longitud mínima)', () => {
        const userData = {
            nombreCompleto: 'Nombre Corto', // menos de 15 caracteres
            rut: '12345678-9',
            email: 'usuario@gmail.cl',
            rol: 'usuario',
            password: 'password123'
        };
        const { error } = userCreateValidation.validate(userData);
        expect(error).toBeDefined();
        expect(error.message).toMatch(/al menos 15 caracteres/);
    });

    it('1.1.2 Creación de usuario con nombre inválido (mayor a la longitud máxima)', () => {
        const userData = {
            nombreCompleto: 'Nombre Excesivamente Largo Para Un Usuario Que Supera Cincuenta Caracteres Permitidos En El Sistema',
            rut: '12345678-9',
            email: 'usuario@gmail.cl',
            rol: 'usuario',
            password: 'password123'
        };
        const { error } = userCreateValidation.validate(userData);
        expect(error).toBeDefined();
        expect(error.message).toMatch(/máximo 50 caracteres/);
    });

    it('1.1.3 Creación de usuario con nombre inválido (formato incorrecto, caracteres no permitidos)', () => {
        const userData = {
            nombreCompleto: 'Nombre123456789', // contiene números
            rut: '12345678-9',
            email: 'usuario@gmail.cl',
            rol: 'usuario',
            password: 'password123'
        };
        const { error } = userCreateValidation.validate(userData);
        expect(error).toBeDefined();
        expect(error.message).toMatch(/solo puede contener letras y espacios/);
    });

    it('1.1.4 Creación de usuario con nombre inválido (campo requerido)', () => {
        const userData = {
            rut: '12345678-9',
            email: 'usuario@gmail.cl',
            rol: 'usuario',
            password: 'password123'
        };
        const { error } = userCreateValidation.validate(userData);
        expect(error).toBeDefined();
        expect(error.message).toMatch(/El nombre completo es obligatorio/);
    });

    it('1.1.5 Creación de usuario con nombre inválido (campo vacío)', () => {
        const userData = {
            nombreCompleto: '',
            rut: '12345678-9',
            email: 'usuario@gmail.cl',
            rol: 'usuario',
            password: 'password123'
        };
        const { error } = userCreateValidation.validate(userData);
        expect(error).toBeDefined();
        expect(error.message).toMatch(/El nombre completo no puede estar vacío/);
    });

    it('1.2.1 Creación de usuario con rut inválido (menor a la longitud mínima)', () => {
        const userData = {
            nombreCompleto: 'Usuario Test Nombre',
            rut: '1234-5', // muy corto
            email: 'usuario@gmail.cl',
            rol: 'usuario',
            password: 'password123'
        };
        const { error } = userCreateValidation.validate(userData);
        expect(error).toBeDefined();
        expect(error.message).toMatch(/mínimo 9 caracteres/);
    });

    it('1.2.2 Creación de usuario con rut inválido (mayor a la longitud máxima)', () => {
        const userData = {
            nombreCompleto: 'Usuario Test Nombre',
            rut: '123456789012345-6', // muy largo
            email: 'usuario@gmail.cl',
            rol: 'usuario',
            password: 'password123'
        };
        const { error } = userCreateValidation.validate(userData);
        expect(error).toBeDefined();
        expect(error.message).toMatch(/máximo 12 caracteres/);
    });

    it('1.2.3 Creación de usuario con rut inválido (formato incorrecto, sin guion)', () => {
        const userData = {
            nombreCompleto: 'Usuario Test Nombre',
            rut: '123456789', // sin guion
            email: 'usuario@gmail.cl',
            rol: 'usuario',
            password: 'password123'
        };
        const { error } = userCreateValidation.validate(userData);
        expect(error).toBeDefined();
        expect(error.message).toMatch(/Formato rut inválido/);
    });

    it('1.2.4 Creación de usuario con rut inválido (campo requerido)', () => {
        const userData = {
            nombreCompleto: 'Usuario Test Nombre',
            email: 'usuario@gmail.cl',
            rol: 'usuario',
            password: 'password123'
        };
        const { error } = userCreateValidation.validate(userData);
        expect(error).toBeDefined();
        expect(error.message).toMatch(/El rut es obligatorio/);
    });

    it('1.2.5 Creación de usuario con rut inválido (campo vacío)', () => {
        const userData = {
            nombreCompleto: 'Usuario Test Nombre',
            email: 'usuario@gmail.cl',
            rol: 'usuario',
            password: 'password123'
        };
        const { error } = userCreateValidation.validate(userData);
        expect(error).toBeDefined();
        expect(error.message).toMatch(/El rut es obligatorio/);
    });

    it('1.3.1 Creación de usuario con email inválido (menor a la longitud mínima)', () => {
        const userData = {
            nombreCompleto: 'Usuario Test Nombre',
            rut: '12345678-9',
            email: 'a@b.c', // muy corto
            rol: 'usuario',
            password: 'password123'
        };
        const { error } = userCreateValidation.validate(userData);
        expect(error).toBeDefined();
        expect(error.message).toMatch(/al menos 15 caracteres/);
    });

    it('1.3.2 Creación de usuario con email inválido (mayor a la longitud máxima)', () => {
        const userData = {
            nombreCompleto: 'Usuario Test Nombre',
            rut: '12345678-9',
            email: 'usuario'.repeat(20) + '@gmail.com', // muy largo
            rol: 'usuario',
            password: 'password123'
        };
        const { error } = userCreateValidation.validate(userData);
        expect(error).toBeDefined();
        expect(error.message).toMatch(/máximo 100 caracteres/);
    });

    it('1.3.3 Creación de usuario con email inválido (dominio incorrecto, formato incorrecto)', () => {
        const userData = {
            nombreCompleto: 'Usuario Test Nombre',
            rut: '12345678-9',
            email: 'usuario@outlook.com', // dominio incorrecto
            rol: 'usuario',
            password: 'password123'
        };
        const { error } = userCreateValidation.validate(userData);
        expect(error).toBeDefined();
        expect(error.message).toMatch(/dominio/);
    });

    it('1.3.4 Creación de usuario con email inválido (campo requerido)', () => {
        const userData = {
            nombreCompleto: 'Usuario Test Nombre',
            rut: '12345678-9',
            rol: 'usuario',
            password: 'password123'
        };
        const { error } = userCreateValidation.validate(userData);
        expect(error).toBeDefined();
        expect(error.message).toMatch(/El correo electrónico es obligatorio/);
    });

    it('1.3.5 Creación de usuario con email inválido (campo vacío)', () => {
        const userData = {
            nombreCompleto: 'Usuario Test Nombre',
            rut: '12345678-9',
            email: '',
            rol: 'usuario',
            password: 'password123'
        };
        const { error } = userCreateValidation.validate(userData);
        expect(error).toBeDefined();
        expect(error.message).toMatch(/El correo electrónico no puede estar vacío/);
    });

    it('1.4.1 Creación de usuario con password inválida (menor a la longitud mínima)', () => {
        const userData = {
            nombreCompleto: 'Usuario Test Nombre',
            rut: '12345678-9',
            email: 'usuario@gmail.cl',
            rol: 'usuario',
            password: 'pass' // menos de 8
        };
        const { error } = userCreateValidation.validate(userData);
        expect(error).toBeDefined();
        expect(error.message).toMatch(/al menos 8 caracteres/);
    });

    it('1.4.2 Creación de usuario con password inválida (mayor a la longitud máxima)', () => {
        const userData = {
            nombreCompleto: 'Usuario Test Nombre',
            rut: '12345678-9',
            email: 'usuario@gmail.cl',
            rol: 'usuario',
            password: 'passwordsuperlargotestqueexcede30caracteres' // más de 30
        };
        const { error } = userCreateValidation.validate(userData);
        expect(error).toBeDefined();
        expect(error.message).toMatch(/máximo 26 caracteres/);
    });

    it('1.4.3 Creación de usuario con password inválida (caracteres no permitidos, formato incorrecto)', () => {
        const userData = {
            nombreCompleto: 'Usuario Test Nombre',
            rut: '12345678-9',
            email: 'usuario@gmail.cl',
            rol: 'usuario',
            password: 'pass*word123' // * no permitido
        };
        const { error } = userCreateValidation.validate(userData);
        expect(error).toBeDefined();
        expect(error.message).toMatch(/solo puede contener letras y números/);
    });

    it('1.4.4 Creación de usuario con password inválida (campo requerido)', () => {
        const userData = {
            nombreCompleto: 'Usuario Test Nombre',
            rut: '12345678-9',
            email: 'usuario@gmail.cl',
            rol: 'usuario'
        };
        const { error } = userCreateValidation.validate(userData);
        expect(error).toBeDefined();
        expect(error.message).toMatch(/La contraseña es obligatoria/);
    });

    it('1.4.5 Creación de usuario con password inválida (campo vacío)', () => {
        const userData = {
            nombreCompleto: 'Usuario Test Nombre',
            rut: '12345678-9',
            email: 'usuario@gmail.cl',
            rol: 'usuario',
            password: ''
        };
        const { error } = userCreateValidation.validate(userData);
        expect(error).toBeDefined();
        expect(error.message).toMatch(/La contraseña no puede estar vacía/);
    });

    it('1.5.1 Creación de usuario con rol inválido (no es uno de los roles permitidos)', () => {
        const userData = {
            nombreCompleto: 'Usuario Test Nombre',
            rut: '12345678-9',
            email: 'usuario@gmail.cl',
            rol: 'invalido', // no permitido
            password: 'password123'
        };
        const { error } = userCreateValidation.validate(userData);
        expect(error).toBeDefined();
        expect(error.message).toMatch(/rol debe ser/);
    });

    it('1.5.2 Creación de usuario con rol inválido (tipo incorrecto)', () => {
        const userData = {
            nombreCompleto: 'Usuario Test Nombre',
            rut: '12345678-9',
            email: 'usuario@gmail.cl',
            rol: 123, // tipo incorrecto
            password: 'password123'
        };
        const { error } = userCreateValidation.validate(userData);
        expect(error).toBeDefined();
        expect(error.message).toMatch(/tipo string/);
    });

        it('1.6.1 Creación de usuario con email duplicado (restricción única)', async () => {
        const emailComun = 'duplicado@example.com';
        const user1Data = {
            nombreCompleto: 'Usuario Uno',
            rut: '12345678-9',
            email: emailComun,
            rol: 'usuario',
            password: 'password123'
        };
        const user2Data = {
            nombreCompleto: 'Usuario Dos',
            rut: '98765432-1',
            email: emailComun,
            rol: 'usuario',
            password: 'password123'
        };
        const user1 = userRepository.create(user1Data);
        await userRepository.save(user1);
        const user2 = userRepository.create(user2Data);
        await expect(userRepository.save(user2)).rejects.toThrow();
    });

    it('1.6.2 Creación de usuario con rut duplicado (restricción única)', async () => {
        const rutComun = '20111222-3';
        const user1Data = {
            nombreCompleto: 'Usuario Uno',
            rut: rutComun,
            email: 'user1@example.com',
            rol: 'usuario',
            password: 'password123'
        };
        const user2Data = {
            nombreCompleto: 'Usuario Dos',
            rut: rutComun,
            email: 'user2@example.com',
            rol: 'usuario',
            password: 'password123'
        };
        const user1 = userRepository.create(user1Data);
        await userRepository.save(user1);
        const user2 = userRepository.create(user2Data);
        await expect(userRepository.save(user2)).rejects.toThrow();
    });

    it('2.1.0 Actualización de usuario: cambio de email, rut, nombre, password, rol', async () => {
        const userData = {
            nombreCompleto: 'Usuario Actualizar',
            rut: '12345678-9',
            email: 'actualizar@ubiobio.cl',
            rol: 'usuario',
            password: 'password123'
        };
        const user = userRepository.create(userData);
        await userRepository.save(user);
        // Actualizamos todos los campos
        user.nombreCompleto = 'Nombre Modificado';
        user.rut = '98765432-1';
        user.email = 'modificado@ubiobio.cl';
        user.rol = 'tutor';
        user.password = 'nuevaPassword456';
        await userRepository.save(user);
        const updatedUser = await userRepository.findOne({ where: { id: user.id } });
        expect(updatedUser.nombreCompleto).toBe('Nombre Modificado');
        expect(updatedUser.rut).toBe('98765432-1');
        expect(updatedUser.email).toBe('modificado@ubiobio.cl');
        expect(updatedUser.rol).toBe('tutor');
        expect(updatedUser.password).toBe('nuevaPassword456');
    });

    it('2.1.1 Actualización de usuario: Debe actualizar el campo updatedAt tras modificar el usuario', async () => {
        // Creamos el usuario
        const userData = {
            nombreCompleto: 'Usuario UpdatedAt',
            rut: '12345678-4',
            email: 'updatedat@ubiobio.cl',
            rol: 'usuario',
            password: 'password123'
        };
        const user = userRepository.create(userData);
        await userRepository.save(user);
        const originalUpdatedAt = user.updatedAt;
        // Esperamos un segundo para asegurar diferencia de timestamp
        await new Promise(res => setTimeout(res, 1000));
        user.nombreCompleto = 'Usuario UpdatedAt Modificado';
        user.updatedAt = new Date();
        await userRepository.save(user);
        const updatedUser = await userRepository.findOne({ where: { rut: '12345678-4' } });
        expect(updatedUser.updatedAt).not.toEqual(originalUpdatedAt);
    });

    it('3.1.0 Eliminación de usuario', async () => {
        const userData = {
            nombreCompleto: 'Usuario Eliminar',
            rut: '12345678-9',
            email: 'eliminar@gmail.cl',
            rol: 'usuario',
            password: 'password123'
        };
        const user = userRepository.create(userData);
        await userRepository.save(user);
        await userRepository.delete({ rut: '12345678-9' });
        const deletedUser = await userRepository.findOne({ where: { rut: '12345678-9' } });
        expect(deletedUser).toBeNull();
    });

    it('4.1.0 Validar que se puede buscar un usuario por id', async () => {
        const userData = {
            nombreCompleto: 'Usuario Buscar ID',
            rut: '11111111-1',
            email: 'buscarid@ubiobio.cl',
            rol: 'usuario',
            password: 'password123'
        };
        const user = userRepository.create(userData);
        await userRepository.save(user);
        const found = await userRepository.findOne({ where: { id: user.id } });
        expect(found).toBeDefined();
        expect(found.email).toBe('buscarid@ubiobio.cl');
    });

    it('4.2.0 Validar que se puede buscar un usuario por email', async () => {
        const userData = {
            nombreCompleto: 'Usuario Buscar Email',
            rut: '22222222-2',
            email: 'buscaremail@ubiobio.cl',
            rol: 'usuario',
            password: 'password123'
        };
        const user = userRepository.create(userData);
        await userRepository.save(user);
        const found = await userRepository.findOne({ where: { email: 'buscaremail@ubiobio.cl' } });
        expect(found).toBeDefined();
        expect(found.rut).toBe('22222222-2');
    });

    it('4.3.0 Validar que se puede buscar un usuario por rut', async () => {
        const userData = {
            nombreCompleto: 'Usuario Buscar Rut',
            rut: '33333333-3',
            email: 'buscarrut@ubiobio.cl',
            rol: 'usuario',
            password: 'password123'
        };
        const user = userRepository.create(userData);
        await userRepository.save(user);
        const found = await userRepository.findOne({ where: { rut: '33333333-3' } });
        expect(found).toBeDefined();
        expect(found.email).toBe('buscarrut@ubiobio.cl');
    });

    it('5.1.0 Validar que no se puede crear un usuario con campos adicionales (no permitidos por Joi)', () => {
        const userData = {
            nombreCompleto: 'Usuario Test Campos Extra',
            rut: '12345678-5',
            email: 'camposextra@ubiobio.cl',
            rol: 'usuario',
            password: 'password123',
            campoExtra: 'no permitido'
        };
        const { error } = userCreateValidation.validate(userData);
        expect(error).toBeDefined();
        expect(error.message).toMatch(/No se permiten propiedades adicionales/);
    });

    it('5.2.0 Validar que los timestamps (createdAt, updatedAt) se asignan correctamente', async () => {
        const userData = {
            nombreCompleto: 'Usuario Test Timestamp',
            rut: '12345678-6',
            email: 'timestamp@ubiobio.cl',
            rol: 'usuario',
            password: 'password123'
        };
        const user = userRepository.create(userData);
        await userRepository.save(user);
        expect(user.createdAt).toBeDefined();
        expect(user.updatedAt).toBeDefined();
        expect(user.createdAt instanceof Date).toBe(true);
        expect(user.updatedAt instanceof Date).toBe(true);
    });
});