const fs = require('fs');

let dictCode = fs.readFileSync('js/dictionary.js', 'utf8');
dictCode = dictCode.replace(/sentences_pool\.forEach/g, '(window.sentences_pool || []).forEach');
fs.writeFileSync('js/dictionary.js', dictCode);

let appCode = fs.readFileSync('js/app.js', 'utf8');
appCode = appCode.replace('window.checkReadingAnswers = checkReadingAnswers;\n', '');
appCode = appCode.replace('window.fetchRssNews = fetchRssNews;\n', '');

if (!appCode.includes('window.checkReadingAnswers = reading.checkReadingAnswers')) {
    appCode += '\nwindow.checkReadingAnswers = reading.checkReadingAnswers;\n';
}
if (!appCode.includes('window.fetchRssNews = reading.fetchRssNews')) {
    appCode += '\nwindow.fetchRssNews = reading.fetchRssNews;\n';
}
fs.writeFileSync('js/app.js', appCode);

console.log('Patched dictionary.js and app.js');
