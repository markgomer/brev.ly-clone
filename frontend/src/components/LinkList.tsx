import { useEffect, useState } from "react";
import { LinkCard } from "./LinkCard";
import { DownloadSimpleIcon } from "@phosphor-icons/react";

type Link = {
   id: number,
   originalURL: string;
   shortenedURL: string;
   numberOfAccesses: number
};

type Props = {
   onDownload: () => void;
};

export function LinkList({ onDownload }: Props) {
   const [links, setLinks] = useState<Link[]>([]);

   function handleDelete(shortenedURL: string) {
      setLinks(prev => prev.filter(l => l.shortenedURL !== shortenedURL));
   }

   function fetchLinks() {
      fetch("http://localhost:3333/shortlinks")
         .then(r => r.json())
         .then((data: Link[]) => setLinks([...data].sort((a, b) => b.id - a.id)));
   }

   function handleVisibility() {
      if (document.visibilityState === "visible") fetchLinks();
   }

   useEffect(() => {
      fetchLinks();
      document.addEventListener("visibilitychange", handleVisibility);
      return () => document.removeEventListener("visibilitychange", handleVisibility);
   }, []);

   return (
      <section className="w-full bg-white rounded-xl p-6 flex flex-col gap-4 shadow-sm max-h-[calc(100vh-8rem)] overflow-hidden">
         <div className="flex items-center justify-between">
            <h2 className="text-lg text-gray-600">Meus links</h2>
            <button
               onClick={onDownload}
               className="inline-flex items-center gap-2 rounded border border-gray-300 px-3 py-1.5 text-md text-gray-600 hover:border-blue-base hover:text-blue-base transition-colors duration-150 cursor-pointer"
            >
               <DownloadSimpleIcon size={14} />
               Baixar CSV
            </button>
         </div>

         {
            links.length === 0 ? (
               <p className="text-sm text-gray-400 text-center py-8">
                  Nenhum link cadastrado ainda.
               </p>
            ) : (
               <ul className="flex flex-col divide-y divide-gray-100 overflow-y-auto min-h-0 flex-1 px-2">
                  {links.map(l => (
                     <li key={l.shortenedURL}>
                        <LinkCard link={l} onDelete={handleDelete} />
                     </li>
                  ))}
               </ul>
            )
         }

      </section >
   );
}
