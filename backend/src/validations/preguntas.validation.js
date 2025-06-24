import joi from "joi";

export const questionBodyValidation = joi.object({
    texto: joi.string()
        .max(500)
        .min(1)
        .messages({
            "string.empty": "El texto no puede estar vacío.",
            "string.base": "El texto debe ser de tipo string.",
            "string.min": "El texto debe tener como mínimo 1 caracter.",
            "string.max": "El texto debe tener como máximo 500 caracteres.", 
        }),
    idCuestionario: joi.number()
        .integer()
        .positive()
        .messages({
            "number.base": "El idCuestionario debe ser un número.",
            "number.integer": "El idCuestionario debe ser un número entero.",
            "number.positive": "El idCuestionario debe ser un número positivo.",
        }),
}).and("texto", "idCuestionario")
    .unknown(false)
    .messages({
        "object.unknown": "No se permiten propiedades adicionales.",
        "object.missing": "Debes proporcionar texto e idCuestionario.",
    });
    
export const questionQueryValidation = joi.object({
    id: joi.number()
        .integer()
        .positive()
        .messages({
            "number.base": "La id debe ser un numero",
            "number.integer": "La id debe ser un entero",
            "number.positive": "La id debe ser positivo"
        }),
    idCuestionario: joi.number()
        .integer()
        .positive()
        .messages({
            "number.base": "La idCuestionario debe ser un numero",
            "number.integer": "La idCuestionario debe ser un entero",
            "number.positive": "La idCuestionario debe ser positivo"
        }),
})  .xor("id", "idCuestionario")  //para que al menos uno de los dos campos esté presente pero no ambos
    .unknown(false);