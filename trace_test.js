const { JSDOM } = require('jsdom');
const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');
let js = fs.readFileSync('script.js', 'utf8');

// Strip localStorage natively in script
js = js.replace(/localStorage/g, 'mockStorage');

const dom = new JSDOM(html, { runScripts: "dangerously", url: "http://localhost/" });
const window = dom.window;

window.mockStorage = {
  store: {},
  getItem(k) { return this.store[k] || null; },
  setItem(k,v) { this.store[k] = v; },
  removeItem(k) { delete this.store[k]; }
};

window.eval(js);

console.log("EVAL COMPLETE. Running listeners...");

try {
  window.document.dispatchEvent(new window.Event('DOMContentLoaded'));
} catch (e) {
  console.log("CRASH:", e.stack);
}
