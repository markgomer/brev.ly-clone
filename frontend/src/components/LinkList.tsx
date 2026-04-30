import { useEffect, useState } from "react";

type Link = { originalURL: string; shortenedURL: string };

export function LinkList() {
   const [links, setLinks] = useState<Link[]>([]);

   useEffect(() => {
      fetch("http://localhost:3333/shortlinks")
         .then(r => r.json())
         .then(setLinks);
   }, []);

   return (
      <ul>
         {links.map(l => (
            <li key={l.shortenedURL}>{l.originalURL} → {l.shortenedURL}</li>
         ))}
      </ul>
   );
}
