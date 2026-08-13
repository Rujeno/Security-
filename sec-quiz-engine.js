(()=>{
const cfg=window.SEC_QUIZ_MODE||{type:'all'};
const lesson=cfg.type==='lesson'?Number(cfg.lesson):null;
const pool=(cfg.type==='lesson'?SEC_QUESTIONS.filter(x=>x.l===lesson):SEC_QUESTIONS.slice());
const questions=pool.slice();
const state={i:0,score:0,answered:false,answers:[]};
const $=id=>document.getElementById(id);
const title=cfg.type==='lesson'?`اختبار الدرس ${lesson} — ${SEC_LESSONS[lesson].ar}`:'الاختبار الشامل — جميع الدروس 1–16';
const subtitle=cfg.type==='lesson'?`${SEC_LESSONS[lesson].en} · أسئلة هذا الدرس فقط`:'Comprehensive Security+ Practice Exam · يجمع بنك الأسئلة من جميع الدروس';

document.title=`${title} | CompTIA Security+ SY0-701`;
document.body.innerHTML=`
<div class="top"><div class="topin" id="topnav"></div></div>
<header><div class="eyebrow">COMPTIA SECURITY+ SY0-701</div><h1>${title}</h1><p>${subtitle}</p></header>
<main class="wrap">
<section class="coverage"><h3>تغطية الاختبار</h3><div class="chips" id="chips"></div></section>
<section id="quiz">
<div class="examrow"><span id="counter"></span><span id="liveScore"></span></div>
<div class="bar"><i id="progress"></i></div>
<div class="qbox">
<span class="qtag" id="qtag"></span><div class="qtext" id="qtext"></div><div class="opts" id="opts"></div><div class="feedback" id="feedback"></div>
<div class="actions"><a class="btn secondary" href="sec-quiz.html">← قائمة الاختبارات</a><button class="btn primary" id="nextBtn" disabled>السؤال التالي ←</button></div>
</div></section>
<section id="result"><div class="score" id="score"></div><h2 id="resultTitle"></h2><p id="resultText"></p><div class="resultActions"><button class="btn primary" id="restartBtn">إعادة الاختبار</button><a class="btn secondary" href="sec-quiz.html">قائمة الاختبارات</a></div><div class="review" id="review"></div></section>
</main><footer>Lujain Alshamrani · CompTIA Security+ SY0-701 Study Site ©</footer>`;

function buildNav(){const nav=$('topnav');nav.innerHTML=`<a href="sec-index.html">🏠</a><a href="sec-quiz.html">الاختبارات</a>${Array.from({length:16},(_,i)=>i+1).map(n=>`<a class="${lesson===n?'active':''}" href="sec-quiz-lesson${n}.html">${n}</a>`).join('')}<a class="${cfg.type==='all'?'active':''}" href="sec-quiz-all.html">الشامل</a>`;}
function coverage(){const sections=[...new Set(questions.map(q=>cfg.type==='all'?`L${q.l} · ${q.s}`:q.s))];$('chips').innerHTML=sections.map(s=>`<span class="chip">${s}</span>`).join('');}
function render(){if(!questions.length){$('quiz').innerHTML='<div class="coverage">لا توجد أسئلة لهذا الاختبار حاليًا.</div>';return;}state.answered=false;const q=questions[state.i];$('counter').textContent=`السؤال ${state.i+1} من ${questions.length}`;$('liveScore').textContent=`النتيجة: ${state.score}`;$('progress').style.width=`${(state.i/questions.length)*100}%`;$('qtag').textContent=`L${q.l} · ${q.s}`;$('qtext').textContent=q.q;$('feedback').className='feedback';$('feedback').innerHTML='';$('nextBtn').disabled=true;$('nextBtn').textContent=state.i===questions.length-1?'عرض النتيجة ←':'السؤال التالي ←';$('opts').innerHTML='';q.o.forEach((opt,idx)=>{const b=document.createElement('button');b.className='opt';b.textContent=opt;b.onclick=()=>answer(idx,b);$('opts').appendChild(b);});}
function answer(idx,btn){if(state.answered)return;state.answered=true;const q=questions[state.i];const ok=idx===q.a;if(ok)state.score++;state.answers.push({q,chosen:idx,ok});[...$('opts').children].forEach((b,i)=>{b.disabled=true;if(i===q.a)b.classList.add('correct');else if(i===idx)b.classList.add('wrong');});$('feedback').innerHTML=(ok?'<b>إجابة صحيحة.</b> ':'<b>الإجابة غير صحيحة.</b> ')+q.e;$('feedback').classList.add('show');$('liveScore').textContent=`النتيجة: ${state.score}`;$('nextBtn').disabled=false;}
function next(){if(!state.answered)return;if(state.i<questions.length-1){state.i++;render();window.scrollTo({top:0,behavior:'smooth'});}else showResult();}
function showResult(){$('quiz').style.display='none';$('result').style.display='block';const pct=Math.round((state.score/questions.length)*100);$('score').textContent=`${state.score}/${questions.length}`;$('resultTitle').textContent=pct>=80?'ممتاز — اجتزتِ هذا الاختبار':pct>=60?'جيد — يحتاج مراجعة بسيطة':'راجعي الأقسام التي ظهرت فيها الأخطاء';$('resultText').textContent=`النسبة: ${pct}%`;$('review').innerHTML='<h3>مراجعة الإجابات</h3>'+state.answers.map((a,i)=>`<div class="rv ${a.ok?'hit':'miss'}"><b>${i+1}. ${a.ok?'صحيحة':'تحتاج مراجعة'}</b><div class="rvq">${a.q.q}</div><div class="rva">الإجابة الصحيحة: ${a.q.o[a.q.a]}</div></div>`).join('');window.scrollTo({top:0,behavior:'smooth'});}
function restart(){state.i=0;state.score=0;state.answered=false;state.answers=[];$('result').style.display='none';$('quiz').style.display='block';render();}
buildNav();coverage();render();$('nextBtn').onclick=next;$('restartBtn').onclick=restart;
})();
