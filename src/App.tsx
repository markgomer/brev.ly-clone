import "./index.css";
import { LinkList } from "./LinkList";

export function App() {
  return (
    <div className="max-w-7xl mx-auto p-8 text-center relative z-10">
      <form className="justify-center items-center gap-8 mb-8">
        <label >url</label><br/>
        <input className="border-2 border-white" type="text"/><br/>
        <label>shortened link</label><br/>
        <input className="border-2 border-white" type="text"/><br/>
        <input className="border-2 border-white" type="submit" value="Submit"/>
      </form>

      <div>
        <LinkList />
      </div>

    </div>
  );
}

export default App;
