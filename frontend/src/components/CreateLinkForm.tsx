import { useForm } from "react-hook-form";
import { useState } from "react";

type FormData = {
   originalLink: string;
   shortenedLink: string;
};

// "google.com" → "https://google.com"
function toFullUrl(input: string): string {
   const trimmed = input.trim();
   if (/^https?:\/\//i.test(trimmed)) return trimmed;
   return `https://${trimmed}`;
}

export function CreateLinkForm({ onSuccess }: { onSuccess: () => void }) {
   const [error, setError] = useState<string | null>(null);
   const {
      register,
      handleSubmit,
      reset,
      formState: { isSubmitting },
   } = useForm<FormData>();

   async function onSubmit(data: FormData) {
      setError(null);

      const payload = {
         originalLink: toFullUrl(data.originalLink),
         shortenedLink: data.shortenedLink
      };

      const res = await fetch("http://localhost:3333/shortlinks", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify(payload),
      });

      if (res.ok) {
         reset();
         onSuccess();
      } else {
         const body = await res.json();
         setError(body.message);
      }
   }

   return (
      <form onSubmit={handleSubmit(onSubmit)}>
         <input
            className="border"
            {...register("originalLink")}
            placeholder="google.com"
         />
         <input
            className="border"
            {...register("shortenedLink", {
               validate: v => /^[a-z0-9-]+$/i.test(v.trim()) || "Slug: letters, numbers, hyphens only"
            })}
            placeholder="my-cool-link"
         />
         {error && <p>{error}</p>}
         <button className="border b-1 b-red-500" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Submit"}
         </button>
      </form>
   );
}
