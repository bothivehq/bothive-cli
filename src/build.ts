import * as esbuild from "esbuild";

esbuild
  .build({
    entryPoints: ["./dist/index.js"],
    bundle: true,
    platform: "node",
    target: "node14",
    outfile: "./bin/bothive.js",
    format: "esm",
    banner: {
      js: "#!/usr/bin/env node",
    },
  })
  .catch(() => process.exit(1));
