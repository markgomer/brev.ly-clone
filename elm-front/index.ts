import "./src/styles.css";
// @ts-ignore
import { Elm } from "./src/Main.elm";

const elmApp = Elm.Main.init({
    // @ts-ignore
    node: document.getElementById("elm-app")!
});

// subscribe to msgs at the Elm port
elmApp.ports.redirect.subscribe((slug: string) => {
    setTimeout(() => {
        // @ts-ignore
        window.location.href = "http://localhost:3333/" + slug;
    }, 1000);
});
