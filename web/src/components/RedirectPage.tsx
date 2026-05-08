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
         <div className="min-h-screen bg-[#ECEEF2] flex items-center justify-center">
            <div className="bg-white rounded-2xl px-16 py-14 w-[480px] flex flex-col items-center shadow-sm">
               <img src="./Logo_Icon.svg" alt="Logo" className="w-12 h-12 mb-6" />

               <h1 className="text-xl font-semibold text-gray-900 mb-3">
                  Redirecionando...
               </h1>

               <p className="text-sm text-gray-500 text-center leading-relaxed">
                  O link será aberto automaticamente em alguns instantes.
                  <br />
                  Não foi redirecionado?{" "}
                  <a href="#" className="text-blue-600 font-medium hover:underline">
                     Acesse aqui
                  </a>
               </p>
            </div>
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
