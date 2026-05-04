import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export function RedirectPage() {
   const { slug } = useParams<{ slug: string }>();
   const [destination, setDestination] = useState<string | null>(null);
   const [error, setError] = useState(false);

   useEffect(() => {
      fetch(`http://localhost:3333/shortlinks/${slug}`)
         .then(r => r.ok ? r.json() : Promise.reject())
         .then(data => {
            setDestination(data.originalURL);
            window.location.href = data.originalURL;
         })
         .catch(() => setError(true));
   }, [slug]);

   if (error) return <p>Link not found.</p>;

   return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
         <p className="text-gray-500">Redirecting...</p>
         {destination && (
            <p className="text-sm text-gray-400">
               Not redirected?{" "}
               <a href={destination} className="text-blue-600 underline">Click here.</a>
            </p>
         )}
      </div>
   );
}
