(() => {
'use strict';
const canvas=document.getElementById('game'),ctx=canvas.getContext('2d');
const W=768,H=432,T=24,worldW=6000;
const ui={score:document.getElementById('score'),coins:document.getElementById('coins'),lives:document.getElementById('lives'),time:document.getElementById('time'),overlay:document.getElementById('overlay'),title:document.getElementById('overlay-title'),message:document.getElementById('overlay-text'),start:document.getElementById('start'),status:document.getElementById('status')};
const keys={left:false,right:false,jump:false,run:false};let state='ready',score=0,coins=0,lives=3,seconds=400,last=0,tick=0,camera=0,finishTimer=0;
const floorY=360;
const solids=[],bricks=[],question=[],pipes=[],gaps=[[1850,1990],[3150,3310],[4420,4570],[5200,5350]];
const enemies=[],coinItems=[];
function rect(x,y,w,h,type='ground'){solids.push({x,y,w,h,type});}
function block(x,y,type='brick'){(type==='question'?question:bricks).push({x,y,w:24,h:24,used:false,type});rect(x,y,24,24,'block');}
function pipe(x,h){pipes.push({x,y:floorY-h,w:48,h});rect(x,floorY-h,48,h,'pipe');}
function inGap(x){return gaps.some(g=>x>=g[0]&&x<g[1]);}
for(let x=0;x<worldW;x+=24)if(!inGap(x+12))rect(x,floorY,24,72,'ground');
pipe(720,48);pipe(960,72);pipe(1200,72);pipe(1560,48);pipe(2328,48);pipe(2376,72);pipe(2424,72);pipe(2472,72);pipe(2880,48);pipe(3744,48);pipe(3792,72);pipe(3840,72);pipe(4080,48);pipe(4800,72);
[[336,264],[360,264],[384,264],[408,264],[432,264],[864,216],[888,216],[912,216],[936,216],[1080,264],[1104,264],[1128,264],[1320,216],[1344,216],[1368,216],[1392,216],[1656,264],[1680,264],[1704,264],[1728,264],[2040,264],[2064,264],[2088,264],[2112,264],[2640,216],[2664,216],[2688,216],[2712,216],[2760,264],[2784,264],[2808,264],[2832,264],[3408,264],[3432,264],[3456,264],[3480,264],[3912,216],[3936,216],[3960,216],[3984,216],[4632,264],[4656,264],[4680,264],[4704,264]].forEach(([x,y])=>block(x,y));
[[384,264],[864,216],[888,216],[1320,216],[1680,264],[2064,264],[2664,216],[2784,264],[3432,264],[3936,216],[4656,264]].forEach(([x,y])=>block(x,y,'question'));
function enemy(x){enemies.push({x,y:floorY-24,w:24,h:24,vx:-.65,alive:true});}
[520,1040,1450,1780,2200,2570,2960,3540,4020,4350,4880].forEach(enemy);
function coin(x,y){coinItems.push({x,y,alive:true,phase:Math.random()*6});}
[[312,288],[600,288],[888,168],[912,168],[1104,216],[1368,168],[1704,216],[2088,216],[2688,168],[2808,216],[3456,216],[3960,168],[4680,216]].forEach(([x,y])=>coin(x,y));
const player={x:72,y:floorY-30,w:18,h:30,vx:0,vy:0,onGround:false,big:false,dead:false,invuln:0,face:1};
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function hit(a,b){return a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;}
function resetPlayer(){Object.assign(player,{x:72,y:floorY-30,w:18,h:30,vx:0,vy:0,onGround:false,dead:false,invuln:90});camera=0;}
function start(){state='playing';score=0;coins=0;seconds=400;camera=0;finishTimer=0;enemies.forEach(e=>{e.alive=true;e.x=e.x0??e.x;});coinItems.forEach(c=>c.alive=true);question.forEach(q=>q.used=false);resetPlayer();ui.overlay.classList.add('hidden');ui.status.textContent='ИГРА ИДЁТ';updateUI();}
ui.start.addEventListener('click',()=>{if(state==='ready'||state==='over'||state==='won')start();});
function updateUI(){ui.score.textContent=String(score).padStart(6,'0');ui.coins.textContent='× '+String(coins).padStart(2,'0');ui.lives.textContent='× 0'+lives;ui.time.textContent=Math.max(0,Math.ceil(seconds));}
function die(){if(player.invuln>0||state!=='playing')return;lives--;updateUI();if(lives<=0){end(false);return;}player.dead=true;setTimeout(()=>{if(state!=='playing')return;resetPlayer();},650);}
function end(win){state=win?'won':'over';ui.overlay.classList.remove('hidden');ui.title.textContent=win?'УРОВЕНЬ ПРОЙДЕН!':'ИГРА ОКОНЧЕНА';ui.message.textContent=win?'ТЫ ДОБРАЛСЯ ДО ЗАМКА. ОТЛИЧНАЯ РАБОТА!':'ПОПРОБУЙ ЕЩЁ РАЗ И ПРОЙДИ WORLD 1-1';ui.start.textContent='ИГРАТЬ СНОВА';ui.status.textContent=win?'ПОБЕДА':'ИГРА ОКОНЧЕНА';}
function moveAxis(obj,dx,dy){obj.x+=dx;for(const s of solids){if(!hit(obj,s))continue;if(dx>0)obj.x=s.x-obj.w;else if(dx<0)obj.x=s.x+s.w;}obj.y+=dy;obj.onGround=false;for(const s of solids){if(!hit(obj,s))continue;if(dy>0){obj.y=s.y-obj.h;obj.vy=0;obj.onGround=true;}else if(dy<0){if(s.type==='block'){const q=question.find(v=>v.x===s.x&&v.y===s.y);if(q&&!q.used){q.used=true;score+=200;coins++;} }obj.y=s.y+s.h;obj.vy=0;}}}
function update(dt){if(state!=='playing')return;tick+=dt;seconds-=dt/60;if(seconds<=0){seconds=0;die();}if(player.dead)return;if(player.invuln>0)player.invuln-=dt;
const p=player,acc=keys.run?.55:.38,max=keys.run?4.1:2.8;
if(keys.left){p.vx-=acc*dt;p.face=-1;}if(keys.right){p.vx+=acc*dt;p.face=1;}if(!keys.left&&!keys.right)p.vx*=Math.pow(.78,dt);
p.vx=clamp(p.vx,-max,max);if(keys.jump&&p.onGround){p.vy=-8.8;p.onGround=false;}p.vy=Math.min(9,p.vy+.42*dt);
const oldY=p.y;moveAxis(p,p.vx*dt,p.vy*dt);
if(p.y>H+50){die();return;}
for(const q of question){if(!q.used&&p.vy<0&&p.x+p.w>q.x&&p.x<q.x+q.w&&oldY>=q.y+q.h&&p.y<=q.y+q.h){q.used=true;score+=200;coins++;}}
for(const b of bricks){if(p.vy<0&&p.x+p.w>b.x&&p.x<b.x+b.w&&oldY>=b.y+b.h&&p.y<=b.y+b.h){p.vy=0;p.y=b.y+b.h;}}
for(const c of coinItems)if(c.alive&&hit(p,{x:c.x,y:c.y+Math.sin(tick/8+c.phase)*3,w:15,h:19})){c.alive=false;coins++;score+=200;}
for(const e of enemies){if(!e.alive)continue;e.x+=e.vx*dt;const blocked=solids.some(s=>hit({x:e.x+(e.vx<0?-1:e.w),y:e.y+3,w:2,h:e.h-3},s));if(blocked||inGap(e.x+e.w/2)){e.vx*=-1;e.x+=e.vx*dt*2;}if(hit(p,e)){if(p.vy>1&&oldY+p.h<=e.y+10){e.alive=false;p.vy=-6;score+=100;}else if(p.invuln<=0){die();return;}}}
if(p.x>worldW-230){score+=Math.max(0,Math.round((floorY-p.y)*10));updateUI();end(true);return;}
camera=clamp(p.x-W*.38,0,worldW-W);updateUI();}
function drawSky(){ctx.fillStyle='#70c5ce';ctx.fillRect(0,0,W,H);ctx.fillStyle='#b7e8e4';for(let i=0;i<7;i++){const x=((i*190-camera*.28)%(W+100)+W+100)%(W+100)-50;cloud(x,72+(i%3)*30);}ctx.fillStyle='#62b95d';for(let i=0;i<9;i++){const x=((i*155-camera*.48)%(W+140)+W+140)%(W+140)-70;hill(x,360,95+(i%3)*15,70+(i%2)*18);} }
function cloud(x,y){ctx.fillStyle='#e8f6dc';ctx.fillRect(x+12,y,36,12);ctx.fillRect(x,y+12,60,12);ctx.fillRect(x+12,y+24,36,8);}
function hill(x,y,w,h){ctx.fillStyle='#3eaa55';ctx.beginPath();ctx.moveTo(x-w/2,y);ctx.lineTo(x,y-h);ctx.lineTo(x+w/2,y);ctx.fill();ctx.fillStyle='#c8ed9b';ctx.fillRect(x-8,y-h+20,10,8);}
function drawGround(){for(const s of solids){const x=Math.floor(s.x-camera);if(x>W||x+s.w<0)continue;if(s.type==='ground'){ctx.fillStyle='#b85b26';ctx.fillRect(x,s.y,s.w,s.h);ctx.fillStyle='#6ac34a';ctx.fillRect(x,s.y,s.w,8);ctx.fillStyle='#7c351d';ctx.fillRect(x,s.y+12,s.w,s.h-12);ctx.strokeStyle='#d58a43';ctx.strokeRect(x+.5,s.y+10,s.w-1,12);}else if(s.type==='pipe'){ctx.fillStyle='#087b25';ctx.fillRect(x,s.y,s.w,s.h);ctx.fillStyle='#18b83d';ctx.fillRect(x+5,s.y+4,9,s.h-4);ctx.fillStyle='#07551c';ctx.fillRect(x+s.w-8,s.y+4,8,s.h-4);ctx.fillStyle='#14a936';ctx.fillRect(x-4,s.y, s.w+8,12);ctx.strokeStyle='#064b1a';ctx.strokeRect(x-3.5,s.y+.5,s.w+7,11);}}}
function drawBlocks(){for(const b of bricks){const x=b.x-camera;if(x<-24||x>W)continue;ctx.fillStyle='#b85b24';ctx.fillRect(x,b.y,24,24);ctx.fillStyle='#ef9b45';ctx.fillRect(x+2,b.y+2,20,3);ctx.strokeStyle='#71331e';ctx.strokeRect(x+.5,b.y+.5,23,23);ctx.fillStyle='#71331e';ctx.fillRect(x+10,b.y+10,4,4);}for(const q of question){const x=q.x-camera;if(x<-24||x>W)continue;ctx.fillStyle=q.used?'#9b6534':'#f5ad32';ctx.fillRect(x,q.y,24,24);ctx.strokeStyle='#85431e';ctx.strokeRect(x+.5,q.y+.5,23,23);ctx.fillStyle='#fff0a2';ctx.font='bold 19px monospace';ctx.fillText(q.used?'·':'?',x+6,q.y+19);}}
function drawCoins(){for(const c of coinItems){if(!c.alive)continue;const x=c.x-camera;if(x<-20||x>W)continue;ctx.fillStyle='#ffe45c';ctx.fillRect(x+5,c.y+Math.sin(tick/8+c.phase)*3,6,17);ctx.fillStyle='#fff6b0';ctx.fillRect(x+6,c.y+3+Math.sin(tick/8+c.phase)*3,2,9);}}
function drawEnemy(e){const x=Math.round(e.x-camera),y=Math.round(e.y);ctx.fillStyle='#8b452c';ctx.fillRect(x+3,y+5,18,14);ctx.fillRect(x+1,y+10,22,9);ctx.fillStyle='#f1c18a';ctx.fillRect(x+5,y+8,5,5);ctx.fillRect(x+15,y+8,5,5);ctx.fillStyle='#241b20';ctx.fillRect(x+7,y+9,2,3);ctx.fillRect(x+17,y+9,2,3);ctx.fillStyle='#4d3025';ctx.fillRect(x+2,y+20,8,4);ctx.fillRect(x+15,y+20,8,4);}
function drawMario(){const p=player;if(p.dead)return;if(p.invuln>0&&Math.floor(tick/5)%2===0)return;const x=Math.round(p.x-camera),y=Math.round(p.y);ctx.save();if(p.face<0){ctx.translate(x+p.w,0);ctx.scale(-1,1);}else ctx.translate(x,0);
ctx.fillStyle='#a92820';ctx.fillRect(3,y,12,5);ctx.fillRect(1,y+4,16,4);ctx.fillStyle='#f0b477';ctx.fillRect(5,y+7,10,8);ctx.fillRect(12,y+11,6,4);ctx.fillStyle='#29232a';ctx.fillRect(12,y+8,2,3);ctx.fillStyle='#71351f';ctx.fillRect(4,y+13,12,4);ctx.fillStyle='#1766c5';ctx.fillRect(3,y+16,13,9);ctx.fillStyle='#e4b52e';ctx.fillRect(6,y+17,3,3);ctx.fillRect(12,y+17,3,3);ctx.fillStyle='#a92820';ctx.fillRect(0,y+17,4,7);ctx.fillRect(15,y+17,4,7);ctx.fillStyle='#593321';ctx.fillRect(2,y+25,7,5);ctx.fillRect(11,y+25,7,5);ctx.restore();}
function drawFlag(){const x=worldW-220-camera;ctx.fillStyle='#deded0';ctx.fillRect(x,130,5,230);ctx.fillStyle='#f5d34f';ctx.beginPath();ctx.moveTo(x+5,142);ctx.lineTo(x+52,158);ctx.lineTo(x+5,176);ctx.fill();ctx.fillStyle='#d8b34a';ctx.fillRect(x-8,356,22,5);const cx=worldW-150-camera;ctx.fillStyle='#b84d27';ctx.fillRect(cx,276,112,84);ctx.fillStyle='#f1a44c';ctx.fillRect(cx+10,286,92,74);ctx.fillStyle='#572a27';ctx.fillRect(cx+38,318,28,42);ctx.fillStyle='#ffe0a0';ctx.fillRect(cx+30,293,9,9);ctx.fillRect(cx+72,293,9,9);ctx.fillStyle='#e4bd52';ctx.fillRect(cx+35,312,8,8);ctx.fillRect(cx+69,312,8,8);}
function draw(){ctx.save();drawSky();drawGround();drawBlocks();drawCoins();for(const e of enemies)if(e.alive)drawEnemy(e);drawFlag();drawMario();ctx.restore();}
function frame(t){const dt=Math.min(2,(t-last)/16.67||1);last=t;if(state==='playing')update(dt);draw();requestAnimationFrame(frame);}
function key(e,on){const k=e.key.toLowerCase();if(['arrowleft','arrowright','arrowup',' ','shift','a','d','w'].includes(k))e.preventDefault();if(k==='arrowleft'||k==='a')keys.left=on;if(k==='arrowright'||k==='d')keys.right=on;if(k==='arrowup'||k==='w'||k===' ')keys.jump=on;if(k==='shift')keys.run=on;}
window.addEventListener('keydown',e=>key(e,true));window.addEventListener('keyup',e=>key(e,false));window.addEventListener('blur',()=>Object.keys(keys).forEach(k=>keys[k]=false));
document.querySelectorAll('[data-key]').forEach(btn=>{const k=btn.dataset.key;const down=e=>{e.preventDefault();keys[k]=true;};const up=e=>{e.preventDefault();keys[k]=false;};btn.addEventListener('pointerdown',down);btn.addEventListener('pointerup',up);btn.addEventListener('pointerleave',up);btn.addEventListener('pointercancel',up);});
canvas.addEventListener('pointerdown',()=>{if(state==='playing')keys.jump=true;});canvas.addEventListener('pointerup',()=>keys.jump=false);canvas.addEventListener('pointerleave',()=>keys.jump=false);
enemies.forEach(e=>e.x0=e.x);updateUI();requestAnimationFrame(frame);
})();