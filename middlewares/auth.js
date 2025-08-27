// Middleware pour simuler un utilisateur connecté
export const authMiddleware = (req, res, next) => {
    try {
        // Simuler un utilisateur connecté
        // Change role: 'buyer' ou 'admin' pour tester les routes
        req.user = {
            id: 1,           // ID fictif
            name: "Test User",
            email: "test@example.com",
            role: "admin"    // ou "buyer"
        };

        next(); // Passe à la route suivante
    } catch (error) {
        res.status(500).json({ error: "Erreur dans le middleware d'authentification" });
    }
};
