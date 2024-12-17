"use client";

import { useState } from "react";
import Post from "./components/Post";
import PostButton from "./components/PostButton";

export default function Home() {
  
  const [images, setImages] = useState<{image: string, caption: string}[]>([]);
  const [createOpen, setCreateOpen] = useState(false);

  return (
    
    <div className="min-h-screen flex flex-col justify-between items-center p-8">
      <div className="flex justify-between items-center w-full">
        <h1 className="text-4xl font-sans">Pentagram</h1>
        <p className="text-md">Log in</p>
      </div>
      

      <main className="flex-1 flex flex-col items-center justify-center gap-8">
        {images.map((image, index) => (
          <Post image={image} key={index} />
        ))}
      </main>

      <footer className="fixed bottom-8 left-8">
        <PostButton images={images} setImages={setImages} />
      </footer>
    </div>
  );
}
