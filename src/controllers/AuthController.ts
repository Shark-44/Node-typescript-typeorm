import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { Admin, Moderator, RegularUser } from "../models/Role";
import { AppDataSource } from "../config/data-source";
import bcrypt from "bcrypt";

/*const users: User[] = [
    new User("admin", "password123", new Admin()),
    new User("mod", "password123", new Moderator()),
    new User("user", "password123", new RegularUser())
];*/

export const login = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Tous les champs sont requis" });
    }

    try {
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOneBy({ username });

        if (!user) {
            return res.status(401).json({ message: "Utilisateur introuvable" });
        }

        const isAuthenticated = await bcrypt.compare(password, user.passwordHash);
        if (!isAuthenticated) {
            return res.status(401).json({ message: "Mot de passe incorrect" });
        }

        const token = jwt.sign(
            { username: user.username, role: user.role },
            process.env.JWT_SECRET || "secret",
            { expiresIn: "1h" }
        );

        res.json({ message: "Connexion réussie", token });

    } catch (error) {
        console.error("Erreur lors de la connexion:", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};
