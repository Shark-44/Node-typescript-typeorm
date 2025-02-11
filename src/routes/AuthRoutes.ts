import express, { Request, Response } from "express"; 
import { login } from "../controllers/AuthController";
import registerRoute from "./register";

const router = express.Router();

// Définition de la route de connexion
router.post("/login", async (req: Request, res: Response) => {
    try {
        await login(req, res);
    } catch (error) {
        console.error("Erreur lors de la connexion :", error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
});
router.use(registerRoute);

export default router;
