export interface Role {
    getRoleName(): string;
    canEditContent(): boolean;
}

export class Admin implements Role {
    getRoleName(): string {
        return "Admin";
    }
    canEditContent(): boolean {
        return true;
    }
}

export class Moderator implements Role {
    getRoleName(): string {
        return "Modérateur";
    }
    canEditContent(): boolean {
        return true;
    }
}

export class RegularUser implements Role {
    getRoleName(): string {
        return "User";
    }
    canEditContent(): boolean {
        return false;
    }
}
