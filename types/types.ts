

export interface User {
    uid: string;
    displayName: string;
    email: string;
    photoURL: string;
}

export interface Board {
    id: string;
    name: string;
    createdAt: Date;
    user: User;
}