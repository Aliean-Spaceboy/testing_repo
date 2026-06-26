// js/quiz.js
import { appState } from './state.js';
import { QUIZ_BANKS, escHtml } from './utils.js';

let quizState = { questions: [], idx: 0, score: 0 };

export function startQuiz(type) {
  let questions = [];
  if (type === 'vocab' || type === 'weekly') {
    let source = appState.vocab;
    if (type === 'weekly') {
      const wkTs = Date.now() - 7*86400000;
      source = appState.vocab.filter(v => new Date(v.date).getTime() > wkTs);
      if (source.length < 4) source = appState.vocab; // fallback if list too short
    }
    if (source.length < 4) {
      window.showToast('⚠️ You need at least 4 vocabulary words to play this quiz!');
      return;
    }
    source = [...source].sort(()=>0.5-Math.random());
    const subset = source.slice(0, 10);
    questions = subset.map(v => {
      const isDeToEn = Math.random() > 0.5;
      const q = isDeToEn ? v.de + " = ?" : v.en + " = ?";
      const a = isDeToEn ? v.en : v.de;
      
      const distractors = [...appState.vocab]
        .filter(x => x.de !== v.de)
        .sort(()=>0.5-Math.random())
        .slice(0, 3)
        .map(x => isDeToEn ? x.en : x.de);
      
      const opts = [a, ...distractors].sort(()=>0.5-Math.random());
      return { q, options: opts, a };
    });
  } else if (type === 'gender') {
    // Gender game: pick nouns from vocab that have der/die/das
    const nouns = appState.vocab.filter(v => /^(der|die|das)\s/i.test(v.de));
    if (nouns.length < 4) {
      window.showToast('?? Add at least 4 German nouns with der/die/das to play Gender Game!');
      return;
    }
    const subset = [...nouns].sort(()=>0.5-Math.random()).slice(0, 10);
    questions = subset.map(v => {
      const article = v.de.split(' ')[0].toLowerCase();
      const word = v.de.split(' ').slice(1).join(' ');
      const q = 'What is the article for: ' + word + '?';
      const allArticles = ['der', 'die', 'das'];
      const wrong = allArticles.filter(a => a !== article);
      const opts = [article, ...wrong].sort(() => 0.5 - Math.random());
      return { q, options: opts, a: article };
    });
  } else {
    questions = [...QUIZ_BANKS[type]].sort(()=>0.5-Math.random()).slice(0, 10);
  }

  quizState = { questions, idx: 0, score: 0 };
  document.getElementById('quizMenu').style.display = 'none';
  document.getElementById('quizResult').style.display = 'none';
  document.getElementById('quizActive').style.display = 'block';
  
  const labels = { vocab: 'Vocabulary Quiz', article: 'Article Quiz', sentence: 'Sentence Order', weekly: 'Weekly Review', gender: 'Gender Game ??' };
  document.getElementById('quizTypeLabel').textContent = labels[type];
  
  renderQuestion();
}

export function renderQuestion() {
  const c = quizState;
  const q = c.questions[c.idx];
  document.getElementById('quizProgress').textContent = `${c.idx + 1} / ${c.questions.length}`;
  document.getElementById('quizQuestion').textContent = q.q;
  
  const optsEl = document.getElementById('quizOptions');
  optsEl.innerHTML = q.options.map((opt) => `
      <button class="quiz-opt" data-article="${opt.toLowerCase().split(' ')[0]}" onclick="selectAnswer('${opt.replace(/'/g,"\\'")}', this)">${escHtml(opt)}</button>
    `).join('');
  document.getElementById('quizNextBtn').style.display = 'none';
}

export function selectAnswer(ans, btn) {
  if (document.querySelector('.quiz-opt.correct') || document.querySelector('.quiz-opt.wrong')) return;
  
  const c = quizState;
  const correctAns = c.questions[c.idx].a;
  
  document.querySelectorAll('.quiz-opt').forEach(b => {
    if (b.textContent === correctAns) b.classList.add('correct');
    else if (b === btn) b.classList.add('wrong');
    b.disabled = true;
  });
  
  if (ans === correctAns) {
    c.score++;
    window.showToast('✅ Richtig!');
  } else {
    window.showToast('❌ Falsch!');
  }
  
  document.getElementById('quizNextBtn').style.display = 'block';
}

export function nextQuestion() {
  quizState.idx++;
  if (quizState.idx >= quizState.questions.length) {
    endQuiz();
  } else {
    renderQuestion();
  }
}

export function endQuiz() {
  document.getElementById('quizActive').style.display = 'none';
  document.getElementById('quizResult').style.display = 'block';
  document.getElementById('quizScore').textContent = `${quizState.score} / ${quizState.questions.length}`;
}

export function quitQuiz() {
  document.getElementById('quizActive').style.display = 'none';
  document.getElementById('quizResult').style.display = 'none';
  document.getElementById('quizMenu').style.display = 'block';
}

export function renderGrammar() {
  document.getElementById('allTips').innerHTML = GRAMMAR_TIPS.map((t,i) => `
    <div class="tip-card" style="margin-bottom:14px">
      <div class="tip-num">Tip ${i+1}</div>
      <div class="tip-rule">${t.rule}</div>
      <div class="tip-example">${escHtml(t.example)}</div>
    </div>
  `).join('');
}

export function buildSentence(){
 document.getElementById('sbResult').innerText=
 `${document.getElementById('sbSub').value} ${document.getElementById('sbVerb').value} ${document.getElementById('sbObj').value}.`;
}

export function setupSentenceBuilder() {
  const wordEl = document.getElementById('builderWord');
  if(!wordEl) return;
  if(appState.vocab.length > 0) {
    const randomVocab = appState.vocab[Math.floor(Math.random() * appState.vocab.length)];
    wordEl.innerText = randomVocab.de;
  } else {
    wordEl.innerText = "lernen"; // fallback
  }
}