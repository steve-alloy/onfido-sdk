import fs from "node:fs";
import { build } from "esbuild";

// Imports for bundling JS
import esbuildSvelte from "esbuild-svelte";
import sveltePreprocess from "svelte-preprocess";

// Simple HTML bundler
const esbuildHTML = {
	name: "esbuild-html",
	setup(build) {
		build.onStart(() => {
			if (!fs.existsSync("./build/public/index.html")) {
				fs.mkdirSync("./build");
				fs.mkdirSync("./build/public");
				fs.writeFileSync("./build/public/index.html", "");
			}

			fs.copyFileSync("./web/public/index.html", "./build/public/index.html");
		});
	}
};

const watch = process.argv.includes("watch");

build({
	entryPoints: ["./web/src/main.js"],
	bundle: true,
	minify: true,
	treeShaking: true,
	outfile: "./build/public/assets/bundle.js",
	watch: watch,
	sourcemap: true,
	platform: "browser",
	plugins: [
		esbuildSvelte({
			preprocess: sveltePreprocess()
		}),
		esbuildHTML
	]
}).catch(() => process.exit(1));
