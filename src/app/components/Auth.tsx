'use client'
import { auth, googleProvider, firestore, storage } from "../../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { signInWithPopup, signOut } from "firebase/auth";

export default function Auth() {
    const [user] = useAuthState(auth);
    return (
        <div>
            {user ? ( <button onClick={() => signOut(auth)} className="p-4 rounded-full bg-foreground text-background hover:bg-[#383838] dark:hover:bg-[#ccc] transition-colors shadow-lg">Log out</button> ) : ( <button onClick={() => signInWithPopup(auth, googleProvider)} className="p-4 rounded-full bg-foreground text-background hover:bg-[#383838] dark:hover:bg-[#ccc] transition-colors shadow-lg">Log in</button> )}
        </div>
    )
}