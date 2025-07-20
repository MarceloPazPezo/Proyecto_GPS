"use strict";
import Joi from "joi";
const ROLES = [
  "administrador",
  "encargado_carrera",
  "tutor",
  "tutorado",
  "usuario",
];

const stringPattern = /^[a-zA-ZáéíóúÁÉÍÓÚñÑàèìòùÀÈÌÒÙ\s]+$/;
const rutPattern = /^(?:\d{1,2}\.\d{3}\.\d{3}|\d{7,8})-[0-9kK]$/;
const domainEmailValidator = (value, helper) => {
  const validDomains = [
    "@gmail.cl",
    "@gmail.com",
    "@alumnos.ubiobio.cl",
    "@ubiobio.cl",
  ];
  if (!validDomains.some((domain) => value.endsWith(domain))) {
    return helper.message(
      "El correo electrónico debe ser del dominio @gmail.cl, @gmail.com, @alumnos.ubiobio.cl o @ubiobio.cl.",
    );
  }
  return value;
};

export const userQueryValidation = Joi.object({
  id: Joi.number().integer().positive().messages({
    "number.base": "El id debe ser un número.",
    "number.integer": "El id debe ser un número entero.",
    "number.positive": "El id debe ser un número positivo.",
  }),
  email: Joi.string()
    .min(15)
    .max(100)
    .email()
    .messages({
      "string.empty": "El correo electrónico no puede estar vacío.",
      "string.base": "El correo electrónico debe ser de tipo string.",
      "string.min":
        "El correo electrónico debe tener como mínimo 15 caracteres.",
      "string.max":
        "El correo electrónico debe tener como máximo 100 caracteres.",
    })
    .custom(domainEmailValidator, "Validación dominio email"),
  rut: Joi.string().min(9).max(12).pattern(rutPattern).messages({
    "string.empty": "El rut no puede estar vacío.",
    "string.base": "El rut debe ser de tipo string.",
    "string.min": "El rut debe tener como mínimo 9 caracteres.",
    "string.max": "El rut debe tener como máximo 12 caracteres.",
    "string.pattern.base":
      "Formato rut inválido, debe ser xx.xxx.xxx-x o xxxxxxxx-x.",
  }),
})
  .or("id", "email", "rut")
  .unknown(false)
  .messages({
    "object.unknown": "No se permiten propiedades adicionales.",
    "object.missing":
      "Debes proporcionar al menos un parámetro: id, email o rut.",
  });

export const userBodyValidation = Joi.object({
  nombreCompleto: Joi.string().min(15).max(50).pattern(stringPattern).messages({
    "string.empty": "El nombre completo no puede estar vacío.",
    "string.base": "El nombre completo debe ser de tipo string.",
    "string.min": "El nombre completo debe tener como mínimo 15 caracteres.",
    "string.max": "El nombre completo debe tener como máximo 50 caracteres.",
    "string.pattern.base":
      "El nombre completo solo puede contener letras y espacios.",
  }),
  email: Joi.string()
    .min(15)
    .max(100)
    .email()
    .messages({
      "string.empty": "El correo electrónico no puede estar vacío.",
      "string.base": "El correo electrónico debe ser de tipo string.",
      "string.email": "El correo electrónico debe finalizar en @gmail.cl.",
      "string.min":
        "El correo electrónico debe tener como mínimo 15 caracteres.",
      "string.max":
        "El correo electrónico debe tener como máximo 100 caracteres.",
    })
    .custom(domainEmailValidator, "Validación dominio email"),
  password: Joi.string()
    .min(8)
    .max(26)
    .pattern(/^[a-zA-Z0-9]+$/)
    .messages({
      "string.empty": "La contraseña no puede estar vacía.",
      "string.base": "La contraseña debe ser de tipo string.",
      "string.min": "La contraseña debe tener como mínimo 8 caracteres.",
      "string.max": "La contraseña debe tener como máximo 26 caracteres.",
      "string.pattern.base":
        "La contraseña solo puede contener letras y números.",
    }),
  newPassword: Joi.string()
    .min(8)
    .max(26)
    .allow("")
    .pattern(/^[a-zA-Z0-9]+$/)
    .messages({
      "string.empty": "La nueva contraseña no puede estar vacía.",
      "string.base": "La nueva contraseña debe ser de tipo string.",
      "string.min": "La nueva contraseña debe tener como mínimo 8 caracteres.",
      "string.max": "La nueva contraseña debe tener como máximo 26 caracteres.",
      "string.pattern.base":
        "La nueva contraseña solo puede contener letras y números.",
    }),
  rut: Joi.string().min(9).max(12).pattern(rutPattern).messages({
    "string.empty": "El rut no puede estar vacío.",
    "string.base": "El rut debe ser de tipo string.",
    "string.min": "El rut debe tener como mínimo 9 caracteres.",
    "string.max": "El rut debe tener como máximo 12 caracteres.",
    "string.pattern.base":
      "Formato rut inválido, debe ser xx.xxx.xxx-x o xxxxxxxx-x.",
  }),
  rol: Joi.string()
    .valid(...ROLES)
    .messages({
      "any.only": `El rol debe ser uno de los siguientes: ${ROLES.join(", ")}`,
      "string.base": "El rol debe ser de tipo texto.",
      "string.empty": "El rol no puede estar vacío.",
    }),
})
  .or("nombreCompleto", "email", "password", "newPassword", "rut", "rol")
  .unknown(false)
  .messages({
    "object.unknown": "No se permiten propiedades adicionales.",
    "object.missing":
      "Debes proporcionar al menos un campo: nombreCompleto, email, password, newPassword, rut o rol.",
  });

export const userCreateValidation = Joi.object({
  nombreCompleto: Joi.string()
    .min(15)
    .max(50)
    .pattern(stringPattern)
    .required()
    .messages({
      "string.empty": "El nombre completo no puede estar vacío.",
      "any.required": "El nombre completo es obligatorio.",
      "string.base": "El nombre completo debe ser de tipo texto.",
      "string.min": "El nombre completo debe tener al menos 15 caracteres.",
      "string.max": "El nombre completo debe tener como máximo 50 caracteres.",
      "string.pattern.base":
        "El nombre completo solo puede contener letras y espacios.",
    }),
  rut: Joi.string().min(9).max(12).required().pattern(rutPattern).messages({
    "string.empty": "El rut no puede estar vacío.",
    "string.base": "El rut debe ser de tipo string.",
    "string.min": "El rut debe tener como mínimo 9 caracteres.",
    "string.max": "El rut debe tener como máximo 12 caracteres.",
    "string.pattern.base":
      "Formato rut inválido, debe ser xx.xxx.xxx-x o xxxxxxxx-x.",
    "any.required": "El rut es obligatorio",
  }),
  email: Joi.string()
    .min(15)
    .max(100)
    .email()
    .required()
    .messages({
      "string.empty": "El correo electrónico no puede estar vacío.",
      "any.required": "El correo electrónico es obligatorio.",
      "string.base": "El correo electrónico debe ser de tipo texto.",
      "string.email": "El correo electrónico debe finalizar en @gmail.cl.",
      "string.min": "El correo electrónico debe tener al menos 15 caracteres.",
      "string.max":
        "El correo electrónico debe tener como máximo 100 caracteres.",
    })
    .custom(domainEmailValidator, "Validación dominio email"),
  password: Joi.string()
    .min(8)
    .max(26)
    .pattern(/^[a-zA-Z0-9]+$/)
    .required()
    .messages({
      "string.empty": "La contraseña no puede estar vacía.",
      "any.required": "La contraseña es obligatoria.",
      "string.base": "La contraseña debe ser de tipo texto.",
      "string.min": "La contraseña debe tener al menos 8 caracteres.",
      "string.max": "La contraseña debe tener como máximo 26 caracteres.",
      "string.pattern.base":
        "La contraseña solo puede contener letras y números.",
    }),
  rol: Joi.any()
    .custom((value, helpers) => {
      if (typeof value !== "string") {
        return helpers.error("string.base");
      }
      if (!ROLES.includes(value)) {
        return helpers.error("any.only");
      }
      return value;
    }, "Validación personalizada de rol")
    .messages({
      "string.base": "El rol debe ser de tipo string.",
      "any.only": `El rol debe ser uno de los siguientes: ${ROLES.join(", ")}`,
    }),
})
  .or("nombreCompleto", "email", "password", "rut", "rol")
  .unknown(false)
  .messages({
    "object.unknown": "No se permiten propiedades adicionales.",
  });
