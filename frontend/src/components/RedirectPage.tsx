import { useEffect } from "react";
import { useParams } from "react-router-dom";
import logoIcon from "../../assets/Logo_Icon.svg";

export function RedirectPage() {
   const { slug } = useParams<{ slug: string }>();

   useEffect(() => {
      window.location.href = `http://localhost:3333/${slug}`;
   }, [slug]);

   return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-3 bg-gray-100">
         <div className="flex items-center gap-2 mb-4">
            <img src={logoIcon} alt="brev.ly" className="h-8" />
         </div>
         <p className="text-md text-gray-500">Redirecionando...</p>
         <a
            href={`http://localhost:3333/${slug}`}
            className="text-sm text-blue-base underline hover:text-blue-dark"
         >
            Não redirecionou? Clique aqui.
         </a>
      </div>
   );
}

