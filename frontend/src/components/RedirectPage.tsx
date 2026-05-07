import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

type State = "loading" | "not-found";

export function RedirectPage() {
   const { slug } = useParams<{ slug: string }>();
   const [state, setState] = useState<State>("loading");

   useEffect(() => {
      if (!slug) {
         setState("not-found");
         return;
      }

      const controller = new AbortController();

      fetch(`http://localhost:3333/${slug}`, { signal: controller.signal })
         .then(res => {
            if (res.ok) {
               return res.json().then(data => {
                  window.location.replace(data.originalURL);
               });
            } else {
               setState("not-found");
            }
         })
         .catch(err => {
            if (err.name !== "AbortError") {
               setState("not-found");
            }
         });

      return () => controller.abort();
   }, [slug]);

   if (state === "loading") {
      return (
         <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="relative select-none">
               <img src="Logo_Icon.svg" alt="brev.ly logo" />
            </div>
            <p className="text-md text-gray-400">Redirecionando...</p>
         </div>
      );
   }

   return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
         <div className="bg-white rounded-xl shadow-sm p-12 flex flex-col items-center gap-4 max-w-lg w-full text-center">
            <div className="relative select-none">
               <img src="404.svg" alt="not-found" />
            </div>
            <h1 className="text-lg text-gray-600 mt-2">Link não encontrado</h1>
            <p className="text-md text-gray-400 leading-relaxed">
               O link que você está tentando acessar não existe, foi removido ou é
               uma URL inválida. Saiba mais em{" "}
               <a href="/" className="text-blue-base hover:underline">
                  brev.ly
               </a>
               .
            </p>
         </div>
      </div>
   );
}
