import express from "express";
import { authenticated, authorizeRole } from "../middelwares/AuthMiddleware";

const router = express.Router();

// Route accessible uniquement par les admins
router.get("/admin", authenticated, authorizeRole(["Admin"]), (req, res) => {
    res.json({ message: "Bienvenue Admin !" });
});

// Route accessible par les admins et modérateurs
router.get("/moderator", authenticated, authorizeRole(["Admin", "Modérateur"]), (req, res) => {
    res.json({ message: "Bienvenue Modérateur !" });
});

// Route accessible par les utilisateurs authentifiés
router.get("/user", authenticated, (req, res) => {
    res.json({ message: "Bienvenue Utilisateur !" });
});

export default router;
