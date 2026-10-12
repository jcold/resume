import * as esbuild from "esbuild";
import { solidPlugin } from "esbuild-plugin-solid";
import path from "path";
import { mkdirSync } from "fs";

const isDevMode = process.env.NODE_ENV !== "production";

const jsRenderBuild = {
  entryPoints: {
    "everkm-render": "src/entries/jsrender.ts",
  },
  bundle: true,
  outfile: "./templates/everkm-render.js",
  minify: false,
  sourcemap: false,
  format: "esm",
  platform: "node",
  target: "es2020",
  define: {
    "process.env.NODE_ENV": JSON.stringify(
      isDevMode ? "development" : "production",
    ),
    global: "globalThis",
  },
  loader: {
    ".js": "jsx",
    ".jsx": "jsx",
    ".ts": "tsx",
    ".tsx": "tsx",
    ".css": "text",
  },
  jsx: "preserve",
  jsxImportSource: "solid-js",
  plugins: [
    solidPlugin({
      solid: { generate: "ssr", hydratable: false },
    }),
  ],
};

mkdirSync(path.dirname(jsRenderBuild.outfile), { recursive: true });

esbuild
  .build(jsRenderBuild)
  .then(() => {
    console.log("JSRender bundle written:", jsRenderBuild.outfile);
  })
  .catch((error) => {
    console.error("Build failed:", error);
    process.exit(1);
  });
