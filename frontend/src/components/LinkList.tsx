import { useEffect, useState } from "react";
import { LinkCard } from "./LinkCard";

type Link = { originalURL: string; shortenedURL: string; numberOfAccesses: number };

export function LinkList() {
   const [links, setLinks] = useState<Link[]>([]);

   function handleDelete(shortenedURL: string) {
      setLinks(prev => prev.filter(l => l.shortenedURL !== shortenedURL));
   }

   function fetchLinks() {
      fetch("http://localhost:3333/shortlinks")
         .then(r => r.json())
         .then(setLinks);
   }

   function handleVisibility() {
      if (document.visibilityState === "visible") fetchLinks();
   }

   useEffect(() => {
      fetchLinks();
      document.addEventListener("visibilitychange", handleVisibility);
      return () => document.removeEventListener("visibilitychange", handleVisibility);
   }, []);

   if (links.length === 0) return <p className="text-gray-400 text-sm">No links yet.</p>;

   return (
      <ul className="flex flex-col gap-3" >
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
