'use client'

import { useParams } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import CreatePost from '../../components/CreatePost'
import Auth from '../../components/Auth'
import { setDoc, doc, getDoc } from 'firebase/firestore'
import { firestore } from '../../../../firebase'
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../../../firebase";
import { User } from '../../../../types/types';


export default function Board() {
    const { id } = useParams();
    const [user] = useAuthState(auth);
    const [images, setImages] = useState<({image: string, caption: string, success: boolean} | null)[]>(Array(15).fill(null));
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [viewingIndex, setViewingIndex] = useState<number | null>(null);
    const [boardName, setBoardName] = useState<string | null>(null);
    const [changingName, setChangingName] = useState<boolean>(false);
    const captureRef = useRef<HTMLDivElement>(null);
    const [showToast, setShowToast] = useState(false);
    const [imagesLoading, setImagesLoading] = useState(true);
    const [nameLoading, setNameLoading] = useState(true);
    const [isOwner, setIsOwner] = useState<boolean>(false);
    const [boardUser, setBoardUser] = useState<User | null>(null);
    // Define the heights for each slot
    const heights = [
        400, 500, 300, // Column 1
        250, 600, 350, // Column 2
        400, 400, 400, // Column 3
        300, 400, 500, // Column 4
        450, 350, 400  // Column 5
    ];

    useEffect(() => {
        console.log('images', images);
    }, [images]);

    useEffect(() => {
        const fetchBoardName = async () => {
            const boardSnap = await getDoc(doc(firestore, "boards", id as string));
            const boardUser = boardSnap.data()?.user;
            setBoardUser(boardUser);
            const docSnap = await getDoc(doc(firestore, "users", boardUser?.uid || '_', "boards", id as string));
            if (docSnap.exists()) {
                setBoardName(docSnap.data().name);
                setIsOwner(true);
            } else {
                // Check other users' boards
                const boardSnap = await getDoc(doc(firestore, "boards", id as string));
                if (boardSnap.exists()) {
                    setBoardName(boardSnap.data().name);
                }
            }
            setNameLoading(false);
        };
        fetchBoardName();
    }, [user, id]);

    useEffect(() => {
        const saveImages = async () => {
            if (!user) return;
            try {
                const docSnap = await getDoc(doc(firestore, "boards", id as string));
                const newDoc = {
                    ...docSnap.data(),
                    images: images.map(img => img === undefined ? null : img)
                };
                console.log('newDoc', newDoc);
                await setDoc(doc(firestore, "boards", id as string), newDoc);
            } catch (error) {
                console.error("Error saving images:", error);
            }
        };

        saveImages();
    }, [images]);

    useEffect(() => {
        const fetchImages = async () => {
            const docSnap = await getDoc(doc(firestore, "boards", id as string));
            if (docSnap.exists()) {
                setImages(docSnap.data().images);
                setImagesLoading(false);
            }
        };
        try {
            fetchImages();
        } catch (error) {
            console.error("Error fetching images:", error);
        }
    }, []);



    const handleNextImage = () => {
        if (viewingIndex === null) return;
        let nextIndex = (viewingIndex + 1) % images.length;
        
        // Keep looking for the next non-empty image
        while (!images[nextIndex] && nextIndex !== viewingIndex) {
            nextIndex = (nextIndex + 1) % images.length;
        }
        
        if (images[nextIndex]) setViewingIndex(nextIndex);
    };

    const handlePrevImage = () => {
        if (viewingIndex === null) return;
        let prevIndex = (viewingIndex - 1 + images.length) % images.length;
        
        // Keep looking for the previous non-empty image
        while (!images[prevIndex] && prevIndex !== viewingIndex) {
            prevIndex = (prevIndex - 1 + images.length) % images.length;
        }
        
        if (images[prevIndex]) setViewingIndex(prevIndex);
    };

    const handleDeleteImage = async (index: number) => {
        const newImages = [...images];
        newImages[index] = null;
        setImages(newImages);
        
        // Update Firestore
        try {
            const docSnap = await getDoc(doc(firestore, "boards", id as string));
            const newDoc = {
                ...docSnap.data(),
                images: images.map(img => img === undefined ? null : img)
            };
            await setDoc(doc(firestore, "boards", id as string), newDoc);
        } catch (error) {
            console.error("Error deleting image:", error);
        }
    };

    if (imagesLoading || nameLoading) return <div>Loading...</div>;

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
            <div className=" mx-auto px-4 sm:px-6 lg:px-8 pt-24">
                <div className="flex flex-col items-center justify-center w-full">
                    {changingName && isOwner ? (
                        <div className="flex items-center justify-center mb-12">
                            <span className="text-7xl font-bold text-black">[</span>
                            <input 
                                autoFocus
                                type="text" 
                                className="text-7xl font-bold text-center text-red-400 rounded-sm hover:cursor-pointer inline-block w-auto bg-transparent focus:outline-none mx-2" 
                                value={boardName!} 
                                onChange={(e) => {
                                    setBoardName(e.target.value);                           
                                }} 
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        setChangingName(false);
                                        setDoc(doc(firestore, "users", user!.uid, "boards", id as string), {
                                            name: boardName!
                                        });
                                    }
                                }}
                            />
                            <span className="text-7xl font-bold text-black">]</span>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center mb-12">
                            <h1 onClick={() => isOwner && setChangingName(true)} className={`text-7xl font-bold mb-6 ${isOwner ? 'hover:cursor-pointer' : ''} group`}>
                                <span className="text-red-400 group-hover:text-black transition-colors">[</span>
                                <span className="text-black group-hover:text-red-400 transition-colors">{boardName}</span>
                                <span className="text-red-400 group-hover:text-black transition-colors">]</span>
                            </h1>
                            <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-full shadow-sm">
                                <img 
                                    src={boardUser?.photoURL || ''} 
                                    alt={boardUser?.displayName || ''} 
                                    className="w-8 h-8 rounded-full"
                                />
                                <a href={`/user/${boardUser?.uid}`} className="text-xl font-bold group">
                                    <span className="text-red-400 group-hover:text-black transition-colors">[</span>
                                    <span className="text-black group-hover:text-red-400 transition-colors">{boardUser?.displayName?.toLowerCase()}</span>
                                    <span className="text-red-400 group-hover:text-black transition-colors">]</span>
                                </a>
                            </div>
                        </div>
                    )}

                    <div className="flex items-center gap-4 mb-12">
                        <button 
                            onClick={() => {
                                navigator.clipboard.writeText(window.location.href);
                                setShowToast(true);
                                setTimeout(() => setShowToast(false), 2000);
                            }} 
                            className="flex items-center gap-2 px-6 py-3 bg-red-400 text-white rounded-full hover:bg-red-500 transition-all shadow-sm hover:shadow-md"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                            </svg>
                            <span>Share</span>
                        </button>
                    </div>
                </div>

                <div className="columns-5 gap-4 [column-fill:_balance] mx-auto" ref={captureRef}>
                    {images.map((image, index) => (
                        <div key={index} className="mb-4 bg-gray-200 dark:bg-gray-800 rounded-lg overflow-hidden hover:opacity-90 transition-opacity cursor-pointer relative group">
                            {image ? (
                                <>
                                    <img 
                                        src={image.image} 
                                        alt="Board image" 
                                        style={{ height: `${heights[index]}px` }}
                                        className="w-full object-cover"
                                        onClick={() => setViewingIndex(index)}
                                    />
                                    {isOwner && (
                                        <button 
                                            className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteImage(index);
                                            }}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    )}
                                </>
                            ) : isOwner ? (
                                <button 
                                    style={{ height: `${heights[index]}px` }}
                                    className="w-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 hover:border-2 hover:border-red-400 transition-colors"
                                    onClick={() => setSelectedIndex(index)}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-red-400">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                </button>
                            ) : (
                                <div 
                                    style={{ height: `${heights[index]}px` }}
                                    className="w-full bg-gray-100"
                                />
                            )}
                        </div>
                    ))}
                </div>

                {/* Image Viewer Modal */}
                {viewingIndex !== null && images[viewingIndex] && (
                    <div 
                        className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
                        style={{ position: 'fixed', overflowY: 'hidden' }}
                        onClick={(e) => {
                            if (e.target === e.currentTarget) setViewingIndex(null);
                        }}
                    >
                        <button
                            className="absolute left-8 top-1/2 transform -translate-y-1/2 text-white p-2 hover:bg-white/10 rounded-full"
                            onClick={handlePrevImage}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                            </svg>
                        </button>
                        
                        <img
                            src={images[viewingIndex].image}
                            alt="Enlarged view"
                            className="h-[90vh] w-[90vw] object-contain"
                        />
                        
                        <button
                            className="absolute right-8 top-1/2 transform -translate-y-1/2 text-white p-2 hover:bg-white/10 rounded-full"
                            onClick={handleNextImage}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                            </svg>
                        </button>

                        <button
                            className="absolute top-8 right-8 text-white p-2 hover:bg-white/10 rounded-full"
                            onClick={() => setViewingIndex(null)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                )}

                {selectedIndex !== null && (
                    <CreatePost 
                        images={images} 
                        setImages={setImages}
                        close={() => setSelectedIndex(null)}
                        selectedIndex={selectedIndex}
                    />
                )}

                {showToast && (
                    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-black text-white px-4 py-2 rounded-lg shadow-lg animate-fade-out">
                        Link copied to clipboard!
                    </div>
                )}
            </div>
        </div>
    )
}