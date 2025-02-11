import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Étendre l'interface Request pour inclure notre propriété user
declare global {
    namespace Express {
        interface Request {
            user?: DecodedUser;
        }
    }
}

interface DecodedUser {
    username: string;
    role: string;
}

export const authenticated = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header("Authorization");
    
    if (!token) {
        res.status(401).json({ message: "Accès non autorisé" });
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret") as DecodedUser;
        req.user = decoded; // Maintenant on peut accéder directement à req.user
        next();
    } catch (err) {
        res.status(403).json({ message: "Token invalide" });
        return;
    }
};

export const authorizeRole = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = req.user; // Maintenant on peut accéder directement à req.user
        
        if (!user || !roles.includes(user.role)) {
            res.status(403).json({ message: "Accès interdit" });
            return;
        }
        
        next();
    };
};