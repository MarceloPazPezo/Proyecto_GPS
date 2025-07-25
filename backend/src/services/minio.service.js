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

/**
 * Sube un archivo a MinIO y retorna la URL y key.
 * @param {Object} file - Objeto de multer (buffer, originalname, mimetype)
 * @param {string} [folder] - Carpeta opcional dentro del bucket
 * @returns {Promise<{ location: string, key: string }>}
 */
export async function subirArchivoMinio(file, folder = "") {
  if (!file || !file.buffer || !file.originalname) {
    throw new Error("Archivo inválido para subir a MinIO");
  }
  const ext = file.originalname.split('.').pop();
  const nombreArchivo = `${folder ? folder + "/" : ""}${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`;
  await minioClient.putObject(
    bucketName,
    nombreArchivo,
    file.buffer,
    file.mimetype
  );
  // Construir URL pública (ajusta si usas gateway o proxy)
  const location = `${process.env.MINIO_PUBLIC_URL || "http://localhost:9000"}/${bucketName}/${nombreArchivo}`;
  return { location, key: nombreArchivo };
}   