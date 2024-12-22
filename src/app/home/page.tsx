"use client";

import { useState, useEffect } from 'react';
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../../firebase";
import { firestore } from "../../../firebase";
import { collection, onSnapshot, query, serverTimestamp, setDoc, doc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import Auth from "../components/Auth";

import { Board as BoardType } from "../../../types/types";


export default function Home() {


  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const [boards, setBoards] = useState<BoardType[]>([]);
  const [boardImages, setBoardImages] = useState<{ [key: string]: { image: string | null } }>({});

  useEffect(() => {
    console.log('boardImages', boardImages);
  }, [boardImages]);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(firestore, "users", user!.uid, "boards"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setBoards(querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id
      } as BoardType)));
    });
    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (!boards.length) return;
    
    boards.forEach(async (board) => {
      const boardRef = doc(firestore, "boards", board.id);
      const unsubscribe = onSnapshot(boardRef, (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          const firstImage = data.images[0] 
          
          setBoardImages(prev => ({
            ...prev,
            [board.id]: firstImage
          }));
        }
      });
      return () => unsubscribe();
    });
  }, [boards]);

  const createBoard = async () => {
    const newBoardId = doc(collection(firestore, "users", user!.uid, "boards")).id;
    await setDoc(doc(firestore, "users", user!.uid, "boards", newBoardId), {
      name: "new board",
      createdAt: serverTimestamp(),
    });
    const newBoardRef = doc(firestore, "boards", newBoardId);
    await setDoc(newBoardRef, {
      images: Array(15).fill(null),
      user: {
        uid: user!.uid,
        displayName: user!.displayName,
        email: user!.email,
        photoURL: user!.photoURL
      },
      createdAt: serverTimestamp(),
    });
    return newBoardId;
  };

  if (!loading && !user) router.push("/");

  return (
      <div className="min-h-screen bg-white">
        {/* Navigation Bar */}
        <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-b border-gray-100 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <a href="/home" className="text-4xl font-bold font-sans group">
                <span className="text-red-400 group-hover:text-black transition-colors">[</span>
                <span className="text-black group-hover:text-red-400 transition-colors">v</span>
                <span className="text-red-400 group-hover:text-black transition-colors">z</span>
                <span className="text-black group-hover:text-red-400 transition-colors">n</span>
                <span className="text-red-400 group-hover:text-black transition-colors">]</span>
              </a>
              <div className="flex items-center gap-6">
                <a href="/explore" className="text-2xl font-bold group hover:opacity-80 transition-opacity">
                  <span className="text-red-400 group-hover:text-black transition-colors">[</span>
                  <span className="text-black group-hover:text-red-400 transition-colors">explore</span>
                  <span className="text-red-400 group-hover:text-black transition-colors">]</span>
                </a>
                <Auth />
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
          <div className="text-center">
            <h1 className="text-5xl font-bold font-sans mt-12 mb-16">
              <span className="text-red-400">[</span>
              <span className="text-black">welcome, {!loading && user?.displayName?.toLowerCase()}</span>
              <span className="text-red-400">]</span>
            </h1>
          </div>

          <div className="mt-12">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">
                <span className="text-red-400">[</span>
                <span className="text-black">your boards</span>
                <span className="text-red-400">]</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Create New Board Button */}
              <button 
                onClick={async () => {
                  const newBoardId = await createBoard();
                  router.push(`/board/${newBoardId}`);
                }}
                className="aspect-square bg-gray-50 rounded-xl hover:bg-gray-100 hover:shadow-lg hover:border-2 hover:border-red-400 transition-all duration-300 flex flex-col items-center justify-center group"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
                  className="w-12 h-12 text-red-400 group-hover:scale-110 transition-transform duration-300">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </button>

              {/* Board Grid */}
              {boards.map((board) => (
                <div key={board.id} className="group">
                  <a href={`/board/${board.id}`}
                    className="block aspect-square bg-gray-50 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300"
                  >
                    {boardImages[board.id]?.image && typeof boardImages[board.id]?.image === 'string' ? (
                      <img 
                        src={boardImages[board.id]?.image || undefined} 
                        alt={board.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200" />
                    )}
                  </a>
                  <h3 className="mt-2 text-lg font-semibold text-center">
                    <span className="text-red-400 group-hover:text-black transition-colors">[</span>
                    <span className="text-black group-hover:text-red-400 transition-colors">{board.name}</span>
                    <span className="text-red-400 group-hover:text-black transition-colors">]</span>
                  </h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
  );
}