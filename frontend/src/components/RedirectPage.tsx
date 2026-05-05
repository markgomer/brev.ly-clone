import { useEffect } from "react";
import { useParams } from "react-router-dom";

export function RedirectPage() {
   const { slug } = useParams<{ slug: string }>();

   useEffect(() => {
      window.location.href = `http://localhost:3333/${slug}`;
   }, [slug]);

   return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
         <p className="text-gray-500">Redirecting...</p>
            <a href={`http://localhost:3333/${slug}`} className="text-blue-600 underline">
               Not redirected? Click here.
            </a>
      </div>
   );
}
