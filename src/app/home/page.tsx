"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../../firebase";

import Post from "../components/Post";
import PostButton from "../components/PostButton";
import Auth from "../components/Auth";

import { Post as PostType, User as UserType } from "../../../types/types";

export const UserContext = createContext<{ user: UserType | null }>({ user: null });

export default function Home() {


  const [user, loading] = useAuthState(auth);
  const [images, setImages] = useState<PostType[]>([]);

  return (
    <UserContext.Provider value={{ user: user as UserType }}>
      <div className="min-h-screen flex flex-col justify-between items-center p-8">
        <div className="flex justify-between items-center w-full">
          <h1 className="text-4xl font-sans">Pentagram</h1>
          <Auth />
        </div>

        <h1 className="text-2xl font-sans">Welcome, {!loading && user?.displayName}</h1>
        

        <main className="flex-1 flex flex-col items-center justify-center gap-8">
          {images.map((image, index) => (
            <Post image={image} key={index} />
          ))}
        </main>

        <footer className="fixed bottom-8 left-8">
          <PostButton images={images} setImages={setImages} />
        </footer>
      </div>
    </UserContext.Provider>
  );
}