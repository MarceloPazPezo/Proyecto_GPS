import { setupDataSource } from './src/config/configDbTest.js';

export default async () => {
  console.log('Preparando el esquema de la base de datos de prueba...');
  await setupDataSource.initialize();
  await setupDataSource.destroy();
  console.log('Esquema listo.');
  return async () => {
    console.log('Todas las pruebas han finalizado.');
  };
};