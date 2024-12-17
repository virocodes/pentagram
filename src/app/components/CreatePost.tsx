"use client";

import { useState } from "react";

export default function CreatePost({images, setImages, close}: {images: {image: string, caption: string}[], setImages: (images: {image: string, caption: string}[]) => void, close: () => void}) {
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
          console.log(data);
          setInputText("");
          setImages([data, ...images]);
        } catch (error) {
          console.error("Error:", error);
        } finally {
          setIsLoading(false);
          close();
        }
      };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-background p-6 rounded-lg shadow-xl w-[500px]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Create New Post</h2>
              <button 
                className="text-gray-500 hover:text-gray-700"
                onClick={close}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                  className="w-full p-3 bg-transparent border-b-4 border-black/[.08] dark:border-white/[.145] focus:border-b-white focus:outline-none"
                  placeholder="Describe the image you want to generate..."
                  disabled={isLoading}
                />
                {isLoading ? (
                  <div className="flex justify-center">
                    <p className="text-gray-500">Generating...</p>
                  </div>
                ) : (
                  <button
                    type="submit"
                    className="bg-foreground text-background px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors"
                  >
                    Generate
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
    )
}