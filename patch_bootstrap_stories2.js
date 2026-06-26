const fs = require('fs');
let code = fs.readFileSync('js/bootstrap.js', 'utf8');

// Remove it from inside the if
code = code.replace(/appState\.stories = \[\s*\{\s*title: 'Der Apfel'[\s\S]*?\];/g, '');

// Put it outside
const initBlock = `
if (!appState.stories || appState.stories.length === 0) {
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
  utils.save('dt_stories', appState.stories);
}
`;

code = code.replace(/utils\.save\('dt_stories', appState\.stories\);/g, ''); // Remove the old save calls
code = code.replace(/let dt_stories = utils\.load\('dt_stories', \[\]\);/g, ''); // Clean up any stray stuff

code += '\n' + initBlock;

fs.writeFileSync('js/bootstrap.js', code);
console.log('Fixed appState.stories initialization!');
