"use strict";
import Joi from "joi";

export const carreraCreateValidation = Joi.object({
  nombre: Joi.string().min(5).max(100).required().messages({
    "string.empty": "El nombre no puede estar vacío.",
    "any.required": "El nombre es obligatorio.",
    "string.base": "El nombre debe ser de tipo texto.",
    "string.min": "El nombre debe tener al menos 5 caracteres.",
    "string.max": "El nombre debe tener como máximo 100 caracteres.",
  }),
  codigo: Joi.string().min(2).max(10).required().messages({
    "string.empty": "El código no puede estar vacío.",
    "any.required": "El código es obligatorio.",
    "string.base": "El código debe ser de tipo texto.",
    "string.min": "El código debe tener al menos 2 caracteres.",
    "string.max": "El código debe tener como máximo 10 caracteres.",
  }),
  descripcion: Joi.string().min(10).max(500).optional().allow('', null).messages({
    "string.base": "La descripción debe ser de tipo texto.",
    "string.min": "La descripción debe tener al menos 10 caracteres.",
    "string.max": "La descripción debe tener como máximo 500 caracteres.",
  }),
  departamento: Joi.string().min(5).max(100).required().messages({
    "string.empty": "El departamento no puede estar vacío.",
    "any.required": "El departamento es obligatorio.",
    "string.base": "El departamento debe ser de tipo texto.",
    "string.min": "El departamento debe tener al menos 5 caracteres.",
    "string.max": "El departamento debe tener como máximo 100 caracteres.",
  }),
  idEncargado: Joi.number().integer().positive().required().messages({
    "number.base": "El id del encargado debe ser un número.",
    "number.integer": "El id del encargado debe ser un número entero.",
    "number.positive": "El id del encargado debe ser un número positivo.",
    "any.required": "El id del encargado es obligatorio.",
  }),
})
  .unknown(false)
  .messages({
    "object.unknown": "No se permiten propiedades adicionales.",
  });

export const carreraBodyValidation = Joi.object({
  nombre: Joi.string().min(5).max(100).messages({
    "string.empty": "El nombre no puede estar vacío.",
    "string.base": "El nombre debe ser de tipo texto.",
    "string.min": "El nombre debe tener al menos 5 caracteres.",
    "string.max": "El nombre debe tener como máximo 100 caracteres.",
  }),
  codigo: Joi.string().min(2).max(10).messages({
    "string.empty": "El código no puede estar vacío.",
    "string.base": "El código debe ser de tipo texto.",
    "string.min": "El código debe tener al menos 2 caracteres.",
    "string.max": "El código debe tener como máximo 10 caracteres.",
  }),
  descripcion: Joi.string().min(10).max(500).allow('', null).messages({
    "string.base": "La descripción debe ser de tipo texto.",
    "string.min": "La descripción debe tener al menos 10 caracteres.",
    "string.max": "La descripción debe tener como máximo 500 caracteres.",
  }),
  departamento: Joi.string().min(5).max(100).messages({
    "string.empty": "El departamento no puede estar vacío.",
    "string.base": "El departamento debe ser de tipo texto.",
    "string.min": "El departamento debe tener al menos 5 caracteres.",
    "string.max": "El departamento debe tener como máximo 100 caracteres.",
  }),
  idEncargado: Joi.number().integer().positive().messages({
    "number.base": "El id del encargado debe ser un número.",
    "number.integer": "El id del encargado debe ser un número entero.",
    "number.positive": "El id del encargado debe ser un número positivo.",
  }),
})
  .or("nombre", "codigo", "descripcion", "departamento", "idEncargado")
  .unknown(false)
  .messages({
    "object.unknown": "No se permiten propiedades adicionales.",
    "object.missing": "Debes proporcionar al menos un campo para actualizar.",
  });

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
    "string.max": "El nombre debe tener como máximo 100 caracteres.",
  }),
  codigo: Joi.string().min(2).max(10).messages({
    "string.empty": "El código no puede estar vacío.",
    "string.base": "El código debe ser de tipo texto.",
    "string.min": "El código debe tener al menos 2 caracteres.",
    "string.max": "El código debe tener como máximo 10 caracteres.",
  }),
  departamento: Joi.string().min(3).max(100).messages({
    "string.empty": "El departamento no puede estar vacío.",
    "string.base": "El departamento debe ser de tipo texto.",
    "string.min": "El departamento debe tener al menos 3 caracteres.",
    "string.max": "El departamento debe tener como máximo 100 caracteres.",
  }),
})
  .or("id", "nombre", "codigo", "departamento")
  .unknown(false)
  .messages({
    "object.unknown": "No se permiten propiedades adicionales.",
    "object.missing": "Debes proporcionar al menos un parámetro de búsqueda.",
  });

export const carreraImportValidation = Joi.object({
  nombre: Joi.string().min(5).max(100).required().messages({
    "string.empty": "El nombre no puede estar vacío.",
    "any.required": "El nombre es obligatorio.",
    "string.base": "El nombre debe ser de tipo texto.",
    "string.min": "El nombre debe tener al menos 5 caracteres.",
    "string.max": "El nombre debe tener como máximo 100 caracteres.",
  }),
  codigo: Joi.string().min(2).max(10).required().messages({
    "string.empty": "El código no puede estar vacío.",
    "any.required": "El código es obligatorio.",
    "string.base": "El código debe ser de tipo texto.",
    "string.min": "El código debe tener al menos 2 caracteres.",
    "string.max": "El código debe tener como máximo 10 caracteres.",
  }),
  descripcion: Joi.string().min(10).max(500).optional().allow('', null).messages({
    "string.base": "La descripción debe ser de tipo texto.",
    "string.min": "La descripción debe tener al menos 10 caracteres.",
    "string.max": "La descripción debe tener como máximo 500 caracteres.",
  }),
  departamento: Joi.string().min(5).max(100).required().messages({
    "string.empty": "El departamento no puede estar vacío.",
    "any.required": "El departamento es obligatorio.",
    "string.base": "El departamento debe ser de tipo texto.",
    "string.min": "El departamento debe tener al menos 5 caracteres.",
    "string.max": "El departamento debe tener como máximo 100 caracteres.",
  }),
  rutEncargado: Joi.string().pattern(/^[0-9]+-[0-9kK]$/).required().messages({
    "string.empty": "El RUT del encargado no puede estar vacío.",
    "any.required": "El RUT del encargado es obligatorio.",
    "string.base": "El RUT del encargado debe ser de tipo texto.",
    "string.pattern.base": "El RUT del encargado debe tener el formato correcto (ej: 12345678-9).",
  }),
})
  .unknown(false)
  .messages({
    "object.unknown": "No se permiten propiedades adicionales.",
  });