'use client'

import { useAuthState } from "react-firebase-hooks/auth";
import { auth, googleProvider } from "../../firebase";
import { useRouter } from "next/navigation";
import { signInWithPopup } from "firebase/auth";
export default function Landing() {
    const router = useRouter();
    const [user, loading] = useAuthState(auth);
    const handleClick = async () => {
        await signInWithPopup(auth, googleProvider);
        router.push("/home");
    }
    return (
        <div className="flex min-h-screen">
            <div className="flex flex-col items-center justify-center bg-background text-foreground w-[800px] h-[800px] m-auto">
                <button onClick={handleClick} className="text-[20rem] font-bold font-sans group pb-12">
                    <span className="text-red-400 group-hover:text-black transition-colors">[</span>
                    <span className="text-black group-hover:text-red-400 transition-colors">v</span>
                    <span className="text-red-400 group-hover:text-black transition-colors">z</span>
                    <span className="text-black group-hover:text-red-400 transition-colors">n</span>
                    <span className="text-red-400 group-hover:text-black transition-colors">]</span>
                </button>
            </div>
        </div>
    )
}