import { useState } from "react";

import CreatePost from "./CreatePost";

export default function PostButton({images, setImages}: {images: {image: string, caption: string}[], setImages: (images: {image: string, caption: string}[]) => void}) {
    const [createOpen, setCreateOpen] = useState(false);
    return (
        <div className="flex flex-row items-center justify-center gap-2">
            <button className="p-4 rounded-full bg-foreground text-background hover:bg-[#383838] dark:hover:bg-[#ccc] transition-colors shadow-lg"
            onClick={() => setCreateOpen(!createOpen)}
            >
                <div className="flex flex-row items-center gap-2">
                    <p className="text-lg font-bold">Post</p>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                </div>
                
            </button>
            {createOpen && <CreatePost images={images} setImages={setImages} close={() => setCreateOpen(false)} />}
        </div>
    )
}