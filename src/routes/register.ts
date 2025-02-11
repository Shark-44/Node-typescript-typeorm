import express from "express";
import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source"; // Assurez-vous que AppDataSource est correctement importé
import { User } from "../models/User";

const router = express.Router();

router.post("/register", async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, password, role } = req.body;
        if (!username || !password || !role) {
            res.status(400).json({ message: "Tous les champs sont requis" });
            return;
        }

        // Vérifier et initialiser la connexion si nécessaire
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize(); // S'assurer que la connexion est bien initialisée
        }

        const userRepository = AppDataSource.getRepository(User);

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await userRepository.findOne({ where: { username } });
        if (existingUser) {
            res.status(400).json({ message: "Cet utilisateur existe déjà" });
            return;
        }

        // Créer et sauvegarder l'utilisateur
        const newUser = userRepository.create({ username, passwordHash: password, role });
        await userRepository.save(newUser);

        res.status(201).json({ message: "Utilisateur créé avec succès" });
    } catch (error) {
        console.error("Erreur lors de l'enregistrement :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
});

export default router;
