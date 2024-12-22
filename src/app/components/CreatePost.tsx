"use client";

import { useState } from "react";

export default function CreatePost({
    images, 
    setImages, 
    close,
    selectedIndex
}: {
    images: ({image: string, caption: string, success: boolean} | null)[],
    setImages: (images: ({image: string, caption: string, success: boolean} | null)[]) => void, 
    close: () => void,
    selectedIndex: number
}) {
    const [inputText, setInputText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
    
        try {
            const response = await fetch("/api/generate-image", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ text: inputText }),
            });
            const data = await response.json();
            setInputText("");

            const newImages = Array(15).fill(null).map((_, i) => 
                i === selectedIndex ? { ...data } : images[i]
            );
            setImages(newImages);

        } catch (error) {
            console.error("Error:", error);
        } finally {
            setIsLoading(false);
            close();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl w-[500px]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">
                <span className="text-red-400">[</span>
                <span className="text-black">new post</span>
                <span className="text-red-400">]</span>
              </h2>
              <button 
                className="text-gray-500 hover:text-gray-700"
                onClick={close}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
 
            <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-4">
                    <input
                        autoFocus
                        type="text"
                        value={inputText}
                        onChange={e => setInputText(e.target.value)}
                        className="w-full p-3 text-xl bg-transparent focus:outline-none transition-colors"
                        placeholder="what will you create?"
                        disabled={isLoading}
                    />
                    {isLoading ? (
                        <div className="flex justify-center">
                            <p className="text-2xl font-bold">
                                <span className="text-red-400">[</span>
                                <span className="text-black">generating</span>
                                <span className="text-red-400">]</span>
                            </p>
                        </div>
                    ) : (
                        <button
                            type="submit"
                            className="text-2xl font-bold group"
                        >
                            <span className="text-red-400 group-hover:text-black transition-colors">[</span>
                            <span className="text-black group-hover:text-red-400 transition-colors">generate</span>
                            <span className="text-red-400 group-hover:text-black transition-colors">]</span>
                        </button>
                    )}
                </div>
            </form>
  

          </div>
        </div>
    )
}