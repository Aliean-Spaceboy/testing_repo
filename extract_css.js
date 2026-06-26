const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// Match the entire <style> ... </style> block
const styleRegex = /<style>([\s\S]*?)<\/style>/i;
const match = html.match(styleRegex);

if (match) {
  let cssContent = match[1];

  // Overwrite the :root variables with the Brown Gruvbox theme
  const rootRegex = /:root\s*{[^}]*}/;
  const brownTheme = `:root {
  --bg: #282828;
  --surface: #3c3836;
  --surface2: #504945;
  --border: #665c54;
  --accent: #83a598; /* Muted Aqua/Blue */
  --accent2: #d3869b; /* Muted Purple */
  --accent3: #fabd2f; /* Gold/Yellow */
  --text: #ebdbb2;
  --text-muted: #a89984;
  --danger: #fb4934; /* Red */
  --success: #b8bb26; /* Green */
  --gold: #fabd2f;
  --radius: 12px;
  --shadow: 0 4px 20px rgba(0,0,0,0.5);
}`;

  cssContent = cssContent.replace(rootRegex, brownTheme);

  // Write to style.css
  fs.writeFileSync('style.css', cssContent.trim() + '\n', 'utf8');
  console.log("Extracted CSS and applied Brown Theme to style.css.");

  // Remove <style> block from HTML and add <link>
  const linkTag = '<link rel="stylesheet" href="style.css"/>';
  html = html.replace(styleRegex, linkTag);
  
  fs.writeFileSync('index.html', html, 'utf8');
  console.log("Updated index.html to link style.css.");
} else {
  console.log("No <style> block found in index.html!");
}
