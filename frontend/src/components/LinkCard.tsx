
type Link = { originalURL: string; shortenedURL: string; numberOfAccesses: number };

type Props = {
   link: Link;
   onDelete: (shortenedURL: string) => void;
};

export function LinkCard({ link, onDelete }: Props) {

   async function handleDelete() {
      const response = await fetch(`http://localhost:3333/shortlinks/${encodeURIComponent(link.shortenedURL)}`,
         { method: "DELETE" }
      )
      if(response.ok) onDelete(link.shortenedURL)
   }

   return (
      <div>
         <span className="font-bold text-blue-600 truncate">{link.shortenedURL}</span>
         <span className="text-sm text-gray-400 truncate">{link.originalURL}</span>
         <span className="text-sm text-gray-500">{link.numberOfAccesses} accesses</span>
         <button onClick={handleDelete} title="Delete link" className="text-gray-400 hover:text-red-500 transition-colors">
            x
         </button>
      </div>
   )
}
