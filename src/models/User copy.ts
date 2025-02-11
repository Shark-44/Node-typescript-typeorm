import { Role } from "./Role";
import bcrypt from "bcrypt";

export class User {
    private username: string;
    private passwordHash: string;
    private failedAttempts: number = 0;
    private isLocked: boolean = false;
    private role: Role;

    constructor(username: string, password: string, role: Role) {
        this.username = username;
        this.passwordHash = this.hashPassword(password); // Hashage du mot de passe lors de la création de l'utilisateur
        this.role = role;
    }

    // Méthode pour hacher le mot de passe (utilise bcrypt)
    private hashPassword(password: string): string {
        return bcrypt.hashSync(password, 10); // Le "10" est le nombre de tours pour bcrypt
    }

    // Méthode d'authentification avec comparaison de mot de passe
    async authenticate(password: string): Promise<boolean> {
        if (this.isLocked) {
            console.log("Compte verrouillé !");
            return false;
        }

        const isMatch = await bcrypt.compare(password, this.passwordHash); // Comparaison du mot de passe
        if (isMatch) {
            this.failedAttempts = 0; // Réinitialisation des tentatives échouées
            return true;
        } else {
            this.failedAttempts++; // Incrémentation des tentatives échouées
            if (this.failedAttempts >= 3) {
                this.isLocked = true; // Si 3 tentatives échouées, verrouillage du compte
            }
            return false;
        }
    }

    // Méthode pour débloquer un compte après 3 tentatives échouées
    unlockAccount() {
        this.failedAttempts = 0;
        this.isLocked = false;
    }

    // Retourne le rôle de l'utilisateur (ex: Admin, Modérateur, etc.)
    getRole(): string {
        return this.role.getRoleName();
    }

    // Vérifie si l'utilisateur peut modifier du contenu en fonction de son rôle
    canEditContent(): boolean {
        return this.role.canEditContent();
    }
}
