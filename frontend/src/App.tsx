import "./index.css";
import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import { CreateLinkForm } from "@/components/CreateLinkForm";
import { LinkList } from "@/components/LinkList";
import { RedirectPage } from "@/components/RedirectPage";
import logo from "../assets/Logo.svg";

export function App() {
   const [listKey, setListKey] = useState(0);

   async function handleDownload() {
      const res = await fetch(
         `http://localhost:3333/shortlinks/exports`,
         { method: "GET" }
      );
      const { reportUrl: url } = await res.json();

      const a = document.createElement("a");
      a.href = url;
      a.click();
   }

   return (
      <Routes>
         <Route
            path="/"
            element={
               <div className="min-h-screen overflow-hidden bg-gray-100 px-4 py-8 flex flex-col">
                  <header className="max-w-4xl mx-auto mb-8">
                     <div className="flex items-center gap-2">
                        <img src={logo} alt="brev.ly" className="h-8" />
                     </div>
                  </header>

                  <main className="max-w-4xl w-full mx-auto flex flex-col md:flex-row gap-4 items-start flex-1 min-h-0">
                     <CreateLinkForm onSuccess={() => setListKey(k => k + 1)} />
                     <LinkList key={listKey} onDownload={handleDownload}/>
                  </main>
               </div>
            }
         />
         <Route path="/:slug" element={<RedirectPage />} />
      </Routes>
   );
}
