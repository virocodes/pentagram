export interface Post {
    image: string;
    caption: string;
    user: string;
}

export interface User {
    uid: string;
    displayName: string;
    email: string;
    photoURL: string;
}