const fs = require("fs");

/* FIX 1: wrong filename in cloud.js */
let cloud = fs.readFileSync("js/cloud.js", "utf8");
const old1 = "const vRes = await fetch('data/appState.vocab-api.json');";
const new1 = "const vRes = await fetch('data/vocab-api.json');";
if (cloud.includes(old1)) {
    cloud = cloud.replace(old1, new1);
    console.log("Fixed: data/appState.vocab-api.json -> data/vocab-api.json");
} else {
    console.log("vocab-api path already correct or not found");
}
fs.writeFileSync("js/cloud.js", cloud);

/* FIX 2: add favicon.ico to avoid 404 */
// Create a tiny 1x1 pixel ICO as base64
const faviconHtml = `<link rel="icon" type="image/png" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABmJLR0QA/wD/AP+gvaeTAAAA50lEQVRYhe2WMQ6DMAxFX0+gJ+iQtXcoxUeAIzBzg7J3oKdgwCu0VCqRsON/dkRI/b8sWYkTx3ESQgghhGgVABuAI7AFdsCaawGwAA/gCaSWmFIKaV3X3bquSyklpZR2ANgBYAeAHQB2ANgBYAeAHQB2ANgBYAeAHQB2ANgBYAeAHQB2ANgBYAeAHQB2ANgBYAeAHQB2ANgBYAeAHQB2ANgBYAeAHQB2ANgBYAeAHQB2ANgBYAeAHQB2ANgBYAeAHQB2ANgBYAeAHQB2ANgBYAeAHQB2ANgBYAeAHQB2ANgBYAeAHQB2ANgBYAeAHQB2ANgBYAeAHQCvOwAAAABJRU5ErkJggg==">`;

let html = fs.readFileSync("index.html", "utf8");
if (!html.includes('rel="icon"')) {
    html = html.replace('</head>', faviconHtml + '\n</head>');
    fs.writeFileSync("index.html", html);
    console.log("Added favicon to fix 404");
} else {
    console.log("Favicon already present");
}

console.log("Done!");
