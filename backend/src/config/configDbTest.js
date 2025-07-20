import { DataSource } from "typeorm";

const baseConfig = {
    type: "postgres",
    host: 'localhost',
    port: 5432,
    username: 'user_test',
    password: 'password_test',
    database: 'db_test',
    entities: ["src/entity/**/*.js"],
    logging: false,
};

export const setupDataSource = new DataSource({
    ...baseConfig,
    dropSchema: true,
    synchronize: true,
});

export const testDataSource = new DataSource({
    ...baseConfig,
    dropSchema: false,
    synchronize: false,
});