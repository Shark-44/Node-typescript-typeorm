import express from "express";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { initializeDB } from "../config/data-source";
const router = express.Router();

// Créer une variable pour stocker la connexion
let db: any;

// Initialiser la connexion immédiatement
(async () => {
    try {
        db = await initializeDB();
    } catch (error) {
        console.error("Erreur de connexion à la base de données:", error);
        process.exit(1);
    }
})();

router.post("/register", async (req: Request, res: Response): Promise<void> => {
  
    try {
        // Vérifier que la connexion à la base de données est établie
        if (!db) {
            res.status(500).json({ message: "La connexion à la base de données n'est pas établie" });
            return;
        }

        const { username, password } = req.body;
        if (!username || !password) {
            res.status(400).json({ message: "Tous les champs sont requis" });
            return;
        }

        // Vérifier si l'utilisateur existe déjà
        const [existingUser] = await db.execute("SELECT * FROM user WHERE username = ?", [username]);
        if (Array.isArray(existingUser) && existingUser.length > 0) {
            res.status(400).json({ message: "Cet utilisateur existe déjà" });
            return;
        }

        // Hash du mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insérer l'utilisateur dans la base de données
        await db.execute("INSERT INTO user (username, password_hash) VALUES (?, ?)", [username, hashedPassword]);
        res.status(201).json({ message: "Utilisateur créé avec succès" });
    } catch (error) {
        console.error("Erreur lors de l'enregistrement :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
});

export default router;