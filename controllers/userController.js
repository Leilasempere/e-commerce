import { getUserById, getAllUsers, updateUserById, deleteUserById } from "../models/userModel.js";


export const getAllUsersController = async (_req, res) => {
    try {
        const users = await getAllUsers();
        res.json(users);
    } catch (err) {
        console.error("Erreur getAllUsers:", err);
        res.status(500).json({ message: "Erreur serveur." });
    }
};


export const getUserByIdController = async (req, res) => {
    try {
        const user = await getUserById(req.params.id);
        if (!user) return res.status(404).json({ message: "Utilisateur non trouvé." });
        res.json(user);
    } catch (err) {
        console.error("Erreur getUserById:", err);
        res.status(500).json({ message: "Erreur serveur." });
    }
};


export const updateMe = async (req, res) => {
    try {
        const { firstname, lastname, email, role } = req.body;
        await updateUserById(req.user.id, { firstname, lastname, email, role });
        const updated = await getUserById(req.user.id);
        res.json(updated);
    } catch (err) {
        console.error("Erreur updateMe:", err);
        res.status(500).json({ message: "Erreur serveur." });
    }
};


export const deleteUserController = async (req, res) => {
    try {
        await deleteUserById(req.params.id);
        res.json({ message: "Utilisateur supprimé." });
    } catch (err) {
        console.error("Erreur deleteUser:", err);
        res.status(500).json({ message: "Erreur serveur." });
    }
};


export const protectedExample = (req, res) => {
    res.json({ message: `Bonjour utilisateur ${req.user.id}, accès autorisé !` });
};
