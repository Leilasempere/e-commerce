// sert à vérifier si l'utilisateur est un administrateur

export const isAdmin = (req, res, next) => {
    try {
        
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Accès interdit : administrateur requis' });
        }
        next();
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur dans le middleware isAdmin' });
    }
};

