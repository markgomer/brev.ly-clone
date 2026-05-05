import { useForm } from "react-hook-form";

type FormData = {
   originalLink: string;
   shortenedLink: string;
};

function toFullUrl(input: string): string {
   const trimmed = input.trim();
   if (/^https?:\/\//i.test(trimmed)) return trimmed;
   return `https://${trimmed}`;
}

export function CreateLinkForm({ onSuccess }: { onSuccess: () => void }) {
   const {
      register,
      handleSubmit,
      reset,
      setError,
      formState: { errors, isSubmitting },
   } = useForm<FormData>();

   async function onSubmit(data: FormData) {
      const payload = {
         originalLink: toFullUrl(data.originalLink),
         shortenedLink: data.shortenedLink,
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
         setError("shortenedLink", { message: body.message });
      }
   }

   return (
      <section className="w-full md:w-96 shrink-0 bg-white rounded-xl p-6 flex flex-col gap-5 shadow-sm">
         <h1 className="text-lg text-gray-600">Novo link</h1>

         <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">

            {/* Original link */}
            <div className="flex flex-col gap-1">
               <label className="text-xs uppercase font-semibold tracking-wide text-blue-base">
                  Link original
               </label>
               <input
                  {...register("originalLink", { required: "Informe o link original." })}
                  placeholder="google.com"
                  className={[
                     "w-full rounded border px-3 py-2 text-md text-gray-600",
                     "placeholder:text-gray-300 outline-none transition-colors duration-150 bg-white",
                     errors.originalLink ? "border-danger focus:border-danger" : "border-gray-300 focus:border-blue-base",
                  ].join(" ")}
               />
               {errors.originalLink && <ErrorMessage message={errors.originalLink.message!} />}
            </div>

            {/* Shortened link with persistent prefix */}
            <div className="flex flex-col gap-1">
               <label className={[
                  "text-xs uppercase font-semibold tracking-wide",
                  errors.shortenedLink ? "text-danger" : "text-blue-base",
               ].join(" ")}>
                  Link encurtado
               </label>
               <div className={[
                  "flex items-center rounded border px-3 py-2 bg-white transition-colors duration-150",
                  errors.shortenedLink
                     ? "border-danger focus-within:border-danger"
                     : "border-gray-300 focus-within:border-blue-base",
               ].join(" ")}>
                  <span className="text-md text-gray-400 select-none whitespace-nowrap">brev.ly/</span>
                  <input
                     {...register("shortenedLink", {
                        required: "Informe o link encurtado.",
                        validate: v =>
                           /^[a-z0-9-]+$/i.test(v.trim()) || "Apenas letras, números e hífens.",
                     })}
                     placeholder="meu-link"
                     className="flex-1 outline-none text-md text-gray-600 placeholder:text-gray-300 bg-transparent min-w-0"
                  />
               </div>
               {errors.shortenedLink && <ErrorMessage message={errors.shortenedLink.message!} />}
            </div>

            <button
               type="submit"
               disabled={isSubmitting}
               className="w-full rounded px-4 py-2 text-md text-white bg-blue-base hover:bg-blue-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150 cursor-pointer"
            >
               {isSubmitting ? "Salvando..." : "Salvar link"}
            </button>

         </form>
      </section>
   );
}

function ErrorMessage({ message }: { message: string }) {
   return (
      <p role="alert" className="flex items-center gap-1 text-sm text-danger">
         <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" className="shrink-0">
            <path d="M6 1L11.196 10H0.804L6 1Z" stroke="currentColor" strokeWidth="1.2" fill="none" />
            <line x1="6" y1="4.5" x2="6" y2="7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            <circle cx="6" cy="8.5" r="0.6" fill="currentColor" />
         </svg>
         {message}
      </p>
   );
}

