// user.ts (Entité User avec TypeORM)
import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert } from "typeorm";
import bcrypt from "bcrypt";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    username: string;

    @Column()
    passwordHash: string;

    @Column({ default: 0 })
    failedAttempts!: number;

    @Column({ default: false })
    isLocked!: boolean;

    @Column()
    role: string;

    constructor(username: string, password: string, role: string) {
        this.username = username;
        this.passwordHash = password;
        this.role = role;
    }

    @BeforeInsert()
    async hashPassword() {
        this.passwordHash = await bcrypt.hash(this.passwordHash, 10);
    }

    async authenticate(password: string): Promise<boolean> {
        if (this.isLocked) {
            console.log("Compte verrouillé !");
            return false;
        }

        const isMatch = await bcrypt.compare(password, this.passwordHash);
        if (isMatch) {
            this.failedAttempts = 0;
            this.isLocked = false;
            return true;
        } else {
            this.failedAttempts++;
            if (this.failedAttempts >= 3) {
                this.isLocked = true;
            }
            return false;
        }
    }

    unlockAccount() {
        this.failedAttempts = 0;
        this.isLocked = false;
    }
}
