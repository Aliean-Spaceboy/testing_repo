const fs = require('fs');

const helpers = ['load', 'save', 'todayStr', 'showToast'];
const files = fs.readdirSync('js').filter(f => f.endsWith('.js'));

for (const f of files) {
  let content = fs.readFileSync('js/' + f, 'utf8');
  for (const helper of helpers) {
    // regex: not preceded by "utils." or "window." or "function " or "export function "
    // and followed by "("
    const regex = new RegExp(`(?<!utils\\.|window\\.|function |export function |export async function |const )\\b${helper}\\(`, 'g');
    const matches = content.match(regex);
    if (matches) {
       // if not imported
       if (!content.includes(`import {`) || (!content.includes(`${helper}`) || !content.includes(`} from './utils.js'`))) {
          // It might be using import * as utils, but calling it without utils.
          console.log(`Implicit ${helper}() found in ${f}`);
       }
    }
  }
}
