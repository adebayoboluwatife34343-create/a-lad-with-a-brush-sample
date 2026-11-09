
export function build(THREE,ctx){
 const {scene,camera,state:st}=ctx;
 camera.position.set(.6,-.2,21);camera.lookAt(.6,-.2,0);
 scene.add(new THREE.HemisphereLight(0xfff0d0,0x5a3a20,1.8));const key=new THREE.DirectionalLight(0xffffff,3);key.position.set(4,6,8);scene.add(key);const rim=new THREE.DirectionalLight(0xffc060,1.5);rim.position.set(-6,-2,-3);scene.add(rim);
 const root=new THREE.Group();root.scale.setScalar(1.3);scene.add(root);
 const cols=[['Oxblood',0x7a1f22],['Ochre',0xd9941c],['Forest',0x2f4a38],['Terracotta',0xb4553a],['Plum',0x5a2a3c]];let ci=0;
 const paint=new THREE.MeshStandardMaterial({color:cols[0][1],roughness:.35,metalness:0});
 const brush=new THREE.Group();root.add(brush);
 const hp=[[0,0],[.28,.1],[.3,.6],[.22,1.8],[.26,3.0],[.28,3.2],[.18,3.35],[0,3.4]].map(p=>new THREE.Vector2(p[0]*.95,p[1]));
 const handle=new THREE.Mesh(new THREE.LatheGeometry(hp,32),new THREE.MeshStandardMaterial({color:0xc9a064,roughness:.55}));handle.position.y=.2;brush.add(handle);
 const dip=new THREE.Mesh(new THREE.CylinderGeometry(.285,.285,.7,32),paint);dip.position.y=3.3;brush.add(dip);
 const fer=new THREE.Mesh(new THREE.BoxGeometry(1.15,.9,.42),new THREE.MeshStandardMaterial({color:0xc4c8cc,metalness:.9,roughness:.28}));fer.position.y=.2;brush.add(fer);
 for(const y of[.05,.35]){const b=new THREE.Mesh(new THREE.BoxGeometry(1.17,.04,.44),new THREE.MeshStandardMaterial({color:0x90959a,metalness:.9,roughness:.4}));b.position.y=y;brush.add(b)}
 function bris(h,wid,mat){const g=new THREE.BoxGeometry(wid,h,.34,6,6,2);const p=g.attributes.position;for(let i=0;i<p.count;i++){const y=p.getY(i);const t=Math.max(0,(-y+h/2)/h);p.setX(i,p.getX(i)*(1-t*.1));p.setZ(i,p.getZ(i)*(1-t*.45));p.setY(i,y)}g.computeVertexNormals();return new THREE.Mesh(g,mat)}
 const bm=bris(1.35,1.08,new THREE.MeshStandardMaterial({color:0xe6d9b5,roughness:.9}));bm.position.y=-.92;brush.add(bm);
 const tip=bris(.62,1.1,paint);tip.position.y=-1.28;tip.scale.set(1.03,1,1.12);brush.add(tip);
 // paint pot
 const pot=new THREE.Group();root.add(pot);pot.position.set(2.8,-3.4,0);
 const can=new THREE.Mesh(new THREE.CylinderGeometry(1.15,1.05,1.5,40,1,true),new THREE.MeshStandardMaterial({color:0xb8bcc0,metalness:.8,roughness:.4,side:THREE.DoubleSide}));pot.add(can);
 const bot=new THREE.Mesh(new THREE.CircleGeometry(1.05,32),new THREE.MeshStandardMaterial({color:0x888c90,metalness:.8}));bot.rotation.x=-Math.PI/2;bot.position.y=-.75;pot.add(bot);
 const surf=new THREE.Mesh(new THREE.CircleGeometry(1.1,40),paint);surf.rotation.x=-Math.PI/2;surf.position.y=.45;pot.add(surf);
 const prim=new THREE.Mesh(new THREE.TorusGeometry(1.15,.05,8,40),new THREE.MeshStandardMaterial({color:0xd0d3d6,metalness:.9,roughness:.3}));prim.rotation.x=Math.PI/2;prim.position.y=.75;pot.add(prim);
 const wire=new THREE.Mesh(new THREE.TorusGeometry(1.2,.025,6,30,Math.PI),new THREE.MeshStandardMaterial({color:0x666a70,metalness:.9}));wire.position.y=.75;pot.add(wire);
 // drip
 const drip=new THREE.Mesh(new THREE.SphereGeometry(.16,16,12),paint);drip.scale.set(1,1.4,1);drip.visible=false;root.add(drip);
 let swing=.5,swingT=.5,dipT=-1,dripT=-1;const ease=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
 const sl=document.querySelector('#val');if(sl)sl.addEventListener('input',()=>{swingT=parseFloat(sl.value)});
 function nextCol(){ci=(ci+1)%cols.length;paint.color.setHex(cols[ci][1]);document.dispatchEvent(new CustomEvent('pick',{detail:'Paint colour idea: '+cols[ci][0]+' (from the sample brush)'}))}
 let swapped=false;
 return{onAction(){if(dipT<0){dipT=0;swapped=false;dripT=-1;drip.visible=false}},onReset(){swingT=.5;ci=cols.length-1;nextCol()},
  update(dt,s){swing+=(swingT-swing)*Math.min(1,dt*6);
   let bx=-1.2,by=.9,rz=(swing-.5)*1.4+.12+(s.reduced?0:Math.sin(s.t*1.1)*.03);
   if(dipT>=0){dipT+=dt/(s.reduced?1.2:2.6);const t=dipT;
    if(t<.3){const k=ease(t/.3);bx=-1.2+k*4.0;by=.6+k*2.3;rz=(1-k)*rz+k*.15}
    else if(t<.52){const k=ease((t-.3)/.22);bx=2.8;by=2.9-k*3.5;rz=.15}
    else if(t<.7){bx=2.8;by=-.6;rz=.15;if(!swapped&&t>.6){swapped=true;nextCol()}}
    else if(t<1){const k=ease((t-.7)/.3);bx=2.8-k*4.0;by=-.6+k*1.2;rz=.15*(1-k)+rz*k}
    else{dipT=-1;dripT=0;drip.visible=true}}
   brush.position.set(bx,by,0);brush.rotation.z=rz;brush.rotation.x=s.py*.12;
   if(dripT>=0){dripT+=dt/1.6;const tp=brush.localToWorld(new THREE.Vector3(0,-1.6,0));const f=Math.min(1,dripT);const grow=Math.min(1,dripT*2);drip.position.set(tp.x+Math.sin(rz)*0,tp.y-Math.max(0,(dripT-.5))*(dripT-.5)*7,0);drip.scale.set(grow,grow*1.5,grow);if(dripT>1.5){dripT=-1;drip.visible=false}}
   root.rotation.y=s.px*.25+s.dragY*.5+(s.sp-.5)*.5;root.rotation.x=s.dragX*.3;}}
}
