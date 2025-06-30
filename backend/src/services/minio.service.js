import { minioClient, bucketName } from '../config/configMinio.js';

/**
 * Elimina un objeto del bucket de Minio.
 * @param {string} objectName - El nombre (key) del objeto a eliminar.
 * @returns {Promise<[boolean, string|null]>} - Retorna [éxito, error]
 */
export async function deleteFile(objectName) {
  if (!objectName) {
    return [true, null];
  }
  try {
    await minioClient.removeObject(bucketName, objectName);
    console.log(`Archivo '${objectName}' eliminado exitosamente de Minio.`);
    return [true, null];
  } catch (error) {
    console.error(`Error al eliminar el archivo '${objectName}' de Minio:`, error);
    return [false, 'Error al eliminar la imagen del almacenamiento.'];
  }
}