// 실시간 제어 스크립트
const els = {
  fontSelect: document.getElementById('fontSelect'),
  fontSize: document.getElementById('fontSize'),
  fontSizeNumber: document.getElementById('fontSizeNumber'),
  letterSpacing: document.getElementById('letterSpacing'),
  letterNumber: document.getElementById('letterNumber'),
  lineHeight: document.getElementById('lineHeight'),
  lineNumber: document.getElementById('lineNumber'),
  fontColor: document.getElementById('fontColor'),
  editor: document.getElementById('editor'),
  hint: document.getElementById('hint'),
  alignLeft: document.getElementById('alignLeft'),
  alignCenter: document.getElementById('alignCenter'),
  alignRight: document.getElementById('alignRight')
};

function applyAll(){
  document.documentElement.style.setProperty('--editor-font', els.fontSelect.value);
  const size = els.fontSize.value + 'px';
  document.documentElement.style.setProperty('--editor-size', size);
  els.fontSizeNumber.value = els.fontSize.value;
  const letter = els.letterSpacing.value + 'px';
  if(els.letterNumber) els.letterNumber.value = els.letterSpacing.value;
  document.documentElement.style.setProperty('--editor-letter', letter);
  const line = els.lineHeight.value; // unitless em-like
  document.documentElement.style.setProperty('--editor-line', line);
  if(els.lineNumber) els.lineNumber.value = els.lineHeight.value;
  document.documentElement.style.setProperty('--editor-color', els.fontColor.value);
  // ensure editor size recalculates after style changes
  setTimeout(fillEditorBetween, 0);
}

// Fill editor height between header bottom and footer top
function fillEditorBetween(){
  const header = document.querySelector('.topbar');
  const footer = document.querySelector('.site-footer');
  if(!header || !footer || !els.editor) return;
  const headerBottom = header.getBoundingClientRect().bottom;
  const footerTop = footer.getBoundingClientRect().top;
  // leave small padding
  const available = Math.max(120, Math.floor(footerTop - headerBottom - 24));
  els.editor.style.height = available + 'px';
}

els.fontSelect.addEventListener('change', applyAll);
els.fontSize.addEventListener('input', applyAll);
els.fontSizeNumber.addEventListener('input', e=>{els.fontSize.value = e.target.value; applyAll();});
els.letterSpacing.addEventListener('input', applyAll);
if(els.letterNumber) els.letterNumber.addEventListener('input', e=>{ els.letterSpacing.value = e.target.value; applyAll(); });
els.lineHeight.addEventListener('input', applyAll);
if(els.lineNumber) els.lineNumber.addEventListener('input', e=>{ els.lineHeight.value = e.target.value; applyAll(); });
els.fontColor.addEventListener('input', applyAll);

// alignment
function setAlignment(align){
  els.editor.style.textAlign = align;
  [els.alignLeft, els.alignCenter, els.alignRight].forEach(b=>b.setAttribute('aria-pressed','false'));
  if(align === 'left') els.alignLeft.setAttribute('aria-pressed','true');
  if(align === 'center') els.alignCenter.setAttribute('aria-pressed','true');
  if(align === 'right') els.alignRight.setAttribute('aria-pressed','true');
}
els.alignLeft.addEventListener('click', ()=>setAlignment('left'));
els.alignCenter.addEventListener('click', ()=>setAlignment('center'));
els.alignRight.addEventListener('click', ()=>setAlignment('right'));

// 영어 입력만 허용: ASCII 32~126, 줄바꿈 허용
els.editor.addEventListener('input', (e)=>{
  const before = els.editor.value;
  const filtered = before.split('').filter(ch => {
    if (ch === '\n' || ch === '\r' || ch === '\t') return true;
    const code = ch.charCodeAt(0);
    return code >= 32 && code <= 126;
  }).join('');
  if(filtered !== before){
    const pos = els.editor.selectionStart - (before.length - filtered.length);
    els.editor.value = filtered;
    els.editor.selectionStart = els.editor.selectionEnd = Math.max(0,pos);
    showHint('영어(ASCII) 문자만 입력 가능합니다. 한/영 전환을 확인하세요.');
  } else {
    // no-op
  }
});

// paste: filter out non-ascii
els.editor.addEventListener('paste', (ev)=>{
  ev.preventDefault();
  const text = (ev.clipboardData || window.clipboardData).getData('text');
  const filtered = text.split('').filter(ch => {
    if (ch === '\n' || ch === '\r' || ch === '\t') return true;
    const code = ch.charCodeAt(0);
    return code >= 32 && code <= 126;
  }).join('');
  const start = els.editor.selectionStart;
  const end = els.editor.selectionEnd;
  const val = els.editor.value;
  els.editor.value = val.slice(0,start) + filtered + val.slice(end);
  els.editor.selectionStart = els.editor.selectionEnd = start + filtered.length;
  applyAll();
});

// inactivity auto-reload after 3 minutes (180000 ms)
let inactivityTimer = null;
const INACTIVITY_MS = 900000; // 15 minutes
function resetInactivity(){
  if(inactivityTimer) clearTimeout(inactivityTimer);
  inactivityTimer = setTimeout(()=>{ location.reload(); }, INACTIVITY_MS);
}
[ 'mousemove','mousedown','touchstart','keydown','scroll' ].forEach(ev => {
  window.addEventListener(ev, resetInactivity, {passive:true});
});
resetInactivity();

// resize editor to fill area between header and footer
window.addEventListener('resize', fillEditorBetween);
// call after content/input changes too
els.editor.addEventListener('input', ()=>{ fillEditorBetween(); });
// initialize size on load
setTimeout(fillEditorBetween,50);

let hintTimeout = null;
function showHint(msg){
  els.hint.textContent = msg;
  if(hintTimeout) clearTimeout(hintTimeout);
  hintTimeout = setTimeout(()=>{els.hint.textContent=''; hintTimeout = null}, 3500);
}

// 초깃값 적용
applyAll();
setAlignment('center');
