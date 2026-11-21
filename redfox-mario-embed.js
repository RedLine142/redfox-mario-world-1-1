(() => {
'use strict';
function mount(){
 let root=document.getElementById('pp-mario-game');
 if(!root){const host=document.querySelector('.oPos.nobr');if(host){root=document.createElement('div');root.id='pp-mario-game';host.appendChild(root);}}
 if(!root)return false;
 if(root.dataset.marioMounted==='reruns-1-1')return true;
 root.dataset.marioMounted='reruns-1-1';root.innerHTML='';root.style.cssText='width:100%;max-width:980px;margin:14px auto;line-height:normal;';
 const frame=document.createElement('iframe');frame.title='RED FOX — Super Mario Bros. World 1-1';frame.setAttribute('allow','autoplay; fullscreen');frame.setAttribute('loading','eager');frame.style.cssText='display:block;width:100%;height:clamp(430px,calc(75vw + 70px),790px);border:2px solid #bd9447;border-radius:6px;background:#000;';
 const doc = `<!doctype html>
<html lang="ru"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
<base href="https://cdn.jsdelivr.net/gh/reruns/mario@08074829a16830051143339ea05b5082a5c43b2f/">
<title>RED FOX — Mario World 1-1</title>
<style>
*{box-sizing:border-box}html,body{margin:0;width:100%;height:100%;overflow:hidden;background:#070d16}
body{display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:Arial,sans-serif}
#topbar{height:34px;min-height:34px;width:100%;display:flex;align-items:center;justify-content:space-between;padding:0 12px;background:#09182a;border-bottom:1px solid #98743c;color:#f5dfaa;font:bold 12px monospace;letter-spacing:1px}
#topbar .lives{color:#fff}
canvas{display:block;width:min(100vw,calc((100vh - 96px)*1.0666667));height:auto;max-width:100%;max-height:calc(100vh - 96px);object-fit:contain;image-rendering:pixelated;background:#7974ff}
#game-area{display:flex;align-items:center;justify-content:center;flex:1;min-height:0;width:100%;overflow:hidden}
#launch{position:absolute;z-index:5;inset:34px 0 62px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;border:0;background:#07162bd9;color:#fff0c8;text-align:center;cursor:pointer}
#launch strong{font-size:clamp(25px,5vw,44px);letter-spacing:3px;text-shadow:3px 3px #9b2d24}
#launch span{font-size:11px;letter-spacing:2px;color:#e3c56f}
#launch em{margin-top:9px;padding:12px 22px;border:1px solid #ffe8a2;background:#c99b42;color:#101d30;font-style:normal;font-weight:bold;letter-spacing:2px}
#controls{display:flex;align-items:center;justify-content:space-between;gap:12px;width:100%;height:62px;min-height:62px;padding:6px 12px;background:#09182a;border-top:1px solid #8e713c;color:#e8d5a5}#controls .pad{display:flex;align-items:center;gap:10px}#controls .actions{display:flex;align-items:center;gap:10px}
#controls .hint{margin-right:auto;font:10px/1.5 Arial,sans-serif;letter-spacing:.5px}
#controls button{width:46px;height:44px;border:1px solid #c5a35d;border-radius:6px;background:linear-gradient(#25496d,#10253e);color:#fff0c8;font-size:19px;font-weight:bold;touch-action:none;user-select:none;-webkit-user-select:none}#controls button.action{min-width:68px;padding:0 12px;font-size:12px;letter-spacing:.5px}
#controls button.action{background:linear-gradient(#9d372d,#5d1e1a);border-color:#e1a06c}
#game-over{display:none;position:fixed;z-index:10;inset:0;align-items:center;justify-content:center;flex-direction:column;gap:14px;background:#000e;color:#fff0c8;font:bold 24px Arial,sans-serif;letter-spacing:3px;text-align:center}
#game-over button{padding:12px 22px;border:1px solid #ffe8a2;background:#c99b42;color:#101d30;font-weight:bold;letter-spacing:2px}
@media(max-width:600px){#topbar{height:30px;min-height:30px;font-size:10px}canvas{width:min(100vw,calc((100vh - 142px)*1.0666667));max-height:calc(100vh - 142px)}#launch{inset:30px 0 104px}#controls{height:104px;min-height:104px;gap:8px;padding:10px 12px;justify-content:space-between}#controls .hint{display:none}#controls .pad,#controls .actions{gap:9px}#controls button{width:64px;height:62px;font-size:25px;border-radius:9px;box-shadow:0 3px 0 #050d18}#controls button.action{min-width:82px;height:62px;padding:0 8px;font-size:13px;letter-spacing:0}#controls button:active{transform:translateY(2px);box-shadow:0 1px 0 #050d18}}
#rf-finale{display:none;position:absolute;z-index:9;inset:34px 0 62px;align-items:center;justify-content:center;flex-direction:column;gap:24px;background:#7974ff;color:#fff;font:bold 18px monospace;text-align:center;text-shadow:2px 2px #17234a}
#rf-finale .pole{position:relative;width:12px;height:210px;background:linear-gradient(90deg,#777,#fff 45%,#777);border-radius:3px;box-shadow:2px 2px 0 #333}
#rf-finale .banner{position:absolute;left:10px;top:14px;width:150px;height:78px;border:3px solid #18243a;background:linear-gradient(to bottom,#ed2436 0 33.33%,#16c85a 33.33% 66.66%,#176bff 66.66% 100%);display:flex;align-items:center;justify-content:center;color:#fff;font:bold 28px monospace;letter-spacing:2px;text-shadow:2px 2px #111;box-shadow:3px 3px 0 #18243a}
#rf-finale button{padding:13px 24px;border:1px solid #ffe8a2;background:#c99b42;color:#101d30;font-weight:bold;letter-spacing:2px;cursor:pointer}
</style></head><body>
<div id="topbar"><span>RED FOX ARCADE</span><span>WORLD 1-1</span><span class="lives" id="rf-lives">MARIO × 3</span></div>
<div id="game-area"></div>
<button id="launch" type="button"><span>RED FOX ARCADE</span><strong>SUPER MARIO BROS.</strong><em>НАЧАТЬ ИГРУ</em><span>← → ДВИЖЕНИЕ · ПРОБЕЛ ПРЫЖОК · CTRL БЕГ</span></button>
<div id="controls"><div class="pad"><button type="button" data-key="ArrowLeft" aria-label="Влево">◀</button><button type="button" data-key="ArrowRight" aria-label="Вправо">▶</button></div><div class="hint">← → движение<br>ПРОБЕЛ прыжок · CTRL бег</div><div class="actions"><button type="button" class="action" data-key="Space" aria-label="Прыжок">ПРЫЖОК</button><button type="button" class="action" data-key="ControlLeft" aria-label="Бег">БЕГ</button></div></div>
<div id="rf-finale"><div class="pole"><div class="banner">RGB</div></div><div>RED FOX — УРОВЕНЬ ПРОЙДЕН</div><button id="rf-finale-restart" type="button">ИГРАТЬ СНОВА</button></div>
<div id="game-over"><strong>GAME OVER</strong><span>МИР 1-1</span><button id="game-over-restart" type="button">ИГРАТЬ СНОВА</button></div>
<script src="js/util.js"></script>
<script>
(function(){const pressed={};const map={ArrowLeft:'LEFT',ArrowRight:'RIGHT',ArrowUp:'UP',ArrowDown:'DOWN',Space:'JUMP',ControlLeft:'RUN',ControlRight:'RUN'};
function update(e,on){const k=map[e.code]||({37:'LEFT',38:'UP',39:'RIGHT',40:'DOWN',32:'JUMP'}[e.keyCode]);if(!k)return;pressed[k]=on;e.preventDefault();}
document.addEventListener('keydown',e=>update(e,true),true);document.addEventListener('keyup',e=>update(e,false),true);
window.addEventListener('blur',()=>Object.keys(pressed).forEach(k=>pressed[k]=false));
window.input={isDown:key=>!!pressed[key.toUpperCase()],reset:()=>Object.keys(pressed).forEach(k=>pressed[k]=false)};})();
</script>
<script src="js/resources.js"></script><script src="js/sprite.js"></script><script src="js/entity.js"></script>
<script src="js/pipe.js"></script><script src="js/mushroom.js"></script><script src="js/fireflower.js"></script>
<script src="js/star.js"></script><script src="js/fireball.js"></script><script src="js/coin.js"></script>
<script src="js/bcoin.js"></script><script src="js/goomba.js"></script><script src="js/koopa.js"></script>
<script src="js/floor.js"></script><script src="js/block.js"></script><script src="js/rubble.js"></script>
<script src="js/prop.js"></script><script src="js/player.js"></script><script src="js/flag.js"></script>
<script src="js/levels/level.js"></script><script src="js/levels/11.js"></script>
<script>
// RED FOX custom World 1-1 ending: RGB flag finale, no castle/next level.
(function(){
  const basePlayerUpdate = Mario.Player.prototype.update;
  const baseFlagRender = Mario.Flag.prototype.render;

  Mario.Player.prototype.flag = function(){
    this.noInput = true;
    this.flagging = true;
    this.acc = [0,0];
    this.vel = [0,2];
    this.__rfJumpStart = Date.now();
    this.__rfJumpY = this.pos[1];
  };

  Mario.Player.prototype.update = function(dt, cameraX){
    basePlayerUpdate.call(this, dt, cameraX);
    if (this.__rfJumpStart && !window.__rfFinale) {
      const p = Math.min(1, (Date.now() - this.__rfJumpStart) / 850);
      this.pos[1] = this.__rfJumpY - Math.sin(p * Math.PI) * 44;
      if (p >= 1) {
        this.pos[1] = this.__rfJumpY;
        this.__rfJumpStart = 0;
      }
    }
  };

  Mario.Flag.prototype.update = function(){
    if (window.__rfFinale) return;
    if (!this.done && this.pos[1] >= 170) {
      this.vel = [0,0];
      this.pos[1] = 170;
      this.done = true;
      this.__rfRgbFlag = true;
      window.__rfFinale = true;
      player.noInput = true;
      player.flagging = true;
      player.vel = [0,0];
      player.acc = [0,0];
      if (music && music.overworld) music.overworld.pause();
      if (music && music.clear) { music.clear.currentTime=0; music.clear.play().catch(()=>{}); }
      document.getElementById('rf-finale').style.display='flex';
      return;
    }
    this.pos[1] += this.vel[1];
  };

  Mario.Flag.prototype.render = function(renderCtx, cameraX, cameraY){
    if (!this.__rfRgbFlag) { baseFlagRender.call(this); return; }
    const fx=Math.round(this.pos[0]-8-cameraX);
    const fy=Math.round(this.pos[1]-cameraY);
    renderCtx.save();
    renderCtx.fillStyle='#18243a';renderCtx.fillRect(fx,fy,35,21);
    renderCtx.fillStyle='#ed2436';renderCtx.fillRect(fx+1,fy+1,33,6);
    renderCtx.fillStyle='#16c85a';renderCtx.fillRect(fx+1,fy+7,33,6);
    renderCtx.fillStyle='#176bff';renderCtx.fillRect(fx+1,fy+13,33,7);
    renderCtx.fillStyle='#fff';renderCtx.font='bold 8px monospace';
    renderCtx.textAlign='center';renderCtx.textBaseline='middle';
    renderCtx.fillText('RGB',fx+17,fy+10);
    renderCtx.restore();
  };
})();
</script>
<script>
(function(){
window.__rfLives=3;window.__rfGameOver=false;const lives=document.getElementById('rf-lives');const overlay=document.getElementById('game-over');
function paint(){lives.textContent='MARIO × '+window.__rfLives;}
const die=Mario.Player.prototype.die;
Mario.Player.prototype.die=function(){if(this.__rfCountedDeath)return;this.__rfCountedDeath=true;window.__rfLives=Math.max(0,window.__rfLives-1);paint();die.call(this);};
const update=Mario.Player.prototype.update;
Mario.Player.prototype.update=function(dt,vX){if(window.__rfGameOver)return;if(this.dying&&window.__rfLives<=0&&this.dying<=dt){window.__rfGameOver=true;this.dying=9999;this.vel=[0,0];overlay.style.display='flex';return;}update.call(this,dt,vX);};
window.__rfRestartGame=function(){window.__rfLives=3;window.__rfGameOver=false;window.__rfFinale=false;paint();overlay.style.display='none';document.getElementById('rf-finale').style.display='none';player=new Mario.Player(level.playerPos);level.loader.call();gameTime=0;vX=0;input.reset();if(music&&music.overworld){music.overworld.currentTime=0;music.overworld.play().catch(()=>{});}};
document.getElementById('game-over-restart').addEventListener('click',window.__rfRestartGame);
document.getElementById('rf-finale-restart').addEventListener('click',window.__rfRestartGame);
paint();
})();
</script>
<script src="js/game.js"></script>
<script>
(function(){const area=document.getElementById('game-area');const canvas=document.querySelector('canvas');if(canvas)area.appendChild(canvas);
const launch=document.getElementById('launch');launch.addEventListener('click',function(){launch.style.display='none';if(window.music&&music.overworld)music.overworld.play().catch(()=>{});});
document.querySelectorAll('[data-key]').forEach(button=>{const code=button.dataset.key;const send=(type,e)=>{if(e)e.preventDefault();document.dispatchEvent(new KeyboardEvent(type,{code,bubbles:true,cancelable:true}));};
button.addEventListener('pointerdown',e=>{if(button.setPointerCapture)button.setPointerCapture(e.pointerId);send('keydown',e);});
button.addEventListener('pointerup',e=>send('keyup',e));button.addEventListener('pointercancel',e=>send('keyup',e));button.addEventListener('lostpointercapture',()=>send('keyup'));button.addEventListener('contextmenu',e=>e.preventDefault());});
})();
</script></body></html>`;
 frame.srcdoc=doc;root.appendChild(frame);return true;
}
function start(){if(mount())return;const observer=new MutationObserver(()=>{if(mount())observer.disconnect();});observer.observe(document.documentElement,{childList:true,subtree:true});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();