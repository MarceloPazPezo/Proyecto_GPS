import multer from 'multer';
import makeMinioStorage from '../helpers/minioStorage.helper.js';

const storage = makeMinioStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten archivos de imagen.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 10 // Límite de 10 MB
  }
});

export default upload;