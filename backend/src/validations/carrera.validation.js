"use strict";
import Joi from "joi";

export const carreraQueryValidation = Joi.object({
  id: Joi.number().integer().positive().messages({
    "number.base": "El id debe ser un número.",
    "number.integer": "El id debe ser un número entero.",
    "number.positive": "El id debe ser un número positivo.",
  }),
  nombre: Joi.string().min(3).max(100).messages({
    "string.empty": "El nombre no puede estar vacío.",
    "string.base": "El nombre debe ser de tipo string.",
    "string.min": "El nombre debe tener como mínimo 3 caracteres.",
    "string.max": "El nombre debe tener como máximo 100 caracteres."
  })
})
  .or("id", "nombre")
  .unknown(false)
  .messages({
    "object.unknown": "No se permiten propiedades adicionales.",
    "object.missing": "Debes proporcionar al menos un parámetro: id o nombre."
  });

export const carreraBodyValidation = Joi.object({
  nombre: Joi.string().min(3).max(100).messages({
    "string.empty": "El nombre no puede estar vacío.",
    "string.base": "El nombre debe ser de tipo string.",
    "string.min": "El nombre debe tener como mínimo 3 caracteres.",
    "string.max": "El nombre debe tener como máximo 100 caracteres."
  })
})
  .or("nombre")
  .unknown(false)
  .messages({
    "object.unknown": "No se permiten propiedades adicionales.",
    "object.missing": "Debes proporcionar al menos un campo: nombre."
  });

export const carreraCreateValidation = Joi.object({
  nombre: Joi.string().min(3).max(100).required().messages({
    "string.empty": "El nombre no puede estar vacío.",
    "any.required": "El nombre es obligatorio.",
    "string.base": "El nombre debe ser de tipo texto.",
    "string.min": "El nombre debe tener al menos 3 caracteres.",
    "string.max": "El nombre debe tener como máximo 100 caracteres."
  })
})
  .or("nombre")
  .unknown(false)
  .messages({
    "object.unknown": "No se permiten propiedades adicionales."
  });
