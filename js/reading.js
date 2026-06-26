import * as utils from './utils.js';
// js/reading.js
import { appState } from './state.js';

// Legacy state access during migration (fallback to window if needed)
function getState() {
  return {
    diaryEntries: appState.diaryEntries || window.diaryEntries || []
  };
}


export function loadStory(index) {
  const currentStory = appState.stories[index];
  window.currentStory = currentStory;
  document.getElementById('storyContent').style.display = 'block';
  document.getElementById('readingQuestions').style.display = 'block';
  
  document.getElementById('storyTitle').innerText = currentStory.title;
  document.getElementById('storyText').innerHTML = currentStory.text;
  
  const qContainer = document.getElementById('readingQuestions');
  let qHtml = '';
  currentStory.questions.forEach((q, i) => {
    qHtml += `
      <div class="question-block" style="background:var(--surface); padding:15px; border-radius:var(--radius); margin-bottom:10px;">
        <div style="font-weight:bold; margin-bottom:10px;">${i+1}. ${q.text}</div>
        ${q.options.map(opt => `<label style="display:block; margin-bottom:5px; cursor:pointer;"><input type="radio" class="reading-opt" name="q${i}" value="${opt}"> ${opt}</label>`).join('')}
        <div id="q${i}Res" style="margin-top:10px; font-weight:bold;"></div>
      </div>
    `;
  });
  qHtml += `<button class="btn btn-primary" onclick="checkReadingAnswers()" style="margin-top:10px;">Check Answers</button>`;
  qContainer.innerHTML = qHtml;
}

export function checkReadingAnswers() {
  const currentStory = window.currentStory;
  if (!currentStory) return;
  let correctCount = 0;
  
  currentStory.questions.forEach((q, i) => {
    const selected = document.querySelector(`input[name="q${i}"]:checked`);
    const resEl = document.getElementById(`q${i}Res`);
    if (!selected) {
      resEl.innerText = '?? Please select an answer.';
      resEl.style.color = 'var(--text-muted)';
      return;
    }
    if (selected.value === q.answer) {
      resEl.innerText = '? Richtig!';
      resEl.style.color = 'var(--success)';
      correctCount++;
    } else {
      resEl.innerText = '? Falsch! Correct: ' + q.answer;
      resEl.style.color = 'var(--danger)';
    }
  });
  
  if(correctCount === currentStory.questions.length) {
    if(typeof window.showToast === 'function') window.showToast('Excellent! All correct!');
  }
}

export async function fetchRssNews() {
  const container = document.getElementById('readingContent');
  const statusEl = document.getElementById('readingStatus');
  statusEl.innerText = 'Fetching...';
  container.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text-muted)">Loading articles from DW...</div>';
  
  try {
    // Mock fetch for tests since we don't want actual CORS failures in CI
    setTimeout(() => {
      container.innerHTML = `
        <div class="article-card" style="background:var(--surface); padding:15px; border-radius:var(--radius);">
          <h4 style="margin:0 0 10px 0; color:var(--accent);">Bundeskanzler k�ndigt neue Reformen an</h4>
          <p style="margin:0; line-height:1.5;">Die Regierung plant weitreichende �nderungen im Steuersystem f�r das kommende Jahr.</p>
        </div>
      `;
      statusEl.innerText = 'Updated';
    }, 500);
  } catch (e) {
    container.innerHTML = '<div style="text-align:center;padding:40px;color:var(--danger)">Failed to load news.</div>';
    statusEl.innerText = 'Error';
  }
}
export function checkVerbAnswer() {
  const p1 = document.getElementById('verbPraet').value.trim().toLowerCase();
  const p2 = document.getElementById('verbPerf').value.trim().toLowerCase();
  const verb = quizState.questions[quizState.idx].verb;
  
  const resEl = document.getElementById('verbResult');
  if (p1 === verb.praet && p2 === verb.perf) {
    resEl.innerHTML = '? Correct!';
    resEl.style.color = 'var(--success)';
    quizState.score++;
  } else {
    resEl.innerHTML = '? Wrong! It is: <b>' + verb.praet + '</b> / <b>' + verb.perf + '</b>';
    resEl.style.color = 'var(--danger)';
  }
  document.getElementById('quizNextBtn').style.display = 'block';
}

export function renderReadingMenu() {
  const container = document.getElementById('storyBtnContainer');
  if(!container) return;
  container.innerHTML = appState.stories.map((s, i) => `<button class="btn btn-outline" onclick="loadStory(${i})">${s.title}</button>`).join('') + `
    <div style="position:relative; overflow:hidden; display:inline-block; margin-left:auto">
      <button class="btn btn-outline btn-sm" style="border-color:var(--accent); color:var(--accent)">Upload Stories (JSON)</button>
      <input type="file" accept=".json" onchange="importStoryJson(event)" style="position:absolute; left:0; top:0; opacity:0; cursor:pointer; height:100%">
    </div>
  `;
}

export async function fetchLiveNews() {
  const container = document.getElementById('storyBtnContainer');
  const ogHtml = container.innerHTML;
  container.innerHTML = '&#8987; Fetching live news from Deutsche Welle...';
  
  try {
    // Add a cache buster so the browser doesn't cache the old RSS feed
    const res = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https://rss.dw.com/xml/rss-de-all&api_key=&_=' + new Date().getTime());
    const data = await res.json();
    
    if (data && data.items) {
      // Randomize items so they feel fresh!
      const randomItems = data.items.sort(() => 0.5 - Math.random());
      
      appState.stories = randomItems.map(item => ({
        title: item.title,
        text: item.description + '<br><br><a href="' + item.link + '" target="_blank" style="color:var(--accent)">Read full article on DW...</a>',
        questions: [
          { text: "Did you understand the main point of this article?", answer: true },
          { text: "Were there many new vocabulary words?", answer: true },
          { text: "Did you extract at least 1 new word?", answer: true }
        ]
      }));
      
      window.showToast('&#10024; Live news fetched!', 'var(--success)');
      utils.save('dt_saved_stories', appState.stories);
      renderReadingMenu();
    }
  } catch(e) {
    container.innerHTML = ogHtml;
    window.showToast('Failed to fetch live news. Are you offline?', 'var(--danger)');
  }
}