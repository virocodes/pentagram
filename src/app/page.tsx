'use client'

export default function Landing() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
            <div className="max-w-4xl w-full px-4 space-y-8">
                <div className="text-center space-y-4">
                    <h1 className="text-6xl font-bold">Pentagram</h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400">
                        Create and share AI-generated images with the world
                    </p>
                </div>
                
                <div className="flex justify-center gap-4 mt-8">
                    <a 
                        href="/home"
                        className="px-8 py-3 bg-foreground text-background rounded-lg hover:bg-opacity-90 transition-colors text-lg font-medium"
                    >
                        Get Started
                    </a>
                </div>

                <div className="mt-16 grid grid-cols-3 gap-8">
                    <div className="text-center">
                        <h3 className="text-xl font-semibold mb-2">Create</h3>
                        <p className="text-gray-600 dark:text-gray-400">Generate unique images using AI</p>
                    </div>
                    <div className="text-center">
                        <h3 className="text-xl font-semibold mb-2">Share</h3>
                        <p className="text-gray-600 dark:text-gray-400">Post your creations to your feed</p>
                    </div>
                    <div className="text-center">
                        <h3 className="text-xl font-semibold mb-2">Connect</h3>
                        <p className="text-gray-600 dark:text-gray-400">Engage with other creators</p>
                    </div>
                </div>
            </div>
        </div>
    )
}