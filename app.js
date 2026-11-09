(()=>{
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const intro=$('.intro');
if(intro){if(reduced){intro.remove()}else{const ms=parseFloat(getComputedStyle(intro).getPropertyValue('--ms'))*1000||2600;const done=()=>{intro.remove();document.body.classList.remove('intro-on')};document.body.classList.add('intro-on');setTimeout(done,ms+80);intro.addEventListener('click',done);addEventListener('keydown',e=>{if(e.key==='Escape')done()},{once:true});setTimeout(()=>document.body.classList.remove('intro-on'),ms-500)}}
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
$$('.reveal').forEach(el=>reduced?el.classList.add('in'):io.observe(el));
$$('[data-menu]').forEach(b=>b.addEventListener('click',()=>{const t=$(b.dataset.menu);const o=t.classList.toggle('open');b.setAttribute('aria-expanded',o)}));
$$('[data-menu-close] a, a[data-close]').forEach(a=>a.addEventListener('click',()=>{$$('.open[data-panel]').forEach(p=>p.classList.remove('open'));$$('[data-menu]').forEach(b=>b.setAttribute('aria-expanded',false))}));
const spy=$$('a[data-spy]');if(spy.length){const map=new Map(spy.map(a=>[a.getAttribute('href').slice(1),a]));const so=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){spy.forEach(a=>a.classList.remove('on'));const a=map.get(e.target.id);a&&a.classList.add('on')}}),{rootMargin:'-45% 0px -50% 0px'});map.forEach((a,id)=>{const el=document.getElementById(id);el&&so.observe(el)})}
const form=$('#quote-form');
if(form){
 const pickEl=$('.pick',form);
 const setJob=j=>{const s=form.elements.job;let ok=false;[...s.options].forEach(o=>{if(o.value===j||o.text===j){s.value=o.value;ok=true}});if(!ok){const o=new Option(j,j);s.add(o);s.value=j}};
 $$('[data-job]').forEach(b=>b.addEventListener('click',e=>{if(b.tagName==='A')e.preventDefault();setJob(b.dataset.job);$$('[data-job]').forEach(x=>x.classList.remove('added'));b.classList.add('added');const sb=$('#status');if(sb)sb.textContent='Added: '+b.dataset.job;$('#quote').scrollIntoView({behavior:reduced?'auto':'smooth'})}));
 document.addEventListener('pick',e=>{form.elements.extra.value=e.detail||'';pickEl&&(pickEl.textContent=e.detail?e.detail:'')});
 form.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity())return;const d=new FormData(form),o=form.dataset.owner,extra=d.get('extra');
  const text=`Hi ${o}, I'm ${d.get('name')}. I'm in ${d.get('area')}.\nJob: ${d.get('job')}\n${extra?extra+'\n':''}${d.get('details')}\nCould you give me a quote? Thank you.`;
  const url='https://wa.me/'+form.dataset.wa+'?text='+encodeURIComponent(text);
  const w=window.open(url,'_blank','noopener');$('#status').textContent='Your message is ready in WhatsApp. Check it and press Send there. Nothing has been sent yet.';form.dataset.lastUrl=url;});
}
})();