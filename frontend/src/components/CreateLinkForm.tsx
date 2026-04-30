import { useForm } from "react-hook-form";
import { useState } from "react";

type FormData = {
   originalLink: string;
   shortenedLink: string;
};

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
      const res = await fetch("http://localhost:3333/shortlinks", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify(data),
      });

      if (res.ok) {
         reset();
         onSuccess(); // triggers LinkList refresh
      } else {
         const body = await res.json();
         setError(body.message);
      }
   }

   return (
      <form onSubmit={handleSubmit(onSubmit)}>
         <input {...register("originalLink")} placeholder="https://original.com" />
         <input {...register("shortenedLink")} placeholder="https://short.ly/abc" />
         {error && <p>{error}</p>}
         <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Submit"}
         </button>
      </form>
   );
}
