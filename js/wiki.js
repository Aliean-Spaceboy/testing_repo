// js/wiki.js

export function openWiki() {
  const el = document.getElementById('wikiModal');
  if (el) el.classList.add('open');
}

export function closeWiki() {
  const el = document.getElementById('wikiModal');
  if (el) el.classList.remove('open');
}