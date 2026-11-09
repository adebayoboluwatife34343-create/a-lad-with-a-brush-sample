import * as THREE from './three.module.js';
import {build} from './scene.js';
const host=document.querySelector('#stage');
if(host){try{
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'default'});
renderer.setPixelRatio(Math.min(devicePixelRatio,1.75));host.appendChild(renderer.domElement);
const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(32,1,.1,200);
const st={p:0,sp:0,px:0,py:0,tx:0,ty:0,dragX:0,dragY:0,v:0,reduced,t:0,vis:true};
const pin=host.closest('[data-pin]');
const ctx={scene,camera,renderer,host,state:st,THREE};
const api=build(THREE,ctx)||{};
const slider=document.querySelector('#val'),out=document.querySelector('#val-out'),act=document.querySelector('#act'),rst=document.querySelector('#reset');
if(slider){const f=()=>{st.v=parseFloat(slider.value);api.onValue&&api.onValue(st.v);if(out)out.textContent=(out.dataset.fmt==='deg'?Math.round(st.v*100)+'%':Math.round(st.v*100)+'%')};slider.addEventListener('input',f);st.v=parseFloat(slider.value);api.onValue&&api.onValue(st.v);if(out)out.textContent=Math.round(st.v*100)+'%'}
act&&act.addEventListener('click',()=>api.onAction&&api.onAction());
rst&&rst.addEventListener('click',()=>{if(slider){slider.value=slider.defaultValue;slider.dispatchEvent(new Event('input'))}api.onReset&&api.onReset()});
let drag=false,lx=0,ly=0;
if(!ctx.noDrag){host.addEventListener('pointerdown',e=>{drag=true;lx=e.clientX;ly=e.clientY;host.setPointerCapture(e.pointerId)});
host.addEventListener('pointermove',e=>{if(drag&&!reduced){st.dragY+=(e.clientX-lx)*.008;st.dragX+=(e.clientY-ly)*.004;st.dragX=Math.max(-.5,Math.min(.5,st.dragX));lx=e.clientX;ly=e.clientY}});
host.addEventListener('pointerup',()=>drag=false);host.addEventListener('pointercancel',()=>drag=false);}
host.addEventListener('pointermove',e=>{const r=host.getBoundingClientRect();st.tx=((e.clientX-r.left)/r.width-.5)*2;st.ty=((e.clientY-r.top)/r.height-.5)*2});
host.addEventListener('pointerleave',()=>{st.tx=0;st.ty=0});
host.addEventListener('keydown',e=>{const k={ArrowLeft:-.2,ArrowRight:.2}[e.key];if(k){st.dragY+=k;e.preventDefault()}});
function size(){const w=host.clientWidth||300,h=host.clientHeight||300;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();api.onResize&&api.onResize(w,h)}
new ResizeObserver(size).observe(host);size();
new IntersectionObserver(x=>st.vis=x[0].isIntersecting,{rootMargin:'100px'}).observe(host);
let last=performance.now();
function frame(now){requestAnimationFrame(frame);if(!st.vis)return;const dt=Math.min(.05,(now-last)/1000);last=now;st.t+=dt;
 const r=(pin||host).getBoundingClientRect();
 if(pin){st.p=Math.max(0,Math.min(1,-r.top/Math.max(1,r.height-innerHeight)))}else{st.p=Math.max(0,Math.min(1,1-(r.top+r.height/2)/innerHeight))}
 if(reduced){st.sp=st.p;st.px=st.py=0}else{st.sp+=(st.p-st.sp)*Math.min(1,dt*6);st.px+=(st.tx-st.px)*Math.min(1,dt*5);st.py+=(st.ty-st.py)*Math.min(1,dt*5)}
 api.update&&api.update(dt,st);renderer.render(scene,camera)}
requestAnimationFrame(frame);
}catch(err){console.warn('WebGL unavailable',err);host.classList.add('nogl');host.textContent=host.dataset.fallback||'Interactive 3D needs WebGL.'}}
