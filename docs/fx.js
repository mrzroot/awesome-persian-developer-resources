/* shared helpers for the per-project identity scripts (no dependencies) */
(function(){'use strict';
var d=document,R=d.documentElement;
var FX=window.FX={
 reduce:!!(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches),
 $:function(s,c){return(c||d).querySelector(s)},
 $$:function(s,c){return Array.prototype.slice.call((c||d).querySelectorAll(s))},
 mouse:{x:-1e3,y:-1e3,px:.5,py:.5},
 /* add .rv and reveal on scroll */
 reveal:function(sel,cls){cls=cls||'in';var els=FX.$$(sel);els.forEach(function(e){e.classList.add('rv')});
  if(FX.reduce||!('IntersectionObserver' in window)){els.forEach(function(e){e.classList.add(cls)});return}
  var io=new IntersectionObserver(function(es){es.forEach(function(x){if(x.isIntersecting){x.target.classList.add(cls);io.unobserve(x.target)}})},{rootMargin:'0px 0px -6% 0px'});els.forEach(function(e,i){e.style.setProperty('--i',i%6);io.observe(e)})},
 /* canvas loop: sizes to its box, pauses offscreen / hidden tab; draw(ctx,w,h,t,dt,m) with m = mouse in canvas px */
 loop:function(cv,draw,o){o=o||{};var ctx=cv.getContext('2d'),w=0,h=0,dpr=1,raf=0,on=false,vis=true,last=0,t0=performance.now(),m={x:-1e3,y:-1e3,in:false};
  function size(){var r=cv.getBoundingClientRect();w=r.width;h=r.height;dpr=Math.min(o.dpr||2,window.devicePixelRatio||1);cv.width=Math.max(1,Math.round(w*dpr));cv.height=Math.max(1,Math.round(h*dpr));ctx.setTransform(dpr,0,0,dpr,0,0);if(o.resize)o.resize(w,h)}
  function fr(now){if(!on)return;var t=(now-t0)/1000,dt=Math.min(.05,(now-last)/1000||.016);last=now;ctx.setTransform(dpr,0,0,dpr,0,0);draw(ctx,w,h,t,dt,m);raf=requestAnimationFrame(fr)}
  function go(){if(on||FX.reduce||d.hidden||!vis)return;on=true;last=performance.now();raf=requestAnimationFrame(fr)}
  function stop(){on=false;cancelAnimationFrame(raf)}
  size();addEventListener('resize',function(){size();if(!on){ctx.setTransform(dpr,0,0,dpr,0,0);draw(ctx,w,h,0,0,m)}});
  var host=o.host||cv.parentElement;host.addEventListener('pointermove',function(e){var r=cv.getBoundingClientRect();m.x=e.clientX-r.left;m.y=e.clientY-r.top;m.in=true},{passive:true});host.addEventListener('pointerleave',function(){m.in=false;m.x=m.y=-1e3});
  if(FX.reduce){draw(ctx,w,h,o.still||2,0,m)}else{
   if('IntersectionObserver' in window)new IntersectionObserver(function(es){vis=es[0].isIntersecting;vis?go():stop()},{threshold:0}).observe(cv);else go();
   d.addEventListener('visibilitychange',function(){d.hidden?stop():go()});draw(ctx,w,h,0,0,m)}
  return{size:size,draw:function(){draw(ctx,w,h,(performance.now()-t0)/1000,0,m)},ctx:ctx};},
 /* create an absolutely positioned canvas as the first child of host */
 layer:function(host,cls){var cv=d.createElement('canvas');cv.className='fx '+(cls||'');cv.setAttribute('aria-hidden','true');cv.setAttribute('role','presentation');if(getComputedStyle(host).position==='static')host.style.position='relative';host.insertBefore(cv,host.firstChild);return cv},
 css:function(n){return getComputedStyle(R).getPropertyValue(n).trim()},
 rnd:function(a,b){return a+Math.random()*(b-a)},
 theme:function(){return R.getAttribute('data-theme')==='dark'?'dark':'light'}
};
addEventListener('pointermove',function(e){FX.mouse.x=e.clientX;FX.mouse.y=e.clientY;FX.mouse.px=e.clientX/innerWidth;FX.mouse.py=e.clientY/innerHeight},{passive:true});
R.classList.add('fxjs');
})();

(function(){var hero=FX.$('.hero');if(!hero)return;var cv=FX.layer(hero),C=[],par={x:0,y:0};
function mk(w,h,top){return{x:Math.random()*w,y:top?-90:Math.random()*h,w:FX.rnd(70,130),r:FX.rnd(-.5,.5),vr:FX.rnd(-.06,.06),vy:FX.rnd(8,22),z:FX.rnd(.4,1)}}
FX.loop(cv,function(c,w,h,t,dt,m){c.clearRect(0,0,w,h);par.x+=((m.in?(m.x/w-.5):0)-par.x)*.05;par.y+=((m.in?(m.y/h-.5):0)-par.y)*.05;var dark=FX.theme()==='dark',ln=dark?'255,160,200':'196,24,92',bg=dark?'255,255,255':'255,255,255';
 for(var i=0;i<C.length;i++){var k=C[i];k.y+=k.vy*k.z*dt;k.r+=k.vr*dt;if(k.y>h+100){C[i]=mk(w,h,true);continue}
  var x=k.x+par.x*60*k.z,y=k.y+par.y*40*k.z,cw=k.w,ch=cw*.62;c.save();c.translate(x,y);c.rotate(k.r);c.globalAlpha=.05+.13*k.z;
  c.fillStyle='rgba('+bg+',.55)';c.strokeStyle='rgba('+ln+',.9)';c.lineWidth=1;c.beginPath();c.rect(-cw/2,-ch/2,cw,ch);if(!dark)c.fill();c.stroke();
  c.strokeStyle='rgba('+ln+',.9)';c.beginPath();c.moveTo(-cw/2,-ch/2+ch*.2);c.lineTo(cw/2,-ch/2+ch*.2);c.stroke();
  c.globalAlpha*=.55;c.strokeStyle='rgba(90,143,224,.9)';for(var j=0;j<4;j++){var yy=-ch/2+ch*(.38+j*.15);c.beginPath();c.moveTo(-cw/2+6,yy);c.lineTo(cw/2-6,yy);c.stroke()}c.restore()}
},{resize:function(w,h){C.length=0;var n=w<600?7:15;for(var i=0;i<n;i++)C.push(mk(w,h,false))}});
FX.$$('.card').forEach(function(e){e.style.setProperty('--r',(Math.random()*1.4-.7).toFixed(2)+'deg')});
})();
