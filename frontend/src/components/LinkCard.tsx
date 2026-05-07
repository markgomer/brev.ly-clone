import { CheckIcon, CopyIcon, TrashIcon } from "@phosphor-icons/react";
import { useRef, useState } from "react";

type Link = {
   originalURL: string;
   shortenedURL: string;
   numberOfAccesses: number
};

type Props = {
   link: Link;
   onDelete: (shortenedURL: string) => void;
};

type ConfirmDialogProps = {
   onConfirm: () => void;
   onCancel: () => void;
};

function ConfirmDialog({ onConfirm, onCancel }: ConfirmDialogProps) {
   return (
      <div
         role="dialog"
         aria-modal="true"
         aria-labelledby="confirm-title"
         className="fixed inset-0 z-50 flex items-center justify-center"
      >
         {/* Backdrop */}
         <div className="absolute inset-0 bg-gray-600/40" onClick={onCancel} />

         {/* Panel */}
         <div className="relative bg-white rounded-xl shadow-lg p-6 w-80 flex \
            flex-col gap-5">
            <div className="flex flex-col gap-1">
               <h2 id="confirm-title" className="text-lg text-gray-600">
                  Excluir link
               </h2>
               <p className="text-sm text-gray-400">
                  Tem certeza que deseja excluir este link? Esta ação não pode \
                  ser desfeita.
               </p>
            </div>

            <div className="flex gap-3 justify-end">
               <button
                  onClick={onCancel}
                  className="rounded border border-gray-300 px-4 py-2 text-md \
                     text-gray-600 hover:border-blue-base hover:text-blue-base \
                     transition-colors duration-150 cursor-pointer"
               >
                  Cancelar
               </button>
               <button
                  onClick={onConfirm}
                  className="rounded px-4 py-2 text-md text-white bg-danger \
                     hover:opacity-90 transition-opacity duration-150 \
                     cursor-pointer"
               >
                  Excluir
               </button>
            </div>
         </div>
      </div>
   );
}

export function LinkCard({ link, onDelete }: Props) {
   const [copied, setCopied] = useState(false);
   const [isConfirmingDialogShown, setConfirmingDialog] = useState(false);
   const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
   const fullShortenedURL = `localhost:5173/${link.shortenedURL}`;

   async function handleConfirmDeletion() {
      const response = await fetch(
         `http://localhost:3333/shortlinks/${encodeURIComponent(link.shortenedURL)}`,
         { method: "DELETE" }
      )
      if (response.ok) onDelete(link.shortenedURL)
   }
   function handleCopy() {
      navigator.clipboard.writeText(fullShortenedURL);
      setCopied(true);
      if (copyTimer.current) clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 2000);
   }

   return (
      <>
         {isConfirmingDialogShown && (
            <ConfirmDialog
               onConfirm={handleConfirmDeletion}
               onCancel={() => setConfirmingDialog(false)}
            />
         )}
         <div className="flex items-center justify-between gap-4 py-3">
            {/* links */}
            <div className="flex flex-col min-w-0">
               <a
                  href={`http://localhost:5173/${link.shortenedURL}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-md font-semibold text-blue-base truncate \
                     hover:underline"
               >
                  {fullShortenedURL}
               </a>
               <span className="text-sm text-gray-400 truncate">
                  {link.originalURL}
               </span>
            </div>

            {/* access count and icons */}
            <div className="flex items-center gap-2 shrink-0">
               <span className="text-sm text-gray-400 whitespace-nowrap">
                  {link.numberOfAccesses} {
                     link.numberOfAccesses === 1 ? "acesso" : "acessos"
                  }
               </span>

               {/* copy button */}
               <button
                  onClick={handleCopy}
                  title="Copiar link"
                  className={[
                     "inline-flex items-center justify-center size-6 rounded",
                     "border border-gray-300 text-gray-500 hover:border-blue-base",
                     "hover:text-blue-base transition-colors duration-150",
                     "cursor-pointer text-sm",
                     copied
                        ? "border-green-500 text-green-600 bg-green-50"
                        : "border-gray-300 text-gray-500 hover:border-blue-base"
                  ].join(" ")}
               >
                  {copied ? (
                     <>
                        <CheckIcon size={13} />
                     </>
                  ) : (
                     <CopyIcon size={14} />
                  )}
               </button>

               <button
                  onClick={() => setConfirmingDialog(true)}
                  title="Excluir link"
                  className="inline-flex items-center justify-center size-6 \
                     rounded border border-gray-300 text-gray-500 \
                     hover:border-danger hover:text-danger transition-colors \
                     duration-150 cursor-pointer"
               >
                  <TrashIcon size={14} />
               </button>
            </div>
         </div>
      </>
   )
}
