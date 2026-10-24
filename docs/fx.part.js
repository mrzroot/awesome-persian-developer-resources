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
