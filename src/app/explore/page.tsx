'use client'

import { useState, useEffect } from 'react';
import { firestore } from "../../../firebase";
import { collection, onSnapshot, query, doc } from 'firebase/firestore';
import Auth from "../components/Auth";
import { Board as BoardType } from "../../../types/types";

export default function Explore() {
  const [boards, setBoards] = useState<BoardType[]>([]);
  const [loading, setLoading] = useState(true);
  const [boardImages, setBoardImages] = useState<{ [key: string]: { image: string | null } }>({});

  useEffect(() => {
    const q = query(collection(firestore, "boards"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const boardData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        name: '',
        createdAt: doc.data().createdAt,
        user: doc.data().user
      }));

      // Get board names from user collections
      boardData.forEach(async (board) => {
        const userBoardRef = collection(firestore, "users", board.user.uid, "boards");
        const unsubUserBoard = onSnapshot(userBoardRef, (snapshot) => {
          snapshot.docs.forEach((doc) => {
            if (doc.id === board.id) {
              board.name = doc.data().name;
              setBoards(prev => [...prev.filter(b => b.id !== board.id), board]);
            }
          });
        });
        return () => unsubUserBoard();
      });

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!boards.length) return;
    
    boards.forEach(async (board) => {
      const boardRef = doc(firestore, "boards", board.id);
      const unsubscribe = onSnapshot(boardRef, (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          const firstImage = data.images[0];
          
          setBoardImages(prev => ({
            ...prev,
            [board.id]: firstImage
          }));
        }
      });
      return () => unsubscribe();
    });
  }, [boards]);

  if (loading) return <div>Loading...</div>;

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
            <span className="text-black">explore</span>
            <span className="text-red-400">]</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
              <div className="mt-3">
                <h3 className="text-lg font-semibold text-center">
                  <span className="text-red-400 group-hover:text-black transition-colors">[</span>
                  <span className="text-black group-hover:text-red-400 transition-colors">{board.name}</span>
                  <span className="text-red-400 group-hover:text-black transition-colors">]</span>
                </h3>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <img 
                    src={board.user.photoURL} 
                    alt={board.user.displayName} 
                    className="w-6 h-6 rounded-full"
                  />
                  <a href={`/user/${board.user.uid}`} className="text-sm font-bold group">
                    <span className="text-red-400 group-hover:text-black transition-colors">[</span>
                    <span className="text-black group-hover:text-red-400 transition-colors">{board.user.displayName.toLowerCase()}</span>
                    <span className="text-red-400 group-hover:text-black transition-colors">]</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
