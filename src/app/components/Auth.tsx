'use client'
import { auth, googleProvider } from "../../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { signInWithPopup, signOut } from "firebase/auth";

export default function Auth() {
    const [user] = useAuthState(auth);
    return (
        <div>
            {user ? ( 
                <button onClick={() => signOut(auth)} 
                    className="p-4 bg-foreground text-background transition-colors duration-300 text-2xl font-bold group"
                >
                    <span className="text-red-400 group-hover:text-background duration-300">[</span>
                    <span className="group-hover:text-red-400 duration-300">logout</span>
                    <span className="text-red-400 group-hover:text-background duration-300">]</span>
                </button>
             ) :  
               ( <button onClick={() => signInWithPopup(auth, googleProvider)} className="p-4 bg-foreground text-background transition-colors duration-300 text-2xl font-bold group">
                    <span className="text-red-400 group-hover:text-background duration-300">[</span>
                    <span className="group-hover:text-red-400 duration-300">login</span>
                    <span className="text-red-400 group-hover:text-background duration-300">]</span>
                </button> )}
        </div>
    )
}