import "./index.css";
import { useState } from "react";
import { CreateLinkForm } from "@/components/CreateLinkForm";
import { LinkList } from "@/components/LinkList";


export function App() {
   const [listKey, setListKey] = useState(0);

   return (
      <div className="max-w-7xl mx-auto p-8 text-center relative z-10">
         <div>
            <CreateLinkForm onSuccess={() => setListKey(k => k + 1)} />
         </div>
         <div>
            <LinkList key={listKey} />
         </div>
      </div>
   );
}

export default App;
