export default function Post({image}: {image: {image: string, caption: string}}) {
    return (
        <div className="gap-2 flex flex-col w-4/5">
            <div className="flex flex-row items-center gap-2">
              <img src="https://i.redd.it/instagram-default-user-profile-pic-flip-flops-v0-clnilflfeg4d1.jpg?width=230&format=pjpg&auto=webp&s=e5c920f218f52a77c28abc5175c8db29dfa0d219" className="w-10 h-10 rounded-full" />
              <p className="text-lg">username</p>
            </div>
            <img
              src={image.image}
              className="w-full"
            />
            <div className="flex flex-row gap-2 items-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6 cursor-pointer hover:text-red-500">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              <p className="text-md">123 likes</p>
            </div>
            <p className="text-md"><b>username</b> {image.caption}</p>
        </div>
    )
}