import { CopyIcon, TrashIcon } from "@phosphor-icons/react";

type Link = {
   originalURL: string;
   shortenedURL: string;
   numberOfAccesses: number
};

type Props = {
   link: Link;
   onDelete: (shortenedURL: string) => void;
};

export function LinkCard({ link, onDelete }: Props) {
   const fullShortenedURL = `localhost:5173/${link.shortenedURL}`;

   async function handleDelete() {
      const response = await fetch(`http://localhost:3333/shortlinks/${encodeURIComponent(link.shortenedURL)}`,
         { method: "DELETE" }
      )
      if (response.ok) onDelete(link.shortenedURL)
   }
   function handleCopy() {
      navigator.clipboard.writeText(fullShortenedURL);
   }

   return (
      <div className="flex items-center justify-between gap-4 py-3">
         {/* links */}
         <div className="flex flex-col min-w-0">
            <a
               href={`http://localhost:5173/${link.shortenedURL}`}
               target="_blank"
               rel="noreferrer"
               className="text-md font-semibold text-blue-base truncate hover:underline"
            >
               {fullShortenedURL}
            </a>
            <span className="text-sm text-gray-400 truncate">
               {link.originalURL}
            </span>
         </div>

         {/* access count and icons */}
         <div className="flex items-center gap-2 shrink-0">
            <span className="text-sm text-gray-400 whitespace-nowrap">
               {link.numberOfAccesses} {link.numberOfAccesses === 1 ? "acesso" : "acessos"}
            </span>

            {/* buttons */}
            <button
               onClick={handleCopy}
               title="Copiar link"
               className="inline-flex items-center justify-center size-6 rounded border border-gray-300 text-gray-500 hover:border-blue-base hover:text-blue-base transition-colors duration-150 cursor-pointer"
            >
               <CopyIcon size={14} />
            </button>

            <button
               onClick={handleDelete}
               title="Excluir link"
               className="inline-flex items-center justify-center size-6 rounded border border-gray-300 text-gray-500 hover:border-danger hover:text-danger transition-colors duration-150 cursor-pointer"
            >
               <TrashIcon size={14} />
            </button>
         </div>
      </div>
   )
}
