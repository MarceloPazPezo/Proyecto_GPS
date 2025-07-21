import Joi from "joi";

export const quizBodyValidation = Joi.object({
  nombre: Joi.string()
    .max(120)
    .min(1)
    .pattern(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]+$/)
    .messages({
      "string.empty": "El nombre no puede estar vacío.",
      "string.base": "El nombre debe ser de tipo string.",
      "string.min": "El nombre debe tener como mínimo 1 caracter.",
      "string.max": "El nombre debe tener como máximo 120 caracteres.",
      "string.pattern.base": "El nombre solo puede contener letras y espacios.",
    }),
  idUser: Joi.number().positive().integer().messages({
    "number.base": "El id debe ser un número.",
    "number.integer": "El id debe ser un número entero.",
    "number.positive": "El id debe ser un número positivo.",
  }),
})
  .and("nombre", "idUser")
  .unknown(false)
  .messages({
    "object.unknown": "No se permiten propiedades adicionales.",
    "object.and": "Debes proporcionar idUser y nombre.",
  });

export const quizQueryValidation = Joi.object({
  id: Joi.number().integer().positive().messages({
    "number.base": "La id debe ser un numero",
    "number.integer": "La id debe ser un entero",
    "number.positive": "La id debe ser positivo",
  }),
  idUser: Joi.number().integer().positive().messages({
    "number.base": "La id debe ser un numero",
    "number.integer": "La id debe ser un entero",
    "number.positive": "La id debe ser positivo",
  }),
  nombre: Joi.string()
    .max(120)
    .min(1)
    .pattern(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]+$/)
    .messages({
      "string.empty": "El nombre no puede estar vacío.",
      "string.base": "El nombre debe ser de tipo string.",
      "string.min": "El nombre debe tener como mínimo 1 caracter.",
      "string.max": "El nombre debe tener como máximo 120 caracteres.",
      "string.pattern.base": "El nombre solo puede contener letras y espacios.",
    }),
})
  .or("id", "idUser", "nombre")
  .and("idUser", "nombre")
  .unknown(false)
  .messages({
    "object.unknown": "No se permiten propiedades adicionales.",
    "object.and": "El nombre y el idUser deben proporcionarse juntos.",
    "object.missing":
      "Debes proporcionar idUser y nombre o id del cuestionario.",
  });

export const quizUserValidation = Joi.object({
  idUser: Joi.number().integer().positive().required().messages({
    "number.base": "La id debe ser un numero",
    "number.integer": "La id debe ser un entero",
    "number.positive": "La id debe ser positivo",
    "any.required": "El idUser es un parámetro requerido."
  }),
})
  .unknown(false)
  .messages({
    "object.unknown": "No se permiten propiedades adicionales.",
  });