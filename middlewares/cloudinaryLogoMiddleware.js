import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../utils/cloudinary.js";

// Storage Cloudinary (upload direct)
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "ecommerce/logos",
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
        transformation: [{ width: 512, height: 512, crop: "limit" }],
    },
});

// Filtre MIME (images uniquement)
const fileFilter = (_req, file, cb) => {
    if (file.mimetype && file.mimetype.startsWith("image/")) return cb(null, true);
    cb(new Error("Seules les images sont autorisées."), false);
};

// Limite 2 Mo
export const uploadLogo = multer({
    storage,
    fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 },
}).single("logo");

// Si un fichier est uploadé, on met son URL dans req.body.logo_url pour la validation Joi
export const setLogoUrlFromFile = (req, _res, next) => {
    if (req.file && req.file.path) {
        req.body.logo_url = req.file.path; 
    }
    next();
};
