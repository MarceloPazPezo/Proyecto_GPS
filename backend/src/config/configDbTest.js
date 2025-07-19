import { DataSource } from "typeorm";

export const testDataSource = new DataSource({
    type: "postgres",
    host: 'localhost',
    port: 5432,
    username: 'user_test',
    password: 'password_test',
    database: 'db_test',
    entities: ["src/entity/**/*.js"],
    dropSchema: true,
    synchronize: true,
    logging: false,
});

export async function connectDbTest() {
    try {
        if (!testDataSource.isInitialized) {
            await testDataSource.initialize();
            console.log("=> Conexión exitosa a la base de datos de PRUEBA!");
        }
    } catch (error) {
        console.error("Error al conectar con la base de datos de prueba:", error);
        process.exit(1);
    }
}

export async function disconnectDbTest() {
    try {
        if (testDataSource.isInitialized) {
            await testDataSource.destroy();
            console.log("=> Desconectado de la base de datos de prueba.");
        }
    } catch (error) {
        console.error("Error al desconectar la base de datos de prueba:", error);
    }
}