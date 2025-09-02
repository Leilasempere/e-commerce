import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { createUser, getUserByEmail } from "../models/userModel.js";
import pool from "../config/db.js";
import sendVerificationEmail from "../utils/mailer.js"; 

const JWT_SECRET = process.env.JWT_SECRET;
const CLIENT_URL = process.env.CLIENT_URL || process.env.FRONTEND_URL || "http://localhost:3000";



const signAccess = (payload) => jwt.sign(payload, JWT_SECRET, { expiresIn: "5h" });


export const register = async (req, res) => {
    const { firstname, lastname, email, password, confirmPassword, role = "buyer", brandname, logo_url } = req.body;

    if (!firstname || !lastname || !email || !password || !confirmPassword) {
        return res.status(400).json({ message: "Tous les champs requis." });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ message: "Les mots de passe ne correspondent pas." });
    }

    try {
        const exists = await getUserByEmail(email);
        if (exists) {
        return res.status(400).json({ message: "Email déjà utilisé." });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const verifyToken = jwt.sign(
        {
            firstname,
            lastname,
            email: email.toLowerCase().trim(),
            password_hash,
            role,
            brandname: brandname || null,
            logo_url: logo_url || null,
        },
        JWT_SECRET,
        { expiresIn: "24h" }
    );

    const verificationUrl = `${CLIENT_URL}/api/auth/verify/${verifyToken}`;

    try {
        await sendVerificationEmail({
            to: email,
            subject: "Vérification de votre compte",
            html: `
            Bonjour ${firstname},<br><br>
            Merci pour votre inscription.<br>
            Cliquez ici pour créer et activer votre compte :
            <a href="${verificationUrl}">Activer mon compte</a><br><br>
            Ce lien est valable 24h.
            Si vous n'êtes pas à l'origine de cette inscription, ignorez cet email.
            `,
        });
    } catch (mailErr) {
        console.error("Email de vérification non envoyé:", mailErr.message);
        return res.status(500).json({ message: "Impossible d'envoyer l'email de vérification." });
    }

    return res
        .status(201)
        .json({ message: "Email de vérification envoyé. Ouvrez-le pour créer votre compte." });
    } catch (err) {
        console.error("Erreur inscription (pre-signup):", err);
        return res.status(500).json({ message: "Erreur lors de l'inscription." });
    }
};


export const verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;

        let payload;
        try {
            payload = jwt.verify(token, JWT_SECRET);
        } catch {
            return res.status(400).json({ message: "Lien invalide ou expiré." });
        }

        // Si quelqu'un a déjà utilisé cet email, on refuse
        const existing = await getUserByEmail(payload.email);
        if (existing) {
            return res.status(400).json({ message: "Email déjà utilisé." });
        }


        // Création du compte au moment de la vérification (compte déjà vérifié)
        await createUser({
        firstname: payload.firstname,
        lastname: payload.lastname,
        brandname: payload.brandname,
        email: payload.email,
        password_hash: payload.password_hash,
        role: payload.role || "buyer",
        logo_url: payload.logo_url,
        is_verified: 1,
        verification_token: null,
        verification_expires: null,
        });

        return res.status(201).json({ message: "Compte créé et vérifié. Vous pouvez vous connecter." });
    } catch (err) {
        console.error("Erreur verifyEmail:", err);
        return res.status(400).json({ message: "Lien invalide ou expiré." });
    }
};


export const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Champs requis." });

    try {
        const user = await getUserByEmail(email);
        if (!user) return res.status(401).json({ message: "Utilisateur introuvable." });

        const ok = await bcrypt.compare(password, user.password_hash);
        if (!ok) return res.status(401).json({ message: "Mot de passe incorrect." });

        const payload = { id: user.id, role: user.role, verified: !!user.is_verified };
        const access_token = signAccess(payload);


        const userDto = {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        role: user.role,
        is_verified: !!user.is_verified,
        };

        return res.json({ message: "Connexion réussie", access_token, user: userDto });
    } catch (err) {
        console.error("Erreur connexion:", err);
        return res.status(500).json({ message: "Erreur lors de la connexion." });
    }
};

export const logout = (_req, res) => {
  return res.json({ message: "Déconnexion réussie." });
};


export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: "Email requis." });

        const user = await getUserByEmail(email);
        if (!user) return res.json({ message: "Si un compte existe, un email a été envoyé." });

        const token = crypto.randomBytes(32).toString("hex");
        const expires = new Date(Date.now() + 60 * 60 * 1000); // 1h

        await pool.execute(
        "UPDATE users SET password_reset_token = ?, password_reset_expires = ? WHERE id = ?",
        [token, expires, user.id]
        );

        const resetUrl = `${CLIENT_URL}/reset-password/${token}`;

        await sendVerificationEmail({
            to: email,
            subject: "Réinitialisation de votre mot de passe",
            html: `
                Bonjour ${user.firstname || ""},<br><br>
                Voici votre lien de réinitialisation (valable 1h) :
                <a href="${resetUrl}">Réinitialiser mon mot de passe</a><br><br>
                Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.
            `,
        });
        return res.json({ message: "Si un compte existe, un email a été envoyé." });
    } catch (err) {
        console.error("Erreur forgotPassword:", err);
        return res.status(500).json({ message: "Erreur lors de la demande de réinitialisation." });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password, confirmPassword } = req.body;
        if (!password || !confirmPassword) return res.status(400).json({ message: "Nouveau mot de passe et mot de passe de confirmation requis." });

        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Les mots de passe ne correspondent pas." });
        }

        const [rows] = await pool.execute(
        "SELECT id, password_reset_expires FROM users WHERE password_reset_token = ? LIMIT 1",
        [token]
        );
        const row = rows[0];
        if (!row) return res.status(400).json({ message: "Lien invalide." });

        if (row.password_reset_expires && new Date(row.password_reset_expires) < new Date()) {
        return res.status(400).json({ message: "Lien expiré." });
        }

        const password_hash = await bcrypt.hash(password, 10);

        await pool.execute(
        "UPDATE users SET password_hash = ?, password_reset_token = NULL, password_reset_expires = NULL WHERE id = ?",
        [password_hash, row.id]
        );

        return res.json({ message: "Mot de passe mis à jour." });
    } catch (err) {
        console.error("Erreur resetPassword:", err);
        return res.status(500).json({ message: "Erreur lors de la réinitialisation." });
    }
};