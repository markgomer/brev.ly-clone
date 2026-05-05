import "./index.css";
import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import { CreateLinkForm } from "@/components/CreateLinkForm";
import { LinkList } from "@/components/LinkList";
import { RedirectPage } from "@/components/RedirectPage";


export function App() {
   const [listKey, setListKey] = useState(0);

   async function handleClick() {
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
               <div className="max-w-7xl mx-auto p-8 flex text-center">
                  <CreateLinkForm onSuccess={() => setListKey(k => k + 1)} />
                  <button onClick={handleClick} className="border hover:underline" title="Download CSV">
                     download
                  </button>
                  <LinkList key={listKey} />
               </div>
            }
         />
         <Route path="/:slug" element={<RedirectPage />} />
      </Routes>
   );
}
