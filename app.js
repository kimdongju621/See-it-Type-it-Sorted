// 실시간 제어 스크립트
const els = {
  fontSelect: document.getElementById('fontSelect'),
  fontSize: document.getElementById('fontSize'),
  fontSizeNumber: document.getElementById('fontSizeNumber'),
  letterSpacing: document.getElementById('letterSpacing'),
  letterVal: document.getElementById('letterVal'),
  lineHeight: document.getElementById('lineHeight'),
  lineVal: document.getElementById('lineVal'),
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
  document.documentElement.style.setProperty('--editor-letter', letter);
  els.letterVal.textContent = letter;
  const line = els.lineHeight.value; // unitless em-like
  document.documentElement.style.setProperty('--editor-line', line);
  els.lineVal.textContent = line;
  document.documentElement.style.setProperty('--editor-color', els.fontColor.value);
}

els.fontSelect.addEventListener('change', applyAll);
els.fontSize.addEventListener('input', applyAll);
els.fontSizeNumber.addEventListener('input', e=>{els.fontSize.value = e.target.value; applyAll();});
els.letterSpacing.addEventListener('input', applyAll);
els.lineHeight.addEventListener('input', applyAll);
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

let hintTimeout = null;
function showHint(msg){
  els.hint.textContent = msg;
  if(hintTimeout) clearTimeout(hintTimeout);
  hintTimeout = setTimeout(()=>{els.hint.textContent=''; hintTimeout = null}, 3500);
}

// 초깃값 적용
applyAll();
setAlignment('left');
