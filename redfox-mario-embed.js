(() => {
  'use strict';

  const UPSTREAM = 'https://cdn.jsdelivr.net/gh/meth-meth-method/super-mario@a6d8fece2e9e9445f873771adda2c1b17881ed9e/public/';

  function mount() {
    let root = document.getElementById('pp-mario-game');
    if (!root) {
      const host = document.querySelector('.oPos.nobr');
      if (host) {
        root = document.createElement('div');
        root.id = 'pp-mario-game';
        host.appendChild(root);
      }
    }
    if (!root) return false;
    if (root.dataset.marioMounted === 'upstream') return true;
    root.dataset.marioMounted = 'upstream';

    root.innerHTML = '';
    root.style.cssText = 'width:100%;max-width:920px;margin:14px auto;line-height:normal;';
    const frame = document.createElement('iframe');
    frame.title = 'RED FOX — Super Mario Bros. World 1-1';
    frame.setAttribute('allow', 'autoplay; fullscreen');
    frame.setAttribute('loading', 'eager');
    frame.style.cssText = 'display:block;width:100%;height:clamp(430px,calc(75vw + 78px),760px);border:2px solid #bd9447;border-radius:6px;background:#000;';

    const doc = `<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
<base href="${UPSTREAM}">
<link rel="stylesheet" href="css/main.css">
<style>
*{box-sizing:border-box}
html,body{margin:0;width:100%;height:100%;overflow:hidden;background:#000}
body{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:0}
#screen.aspect-4-3{display:block;width:min(100vw,calc((100vh - 72px)*1.333333));height:auto;max-height:calc(100vh - 72px);max-width:100vw;object-fit:contain;image-rendering:pixelated;flex:0 1 auto}
#playfield{position:relative;display:flex;align-items:center;justify-content:center;width:100%;min-height:0;flex:1}
#launch{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;border:0;background:#07162bd9;color:#fff0c8;text-align:center;cursor:pointer;font-family:Arial,sans-serif}
#launch strong{font-size:clamp(24px,5vw,42px);letter-spacing:3px;text-shadow:3px 3px #9b2d24}
#launch span{font-size:11px;letter-spacing:2px;color:#e3c56f}
#launch em{margin-top:9px;padding:12px 22px;border:1px solid #ffe8a2;background:#c99b42;color:#101d30;font-style:normal;font-weight:bold;letter-spacing:2px}
#controls{display:flex;align-items:center;justify-content:center;gap:9px;width:100%;height:64px;padding:6px 8px;background:#09182a;border-top:1px solid #8e713c;font:10px Arial,sans-serif;color:#e8d5a5}
#controls .hint{margin-right:auto;line-height:1.6;letter-spacing:.5px}
#controls button{width:44px;height:42px;border:1px solid #c5a35d;border-radius:4px;background:linear-gradient(#25496d,#10253e);color:#fff0c8;font-size:17px;font-weight:bold;touch-action:none;user-select:none;-webkit-user-select:none}
#controls button.action{background:linear-gradient(#9d372d,#5d1e1a);border-color:#e1a06c}
@media(max-width:600px){#controls{height:58px;gap:5px;padding:5px}#controls .hint{font-size:8px}#controls button{width:38px;height:38px;font-size:15px}}
</style>
</head>
<body>
<div id="playfield">
  <canvas id="screen" width="256" height="240" class="aspect-4-3"></canvas>
  <button id="launch" type="button"><span>RED FOX ARCADE</span><strong>WORLD 1-1</strong><em>НАЧАТЬ ИГРУ</em><span>← → ДВИЖЕНИЕ · ПРОБЕЛ ПРЫЖОК · SHIFT БЕГ</span></button>
</div>
<div id="controls">
  <div class="hint">← → движение<br>ПРОБЕЛ прыжок · SHIFT бег</div>
  <button type="button" data-key="KeyA" aria-label="Влево">◀</button>
  <button type="button" data-key="KeyD" aria-label="Вправо">▶</button>
  <button type="button" class="action" data-key="KeyP" aria-label="Прыжок">A</button>
  <button type="button" class="action" data-key="KeyO" aria-label="Бег">B</button>
  <button type="button" data-key="KeyS" aria-label="Вниз">▼</button>
</div>
<script>
(function(){
  const map={ArrowLeft:'KeyA',ArrowRight:'KeyD',ArrowUp:'KeyW',ArrowDown:'KeyS',Space:'KeyP',ShiftLeft:'KeyO',ShiftRight:'KeyO',KeyX:'KeyO'};
  function send(type,code){window.dispatchEvent(new KeyboardEvent(type,{code:code,bubbles:true,cancelable:true}));}
  document.addEventListener('keydown',function(e){const code=map[e.code];if(!code)return;e.preventDefault();e.stopImmediatePropagation();send('keydown',code);},true);
  document.addEventListener('keyup',function(e){const code=map[e.code];if(!code)return;e.preventDefault();e.stopImmediatePropagation();send('keyup',code);},true);
  document.getElementById('launch').addEventListener('click',function(){this.style.display='none';});
  document.querySelectorAll('[data-key]').forEach(function(button){
    const code=button.dataset.key;
    function down(e){e.preventDefault();button.setPointerCapture&&button.setPointerCapture(e.pointerId);send('keydown',code);}
    function up(e){e.preventDefault();send('keyup',code);}
    button.addEventListener('pointerdown',down);
    button.addEventListener('pointerup',up);
    button.addEventListener('pointercancel',up);
    button.addEventListener('lostpointercapture',function(){send('keyup',code);});
    button.addEventListener('contextmenu',function(e){e.preventDefault();});
  });
})();
</script>
<script type="module" src="js/main.js"></script>
</body>
</html>`;
    frame.srcdoc = doc;
    root.appendChild(frame);
    return true;
  }

  function start() {
    if (mount()) return;
    const observer = new MutationObserver(() => {
      if (mount()) observer.disconnect();
    });
    observer.observe(document.documentElement, {childList:true,subtree:true});
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, {once:true});
  } else {
    start();
  }
})();