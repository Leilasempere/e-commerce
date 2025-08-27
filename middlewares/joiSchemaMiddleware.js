// middlewares/joiSchemaMiddleware.js
import Joi from "joi";

const password = Joi.string()
    .min(8)
    .max(20)

    .messages({
        "string.min": "Le mot de passe doit contenir au moins 8 et maximum 20 caractères.",
        "string.empty": "Le mot de passe est requis.",
});

export const registerSchema = Joi.object({
    firstname: Joi.string().min(2).max(50).required().messages({
        "string.empty": "Le prénom est requis.",
        "string.min": "Le prénom doit contenir au moins 2 caractères.",
    }),
    lastname: Joi.string().min(2).max(50).required().messages({
        "string.empty": "Le nom est requis.",
        "string.min": "Le nom doit contenir au moins 2 caractères.",
    }),
    email: Joi.string().email({ tlds: { allow: false } }).required().messages({
        "string.email": "Le format de l'email est invalide.",
        "string.empty": "L'email est requis.",
    }),
    password: password.required(),
    confirmPassword: Joi.string()
        .valid(Joi.ref("password"))
        .required()
        .messages({
        "any.only": "Les mots de passe ne correspondent pas.",
        "string.empty": "La confirmation du mot de passe est requise.",
        }),
    role: Joi.string().valid("buyer", "seller", "admin").default("buyer"),
    brandname: Joi.string().allow(null, ""),
    logo_url: Joi.string().uri().allow(null, ""),
});

export const loginSchema = Joi.object({
    email: Joi.string().email({ tlds: { allow: false } }).required().messages({
        "string.email": "Email invalide.",
        "string.empty": "Email requis.",
    }),
    password: Joi.string().required().messages({
        "string.empty": "Mot de passe requis.",
    }),
});

export const forgotSchema = Joi.object({
    email: Joi.string().email({ tlds: { allow: false } }).required().messages({
        "string.email": "Email invalide.",
        "string.empty": "Email requis.",
    }),
});

export const resetSchema = Joi.object({
    password: password.required(),
    confirmPassword: Joi.string()
        .valid(Joi.ref("password"))
        .required()
        .messages({
        "any.only": "Les mots de passe ne correspondent pas.",
        "string.empty": "La confirmation du mot de passe est requise.",
        }),
});


export { registerSchema as createUserSchema };
