import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

type State = "loading" | "not-found";

export function RedirectPage() {
   const { slug } = useParams<{ slug: string }>();
   const [state, setState] = useState<State>("loading");

   useEffect(() => {
      fetch(`http://localhost:3333/${slug}`)
         .then(res => {
            if (res.redirected) {
               window.location.href = res.url;
            } else if (res.ok) {
               return res.json().then(data => {
                  window.location.href = data.url;
               });
            } else {
               setState("not-found");
            }
         })
         .catch(() => setState("not-found"));
   }, [slug]);

   if (state === "loading") {
      return (
         <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="relative select-none">
               <img src="../../assets/Logo_Icon.svg" alt="brev.ly logo" />
            </div>
            <p className="text-md text-gray-400">Redirecionando...</p>
         </div>
      );
   }

   return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
         <div className="bg-white rounded-xl shadow-sm p-12 flex flex-col items-center gap-4 max-w-lg w-full text-center">

            {/* Glitch 404 */}
            <div className="relative select-none">
               <img src="../../assets/404.svg" alt="not-found" />
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
