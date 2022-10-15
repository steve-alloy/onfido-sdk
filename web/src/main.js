import App from "./App.svelte";
import "../public/styles.css";

const app = new App({
	target: document.body.querySelector("#main")
});

export default app;