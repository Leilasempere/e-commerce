import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { createUser, getUserByEmail, getUserById, setVerified} from "../models/userModel.js";
import db_sql from "../config/db.js";
import sendVerificationEmail from "../utils/mailer.js";

const JWT_SECRET = process.env.JWT_SECRET;
const CLIENT_URL = process.env.FRONTEND_URL || "http://localhost:3000";




const signAccess = (payload) =>
    jwt.sign(payload, JWT_SECRET, { expiresIn: "5h" });


export const register = async (req, res) => {
    const { firstname, lastname, email, password, role = "buyer", brandname, logo_url } = req.body;

    if (!firstname || !lastname || !email || !password) {
        return res.status(400).json({ message: "Tous les champs requis." });
    }

    try {
        const existing = await getUserByEmail(email);
        if (existing) return res.status(400).json({ message: "Email déjà utilisé." });

        const password_hash = await bcrypt.hash(password, 10);
        const verification_token = crypto.randomBytes(32).toString("hex");
        const verification_expires = new Date(Date.now() + 24 * 60 * 60 * 1000);

        const userId = await createUser({
            firstname,
            lastname,
            brandname,
            email,
            password_hash,
            role,
            logo_url,
            is_verified: 0,
            verification_token,
            verification_expires,
        });


        const verificationUrl = `${CLIENT_URL}/api/auth/verify/${verification_token}`;


        await sendVerificationEmail({
            to: email,
            subject: "Vérification de votre compte",
            html: `
                Bonjour ${firstname},<br><br>
                Merci pour votre inscription.<br>
                Cliquez ici pour vérifier votre compte : 
                <a href="${verificationUrl}">${verificationUrl}</a><br><br>
                Ce lien est valable 24h.
            `,
        });
    
        res.status(201).json({ message: "Utilisateur créé. Vérifiez votre email." });
        } catch (err) {
            console.error("Erreur inscription:", err);
            res.status(500).json({ message: "Erreur lors de l'inscription." });
        }
};



export const verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;
        const [rows] = await pool.execute(
        "SELECT id, verification_expires FROM users WHERE verification_token = ? LIMIT 1",
        [token]
        );
        const user = rows[0];
        if (!user) return res.status(400).json({ message: "Token invalide." });

        if (user.verification_expires && new Date(user.verification_expires) < new Date()) {
        return res.status(400).json({ message: "Token expiré." });
        }

        await setVerified(user.id, true);
        res.json({ message: "Email vérifié avec succès." });
    } catch (err) {
        console.error("Erreur vérification email:", err);
        res.status(400).json({ message: "Lien invalide ou expiré." });
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

        res.json({ message: "Connexion réussie", access_token });
    } catch (err) {
        console.error("Erreur connexion:", err);
        res.status(500).json({ message: "Erreur lors de la connexion." });
    }
};

export const logout = (_req, res) => {
    res.json({ message: "Déconnexion réussie (supprimez le token côté client)." });
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
            Vous avez demandé à réinitialiser votre mot de passe.<br>
            Cliquez sur ce lien (valable 1h) : 
            <a href="${resetUrl}">${resetUrl}</a><br><br>
            Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.
            `,
        });
  
        res.json({ message: "Si un compte existe, un email a été envoyé." });
    } catch (err) {
        console.error("Erreur forgotPassword:", err);
        res.status(500).json({ message: "Erreur lors de la demande de réinitialisation." });
    }
};
  

export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;
        if (!password) return res.status(400).json({ message: "Nouveau mot de passe requis." });
    
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
    
        res.json({ message: "Mot de passe mis à jour." });
    } catch (err) {
        console.error("Erreur resetPassword:", err);
        res.status(500).json({ message: "Erreur lors de la réinitialisation." });
    }
};
  