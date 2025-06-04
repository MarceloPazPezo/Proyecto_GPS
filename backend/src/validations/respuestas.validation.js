import Joi from "joi";

export const respuestaBodyValidation = Joi.object({
    textoRespuesta: Joi.string()
        .max(120)
        .min(1)
        .messages({
            "string.empty": "El texto de la respuesta no puede estar vacío.",
            "string.base": "El texto de la respuesta debe ser de tipo string.",
            "string.min": "El texto de la respuesta debe tener como mínimo 1 caracter.",
            "string.max": "El texto de la respuesta debe tener como máximo 120 caracteres.",
           
        }),
    idPreguntas: Joi.number()
        .positive()
        .integer()
        .messages({
            "number.base": "El id de la pregunta debe ser un número.",
            "number.integer": "El id de la pregunta debe ser un número entero.",
            "number.positive": "El id de la pregunta debe ser un número positivo.",
        }),
    correcta: Joi.boolean()
        .messages({
            "boolean.base": "El campo 'correcta' debe ser un booleano.",
        }),
}).and("textoRespuesta", "idPreguntas", "correcta")
    .unknown(false)
    .messages({
        "object.unknown": "No se permiten propiedades adicionales.",
        "object.missing": "Debes proporcionar textoRespuesta, idPreguntas y correcta.",
    });

export const respuestaQueryValidation = Joi.object({
    id: Joi.number()
        .integer()
        .positive()
        .messages({
            "number.base": "La id debe ser un numero",
            "number.integer": "La id debe ser un entero",
            "number.positive": "La id debe ser positivo"
        }),
    idPreguntas: Joi.number()
        .integer()
        .positive()
        .messages({
            "number.base": "La id de la pregunta debe ser un numero",
            "number.integer": "La id de la pregunta debe ser un entero",
            "number.positive": "La id de la pregunta debe ser positivo"
        }),
}).xor("id", "idPreguntas")
    .unknown(false)
    .messages({
        "object.unknown": "No se permiten propiedades adicionales.",
    });