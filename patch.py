import sys

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

old_css = '''    .nav-btn{background:none;border:none;color:var(--text-muted);padding:14px 18px;cursor:pointer;font-size:.9rem;font-weight:500;border-bottom:3px solid transparent;transition:all .2s;white-space:nowrap;font-family:'Inter',sans-serif}
    .nav-btn:hover{color:var(--text)}
    .nav-btn.active{color:var(--accent);border-bottom-color:var(--accent)}'''

new_css = '''    .nav-btn{background:none;border:none;color:var(--text-muted);padding:14px 18px;cursor:pointer;font-size:.9rem;font-weight:500;border-bottom:3px solid transparent;transition:all .2s;white-space:nowrap;font-family:'Inter',sans-serif}
    .nav-btn:hover{color:var(--text)}
    .nav-btn.active{color:var(--accent);border-bottom-color:var(--accent)}

    /* DROPDOWN MENU */
    .dropdown { position: relative; display: inline-block; }
    .drop-btn { display:flex; align-items:center; gap:6px; }
    .dropdown-content { display: none; position: absolute; left: 0; top: 100%; background: var(--surface); border: 1px solid var(--border); box-shadow: var(--shadow); z-index: 200; border-radius: 12px; flex-direction: column; min-width: 200px; padding: 6px; }
    .dropdown-content .nav-btn { width: 100%; text-align: left; padding: 12px 16px; border: none; border-radius: 8px; }
    .dropdown-content .nav-btn:hover { background: rgba(91,141,238,0.1); }
    .dropdown-content.show { display: flex; animation: fadeIn 0.2s ease; }'''

content = content.replace(old_css, new_css)

old_html = '''<nav>
  <div class="nav-inner">
    <button class="nav-btn active" onclick="showSection('dashboard')">?? Dashboard</button>
    <button class="nav-btn" onclick="showSection('diary')">?? Diary</button>
    <button class="nav-btn" onclick="showSection('vocab')">?? Vocabulary</button>
    <button class="nav-btn" onclick="showSection('speaking')">?? Speaking</button>
    <button class="nav-btn" onclick="showSection('reflection')">?? Weekly Reflection</button>
    <button class="nav-btn" onclick="showSection('quiz')">?? Quiz</button>
    <button class="nav-btn" onclick="showSection('entries')">?? Past Entries</button>
    <button class="nav-btn" onclick="showSection('grammar')">?? Grammar Tips</button>
  </div>
</nav>'''

new_html = '''<nav>
  <div class="nav-inner">
    <button class="nav-btn active" onclick="showSection('dashboard')">?? Dashboard</button>
    <button class="nav-btn" onclick="showSection('diary')">?? Diary</button>
    <button class="nav-btn" onclick="showSection('vocab')">?? Vocabulary</button>
    
    <div class="dropdown">
      <button class="nav-btn drop-btn" onclick="toggleDropdown(event)">? More <span style="font-size:0.7rem">?</span></button>
      <div class="dropdown-content" id="moreDropdown">
        <button class="nav-btn" onclick="showSection('speaking')">?? Speaking</button>
        <button class="nav-btn" onclick="showSection('reflection')">?? Weekly Reflection</button>
        <button class="nav-btn" onclick="showSection('quiz')">?? Quiz</button>
        <button class="nav-btn" onclick="showSection('entries')">?? Past Entries</button>
        <button class="nav-btn" onclick="showSection('grammar')">?? Grammar Tips</button>
      </div>
    </div>
  </div>
</nav>'''

content = content.replace(old_html, new_html)

old_js = '''// --- NAV ----------------------------------------------------------------------
function showSection(id) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('section-' + id).classList.add('active');
  document.querySelectorAll('.nav-btn').forEach(b => {
    if (b.getAttribute('onclick') && b.getAttribute('onclick').includes("'" + id + "'")) {
      b.classList.add('active');
    }
  });
  if (id === 'entries') renderEntries();
  if (id === 'vocab') { renderVocab('All'); document.querySelectorAll('.tab')[0]?.classList.add('active'); }
  if (id === 'grammar') renderGrammar();
  if (id === 'speaking') renderSpeaking();
  if (id === 'reflection') renderReflections();
  if (id === 'quiz') quitQuiz();
}'''

new_js = '''// --- NAV ----------------------------------------------------------------------
function showSection(id) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('section-' + id).classList.add('active');
  document.querySelectorAll('.nav-btn').forEach(b => {
    if (b.getAttribute('onclick') && b.getAttribute('onclick').includes("'" + id + "'")) {
      b.classList.add('active');
    }
  });
  
  const dropdown = document.getElementById('moreDropdown');
  if(dropdown && dropdown.classList.contains('show')) dropdown.classList.remove('show');

  if (id === 'entries') renderEntries();
  if (id === 'vocab') { renderVocab('All'); document.querySelectorAll('.tab')[0]?.classList.add('active'); }
  if (id === 'grammar') renderGrammar();
  if (id === 'speaking') renderSpeaking();
  if (id === 'reflection') renderReflections();
  if (id === 'quiz') quitQuiz();
}

function toggleDropdown(e) {
  e.stopPropagation();
  document.getElementById('moreDropdown').classList.toggle('show');
}

window.onclick = function(event) {
  if (!event.target.matches('.drop-btn') && !event.target.closest('.drop-btn')) {
    const dropdown = document.getElementById('moreDropdown');
    if (dropdown && dropdown.classList.contains('show')) {
      dropdown.classList.remove('show');
    }
  }
}'''

content = content.replace(old_js, new_js)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("Patched successfully!")
