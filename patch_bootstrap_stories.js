const fs = require('fs');

const storyCode = `
  appState.stories = [
    {
      title: 'Der Apfel',
      text: 'Das ist ein roter Apfel. Er liegt auf dem Tisch.',
      questions: [
        { text: 'Welche Farbe hat der Apfel?', options: ['Rot', 'Grün', 'Blau'], answer: 'Rot' },
        { text: 'Wo liegt der Apfel?', options: ['Auf dem Boden', 'Auf dem Tisch', 'Im Schrank'], answer: 'Auf dem Tisch' },
        { text: 'Ist es ein Apfel?', options: ['Ja', 'Nein', 'Vielleicht'], answer: 'Ja' }
      ]
    }
  ];
`;

let code = fs.readFileSync('js/bootstrap.js', 'utf8');
code = code.replace('appState.stories = [];', storyCode);
fs.writeFileSync('js/bootstrap.js', code);
console.log('Added hardcoded story to bootstrap.js');
