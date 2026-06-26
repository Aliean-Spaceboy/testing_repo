const fs = require('fs');

// 1. Fix index.html
let html = fs.readFileSync('index.html', 'utf8');
const lines = html.split('\n');
if (lines[99] && lines[99].includes('</div>')) {
  lines[99] = ''; // Remove the premature closing tag
  fs.writeFileSync('index.html', lines.join('\n'));
  console.log('Fixed index.html structure.');
} else {
  console.log('Line 99 not exactly div. Searching...');
  let l = 90;
  while(l < 105) {
    if (lines[l].trim() === '</div>' && lines[l+1] && lines[l+1].includes('grid-2')) {
      lines[l] = '';
      fs.writeFileSync('index.html', lines.join('\n'));
      console.log('Fixed index.html structure at line ' + l);
      break;
    }
    l++;
  }
}

// 2. Fix js/script.js restore logic
let js = fs.readFileSync('js/script.js', 'utf8');

const restoreLogicOld = `    const parsed = JSON.parse(file.content);
    if(parsed.appState) {
      // Overwrite local storage keys
      localStorage.setItem('dt_sentences', JSON.stringify(parsed.appState.dailySentences));
      localStorage.setItem('dt_sentences_pool', JSON.stringify(parsed.appState.sentences_pool));
      localStorage.setItem('dt_stories', JSON.stringify(parsed.appState.stories));
      localStorage.setItem('dt_stories_pool', JSON.stringify(parsed.appState.stories_pool));
      localStorage.setItem('dt_grammar_pool', JSON.stringify(parsed.appState.grammar_pool));
      localStorage.setItem('dt_entries', JSON.stringify(parsed.appState.diaryEntries));
      localStorage.setItem('dt_vocab', JSON.stringify(parsed.appState.vocab));
      localStorage.setItem('dt_vocab_pool', JSON.stringify(parsed.appState.vocab_pool));
      localStorage.setItem('dt_speak', JSON.stringify(parsed.appState.speakNotesList));
      alert('Data restored successfully! The page will now reload.');
      location.reload();
    }`;

const restoreLogicNew = `    const parsed = JSON.parse(file.content);
    
    // Support NEW appState format
    if (parsed.appState) {
      if(parsed.appState.dailySentences) localStorage.setItem('dt_sentences', JSON.stringify(parsed.appState.dailySentences));
      if(parsed.appState.sentences_pool) localStorage.setItem('dt_sentences_pool', JSON.stringify(parsed.appState.sentences_pool));
      if(parsed.appState.stories) localStorage.setItem('dt_stories', JSON.stringify(parsed.appState.stories));
      if(parsed.appState.stories_pool) localStorage.setItem('dt_stories_pool', JSON.stringify(parsed.appState.stories_pool));
      if(parsed.appState.grammar_pool) localStorage.setItem('dt_grammar_pool', JSON.stringify(parsed.appState.grammar_pool));
      if(parsed.appState.diaryEntries) localStorage.setItem('dt_entries', JSON.stringify(parsed.appState.diaryEntries));
      if(parsed.appState.vocab) localStorage.setItem('dt_vocab', JSON.stringify(parsed.appState.vocab));
      if(parsed.appState.vocab_pool) localStorage.setItem('dt_vocab_pool', JSON.stringify(parsed.appState.vocab_pool));
      if(parsed.appState.speakNotesList) localStorage.setItem('dt_speak', JSON.stringify(parsed.appState.speakNotesList));
      alert('Data restored successfully! The page will now reload.');
      location.reload();
    } 
    // Support LEGACY format (dt_vocab, dt_entries directly in root)
    else if (parsed.dt_entries || parsed.dt_vocab) {
      if (parsed.dt_entries) localStorage.setItem('dt_entries', JSON.stringify(parsed.dt_entries));
      if (parsed.dt_vocab) localStorage.setItem('dt_vocab', JSON.stringify(parsed.dt_vocab));
      if (parsed.dt_speak) localStorage.setItem('dt_speak', JSON.stringify(parsed.dt_speak));
      if (parsed.dt_roadmap) localStorage.setItem('dt_roadmap', JSON.stringify(parsed.dt_roadmap));
      if (parsed.dt_reflect) localStorage.setItem('dt_reflect', JSON.stringify(parsed.dt_reflect));
      if (parsed.dt_sentences) localStorage.setItem('dt_sentences', JSON.stringify(parsed.dt_sentences));
      alert('Legacy Data restored successfully! The page will now reload.');
      location.reload();
    } else {
      throw new Error('Unrecognized database format in Gist.');
    }`;

js = js.replace(restoreLogicOld, restoreLogicNew);
fs.writeFileSync('js/script.js', js);
console.log('Fixed restoreFromCloud logic.');
