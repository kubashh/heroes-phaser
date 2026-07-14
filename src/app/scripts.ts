/// <reference types="bun-types" />

import index from "./index.html";
import { rmSync } from "fs";

const outdir = `./dist`;
const icon = `<link rel="icon"href="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9Ii0xMS41IC0xMC4yMzE3NCAyMyAyMC40NjM0OCI+CiAgPGNpcmNsZSBjeD0iMCIgY3k9IjAiIHI9IjIuMDUiIGZpbGw9IiM2MWRhZmIiLz4KICA8ZyBzdHJva2U9IiM2MWRhZmIiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSI+CiAgICA8ZWxsaXBzZSByeD0iMTEiIHJ5PSI0LjIiLz4KICAgIDxlbGxpcHNlIHJ4PSIxMSIgcnk9IjQuMiIgdHJhbnNmb3JtPSJyb3RhdGUoNjApIi8+CiAgICA8ZWxsaXBzZSByeD0iMTEiIHJ5PSI0LjIiIHRyYW5zZm9ybT0icm90YXRlKDEyMCkiLz4KICA8L2c+Cjwvc3ZnPgo="/>`;
const iconExtention = `.svg`;

if (!process.argv.includes(`--build`)) {
  dev();
} else {
  await build();
}

function dev() {
  const { url } = Bun.serve({
    routes: {
      "/": index,
      "/*": Response.redirect(`/`),
    },
    development: { hmr: true },
  });

  console.log(`> Server running at ${url}`);
}

async function build() {
  // Cleaning prev
  rmSync(outdir, {
    recursive: true,
    force: true,
  });

  // Build project
  const { outputs } = await Bun.build({
    entrypoints: [`./src/app/index.html`],
    outdir,
    minify: true,
    target: `browser`,
    define: {
      "process.env.NODE_ENV": `"production"`,
    },
    // compile: true, // it brakes js, so we need to bundle it manualy
  });
  const htmlFile = outputs.find((output) => output.path.endsWith(`.html`))!;
  // const jsFile = outputs.find((output) => output.path.endsWith(`.js`))!;
  const iconFile = outputs.find((output) =>
    output.path.endsWith(iconExtention),
  )!;

  // const jsCode = await jsFile.text();

  // minify html
  let html = minifyHtml(await htmlFile.text());

  // remove type module and crossorgin, it is unnecessary
  html = html.replace(` type="module"crossorigin`, ``);
  // bundle js fails!!!
  // html = html.replace(
  //   /<script[\s\S]*<\/script>/,
  //   `<script>` + jsCode + `</script>`,
  // );
  // bundle icon into html
  html = html.replace(/<link\b[\s\S]*?\/>/, icon);

  await Bun.write(htmlFile.path, html);

  // remove icon, becouse it is bundled
  await Bun.file(iconFile.path).delete();
}

function minifyHtml(text: string) {
  return text
    .replaceAll(`\n`, ` `)
    .replaceAll(/\s{2,}/g, ` `)
    .replaceAll(/ > | >|> /g, `>`)
    .replaceAll(/ < | <|< /g, `<`)
    .replaceAll(/ ; | ;|; /g, `;`)
    .replaceAll(/ { | {|{ /g, `{`)
    .replaceAll(/ } | }|} /g, `}`)
    .replaceAll(/ " | "|" /g, `"`)
    .replaceAll(/ , | ,|, /g, `,`);
}
