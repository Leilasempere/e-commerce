import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();


export const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ message: "Token requis." });

    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ message: "Token invalide." });

        req.user = decoded;
        next();
    });
};

export const generateToken = (user) => {
    return jwt.sign({ id: user.id, email: user.email, role: user.role, verified: !!user.is_verified  }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
}


export const isAdmin = (req, res, next) => {
    if (req.user?.role !== "admin") {
        return res.status(403).json({ message: "Accès réservé aux administrateurs." });
    }
    next();
};


export const isSeller = (req, res, next) => {
    if (req.user?.role !== "seller") {
        return res.status(403).json({ message: "Accès réservé aux vendeurs." });
    }
    next();
};


export const isBuyer = (req, res, next) => {
    if (req.user?.role !== "buyer") {
        return res.status(403).json({ message: "Accès réservé aux acheteurs." });
    }
    next();
};