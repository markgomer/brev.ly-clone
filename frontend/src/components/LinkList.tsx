import { useEffect, useState } from "react";
import { LinkCard } from "./LinkCard";

type Link = { originalURL: string; shortenedURL: string; numberOfAccesses: number };

export function LinkList() {
   const [links, setLinks] = useState<Link[]>([]);

   useEffect(() => {
      fetch("http://localhost:3333/shortlinks")
         .then(r => r.json())
         .then(setLinks);
   }, []);

   function handleDelete(shortenedURL: string) {
      setLinks(prev => prev.filter(l => l.shortenedURL !== shortenedURL));
   }

   if (links.length === 0) return <p className="text-gray-400 text-sm">No links yet.</p>;

   return (
      < ul className="flex flex-col gap-3" >
         {
            links.map(l => (
               <li key={l.shortenedURL}>
                  <LinkCard link={l} onDelete={handleDelete} />
               </li>
            ))
         }
      </ul >
   );
}
