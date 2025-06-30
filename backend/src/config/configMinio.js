"use strict";
import { Client } from "minio";
import {
  MINIO_ENDPOINT,
  MINIO_PORT,
  MINIO_USE_SSL,
  MINIO_ACCESS_KEY,
  MINIO_SECRET_KEY,
  MINIO_BUCKET_NAME,
} from "./configEnv.js";

export const minioClient = new Client({
  endPoint: MINIO_ENDPOINT,
  port: parseInt(MINIO_PORT, 10),
  useSSL: MINIO_USE_SSL === "true",
  accessKey: MINIO_ACCESS_KEY,
  secretKey: MINIO_SECRET_KEY,
});

export async function initializeMinio() {
  console.log("=> Inicializando MinIO...");
  try {
    const bucketExists = await minioClient.bucketExists(MINIO_BUCKET_NAME);

    if (!bucketExists) {
      console.log(`Bucket '${MINIO_BUCKET_NAME}' no encontrado. Creándolo...`);
      await minioClient.makeBucket(MINIO_BUCKET_NAME);
      console.log(`Bucket '${MINIO_BUCKET_NAME}' creado exitosamente.`);
    } else {
      console.log(`Bucket '${MINIO_BUCKET_NAME}' ya existe.`);
    }
    const publicPolicy = {
      Version: "2012-10-17",
      Statement: [
        {
          Effect: "Allow",
          Principal: "*",
          Action: ["s3:GetObject"],
          Resource: [`arn:aws:s3:::${MINIO_BUCKET_NAME}/*`],
        },
      ],
    };

    // Aplicar la política
    await minioClient.setBucketPolicy(MINIO_BUCKET_NAME, JSON.stringify(publicPolicy));
    console.log("=> Conexión y configuración de MinIO exitosa!");
  } catch (error) {
    console.error("Error al inicializar MinIO:", error);
    process.exit(1);
  }
}

export const bucketName = MINIO_BUCKET_NAME;
