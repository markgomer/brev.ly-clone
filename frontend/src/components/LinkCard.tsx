type Link = { originalURL: string; shortenedURL: string; numberOfAccesses: number };

type Props = {
   link: Link;
   onDelete: (shortenedURL: string) => void;
};

export function LinkCard({ link, onDelete }: Props) {
   const fullShortenedURL = `http://localhost:5173/${link.shortenedURL}`;

   async function handleDelete() {
      const response = await fetch(`http://localhost:3333/shortlinks/${encodeURIComponent(link.shortenedURL)}`,
         { method: "DELETE" }
      )
      if(response.ok) onDelete(link.shortenedURL)
   }

   return (
      <div>
         <a
            href={`http://localhost:5173/${link.shortenedURL}`}
            target="_blank"
            rel="noreferrer"
            className="font-bold text-blue-800 truncate hover:underline"
         >
            {fullShortenedURL}
         </a>
         <span className="text-sm text-gray-400 truncate">{link.originalURL}</span>
         <span className="text-sm text-gray-500">{link.numberOfAccesses} accesses</span>
         <button onClick={handleDelete} title="Delete link" className="text-gray-400 hover:text-red-500 transition-colors">
            x
         </button>
      </div>
   )
}
