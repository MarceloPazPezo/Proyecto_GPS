import { minioClient, bucketName } from '../config/configMinio.js'; // Tu configuración de Minio
import path from 'path';

/**
 * Función que maneja la subida del archivo a Minio.
 * @param {object} req - El objeto de la petición de Express.
 * @param {object} file - El objeto del archivo que proporciona Multer.
 * @param {function} cb - El callback para notificar a Multer que hemos terminado.
 */
function handleFile(req, file, cb) {
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
  const extension = path.extname(file.originalname);
  const objectName = `${file.fieldname}-${uniqueSuffix}${extension}`;

  const metaData = {
    'Content-Type': file.mimetype,
  };

  minioClient.putObject(bucketName, objectName, file.stream, metaData, (err, etag) => {
    if (err) {
      return cb(err);
    }

    cb(null, {
      bucket: bucketName,
      key: objectName,
      etag: etag.etag,
      location: `${process.env.MINIO_PROTOCOL || 'http'}://${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}/${bucketName}/${objectName}`,
      mimetype: file.mimetype,
      originalname: file.originalname
    });
  });
}

/**
 * Función que maneja la eliminación de un archivo en caso de error (rollback).
 * @param {object} req - El objeto de la petición de Express.
 * @param {object} file - El objeto del archivo a eliminar.
 * @param {function} cb - El callback para notificar a Multer que hemos terminado.
 */
function removeFile(req, file, cb) {
  minioClient.removeObject(bucketName, file.key, (err) => {
    if (err) {
      console.error(`Error al intentar eliminar el archivo '${file.key}' durante el rollback.`, err);
      return cb(err);
    }
    //console.log(`Archivo '${file.key}' eliminado exitosamente durante el rollback.`);
    cb(null);
  });
}

/**
 * Función que crea y devuelve el objeto del motor de almacenamiento para Multer.
 * Este es un "factory function".
 */
export default function makeMinioStorage() {
  return {
    _handleFile: handleFile,
    _removeFile: removeFile
  };
}