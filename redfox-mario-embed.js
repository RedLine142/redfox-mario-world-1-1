(() => {
  'use strict';
  const ownScript = document.currentScript;
  const scriptUrl = ownScript && ownScript.src ? ownScript.src : '';

  // The RED FOX editor may insert task markup after executing its scripts.
  // Wait for the mount point and create it inside the task container if needed.
  const boot = () => {
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
    if (root.dataset.marioMounted === '1') return true;
    root.dataset.marioMounted = '1';

  const showLoadError = () => {
    root.innerHTML = '<div class="rfm-load-error">НЕ УДАЛОСЬ ЗАГРУЗИТЬ ИГРОВОЙ МОДУЛЬ.<br>ОБНОВИ СТРАНИЦУ ИЛИ ПРОВЕРЬ ДОСТУП К CDN.</div>';
  };
  const mount = Core => {
    if (!Core || !Core.createGame || !Core.stepGame) { showLoadError(); return; }
    root.tabIndex = 0;
    root.innerHTML = `
      <main class="rfm-cabinet">
        <header class="rfm-header">
          <div class="rfm-brand">RED FOX<span>ARCADE SYSTEM</span></div>
          <div class="rfm-heading"><small>8-BIT PLATFORM CHALLENGE</small><strong>WORLD 1-1</strong></div>
          <div class="rfm-edition">DENDY CLASSIC</div>
        </header>
        <section class="rfm-hud" aria-label="Игровая статистика">
          <div><small>СЧЁТ</small><b id="rfm-score">000000</b></div>
          <div><small>МОНЕТЫ</small><b id="rfm-coins">× 00</b></div>
          <div><small>МИР</small><b>1-1</b></div>
          <div><small>ЖИЗНИ</small><b id="rfm-lives">× 03</b></div>
          <div><small>ВРЕМЯ</small><b id="rfm-time">400</b></div>
        </section>
        <section class="rfm-screen">
          <div class="rfm-screenline"><span>RED FOX 8-BIT ENGINE</span><span id="rfm-status">READY PLAYER</span></div>
          <div class="rfm-canvas-box">
            <canvas id="rfm-canvas" width="768" height="720" aria-label="Игровой уровень World 1-1" tabindex="0"></canvas>
            <div class="rfm-overlay" id="rfm-overlay">
              <div class="rfm-overlay-card">
                <div class="rfm-star">★</div>
                <small>RED FOX PRESENTS</small>
                <h2 id="rfm-overlay-title">WORLD 1-1</h2>
                <p id="rfm-overlay-copy">ПРОЙДИ КЛАССИЧЕСКИЙ УРОВЕНЬ. СОБИРАЙ МОНЕТЫ, ИЗБЕГАЙ ВРАГОВ И ДОБЕРИСЬ ДО ЗАМКА.</p>
                <button id="rfm-start" type="button">НАЧАТЬ ИГРУ</button>
              </div>
            </div>
          </div>
          <div class="rfm-screenline rfm-bottomline"><span>ORIGINAL LEVEL INSPIRED · CUSTOM PIXEL ART</span><span>NO SOUND</span></div>
        </section>
        <footer class="rfm-footer">
          <div class="rfm-keys"><b>УПРАВЛЕНИЕ</b><span>← → / A D — ДВИЖЕНИЕ</span><span>ПРОБЕЛ / ↑ — ПРЫЖОК</span><span>SHIFT / X — БЕГ</span><span>↓ — ВХОД В ТРУБУ</span><span>Z / C — ОГОНЬ</span></div>
          <div class="rfm-touch" aria-label="Сенсорное управление">
            <button type="button" data-control="left" aria-label="Влево">◀</button>
            <button type="button" data-control="right" aria-label="Вправо">▶</button>
            <button type="button" data-control="jump" aria-label="Прыжок">A</button>
            <button type="button" data-control="run" aria-label="Бег">B</button><button type="button" data-control="fire" aria-label="Огонь">C</button><button type="button" data-control="down" aria-label="Вниз / труба">▼</button>
          </div>
          <div class="rfm-footer-mark">INSERT COIN · PLAY</div>
        </footer>
      </main>`;

    const style = document.createElement('style');
    style.textContent = `
      #pp-mario-game{width:100%;max-width:920px;margin:16px auto;color:#f8e8bd;font:12px/1.35 Arial,Helvetica,sans-serif;outline:none}
      #pp-mario-game *{box-sizing:border-box}
      #pp-mario-game .rfm-cabinet{padding:14px;border:2px solid #bd9447;border-radius:8px;background:linear-gradient(145deg,#162d4b,#081526 68%);box-shadow:0 0 0 4px #030a12,0 12px 34px #0008}
      #pp-mario-game .rfm-header{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:2px 4px 12px;border-bottom:1px solid #8c713d}
      #pp-mario-game .rfm-brand{font-size:19px;font-weight:1000;letter-spacing:2px;color:#e4bd65;white-space:nowrap}
      #pp-mario-game .rfm-brand span{display:block;margin-top:2px;color:#9fb2c9;font-size:8px;letter-spacing:3px}
      #pp-mario-game .rfm-heading{text-align:center}.rfm-heading small{display:block;color:#c9a85e;font-size:8px;letter-spacing:2px}.rfm-heading strong{display:block;color:#fff0c8;font-size:clamp(15px,2.5vw,21px);letter-spacing:2px}
      #pp-mario-game .rfm-edition{padding:6px 8px;border:1px solid #8b713d;color:#d8bd80;font-size:8px;letter-spacing:1px;white-space:nowrap}
      #pp-mario-game .rfm-hud{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:7px;padding:11px 0}
      #pp-mario-game .rfm-hud>div{min-width:0;padding:6px 3px;text-align:center;border:1px solid #526a83;background:linear-gradient(#1a3554,#10233a)}
      #pp-mario-game .rfm-hud small{display:block;margin-bottom:3px;color:#d7b45e;font-size:8px;letter-spacing:1px}
      #pp-mario-game .rfm-hud b{font: bold clamp(14px,2.4vw,21px)/1.1 monospace;color:#fff0c8;letter-spacing:1px}
      #pp-mario-game .rfm-screen{padding:7px;border:2px solid #c7a45b;background:#050b13}
      #pp-mario-game .rfm-screenline{display:flex;justify-content:space-between;gap:8px;padding:3px 2px 7px;color:#d4b66e;font-size:8px;letter-spacing:1.5px}
      #pp-mario-game .rfm-bottomline{padding:7px 2px 1px;color:#9aabc0;font-size:7px}
      #pp-mario-game .rfm-canvas-box{position:relative;overflow:hidden;width:100%;background:#64a4f8;line-height:0}
      #pp-mario-game canvas{display:block;width:100%;height:auto;aspect-ratio:256/240;image-rendering:pixelated;image-rendering:crisp-edges;touch-action:none;outline:none}
      #pp-mario-game .rfm-overlay{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;padding:14px;background:#061326d9;line-height:normal}
      #pp-mario-game .rfm-overlay.is-hidden{display:none}
      #pp-mario-game .rfm-overlay-card{width:min(430px,100%);padding:19px 22px;text-align:center;border:2px solid #d3b265;background:linear-gradient(145deg,#193b60,#0a1b31);box-shadow:0 8px 30px #0008}
      #pp-mario-game .rfm-star{color:#f6d36c;font-size:27px}.rfm-overlay-card>small{color:#c8a75d;font-size:8px;letter-spacing:3px}
      #pp-mario-game .rfm-overlay h2{margin:7px 0;color:#ffe6a2;font-size:clamp(24px,5vw,36px);letter-spacing:3px}
      #pp-mario-game .rfm-overlay p{margin:8px 0 13px;color:#d7e2f1;font-size:10px;line-height:1.6;letter-spacing:.7px}
      #pp-mario-game button{font:inherit;cursor:pointer}#pp-mario-game .rfm-overlay button{padding:12px 20px;border:1px solid #fff0b2;background:linear-gradient(#f4d782,#b88935);color:#17243a;font-weight:900;letter-spacing:2px}
      #pp-mario-game .rfm-footer{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:11px 3px 1px}
      #pp-mario-game .rfm-keys{display:flex;flex-wrap:wrap;align-items:center;gap:10px;color:#b8c8db;font-size:9px}#pp-mario-game .rfm-keys b{color:#dfbc69}
      #pp-mario-game .rfm-footer-mark{color:#d8b665;font-size:8px;letter-spacing:2px;white-space:nowrap}
      #pp-mario-game .rfm-touch{display:none;gap:5px}.rfm-touch button{touch-action:none;user-select:none;-webkit-user-select:none}
      #pp-mario-game .rfm-touch button{width:38px;height:38px;border:1px solid #cba95f;border-radius:4px;background:#18395c;color:#ffe5a5;font-size:16px;font-weight:900}
      #pp-mario-game .rfm-load-error{padding:25px;border:1px solid #a66b45;background:#211a18;color:#ffe0b5;text-align:center;font-weight:bold;line-height:1.8}
      @media(max-width:650px){#pp-mario-game{margin:10px auto}#pp-mario-game .rfm-cabinet{padding:7px}#pp-mario-game .rfm-header{gap:5px;padding-bottom:8px}#pp-mario-game .rfm-brand{font-size:13px}#pp-mario-game .rfm-brand span{font-size:6px;letter-spacing:2px}#pp-mario-game .rfm-heading small{font-size:6px}#pp-mario-game .rfm-heading strong{font-size:13px;letter-spacing:1px}#pp-mario-game .rfm-edition{padding:4px;font-size:6px}#pp-mario-game .rfm-hud{gap:3px;padding:7px 0}#pp-mario-game .rfm-hud>div{padding:5px 1px}#pp-mario-game .rfm-hud small{font-size:6px}#pp-mario-game .rfm-hud b{font-size:13px}#pp-mario-game .rfm-screen{padding:4px}#pp-mario-game .rfm-screenline{font-size:6px;letter-spacing:.7px}#pp-mario-game .rfm-bottomline{font-size:5px}#pp-mario-game .rfm-footer{flex-wrap:wrap;padding-top:8px}#pp-mario-game .rfm-keys{gap:5px;font-size:7px}#pp-mario-game .rfm-footer-mark{display:none}#pp-mario-game .rfm-touch{display:flex;margin-left:auto}#pp-mario-game .rfm-touch button{width:32px;height:34px;font-size:14px}}
    `;
    document.head.appendChild(style);

    const canvas = root.querySelector('#rfm-canvas');
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    ctx.setTransform(3, 0, 0, 3, 0, 0);
    const $ = selector => root.querySelector(selector);
    const ui = { score:$('#rfm-score'), coins:$('#rfm-coins'), lives:$('#rfm-lives'), time:$('#rfm-time'), overlay:$('#rfm-overlay'), title:$('#rfm-overlay-title'), copy:$('#rfm-overlay-copy'), start:$('#rfm-start'), status:$('#rfm-status') };
    const input = { left:false, right:false, jump:false, run:false };
    let game = null, raf = 0, last = 0, accumulator = 0, paused = false, animationFrame = 0, lastArea = 'main';
    const W = 256, H = 240;
    const palette = { sky:'#64a4f8', cloud:'#fff9e9', hill:'#24a34a', hillDark:'#16743c', soil:'#a94b26', soil2:'#d47a36', brick:'#a94e2a', brickLight:'#e28a49', gold:'#f6bd3e', goldDark:'#a76c22', pipe:'#138a43', pipeLight:'#42c96b', pipeDark:'#075b35', red:'#d92d24', redDark:'#8e1c1c', blue:'#2456b8', skin:'#f5b47d', brown:'#6c3824', black:'#24202a', white:'#fff5db', shell:'#3b9b48' };
    const marioSmall = [
      '....RRRRRR......','...RRRRRRRR.....','...HHSSSS.......','..HSSSSSSS......',
      '..HSSKSSS.......','...SSSSSS.......','....HHHH........','...BBBBBB.......',
      '..BBBBBBBB......','..BB.BB.B.......','..BB.BB.B.......','...RR..RR.......',
      '..RR....RR......','..HHH..HHH......','..HHH..HHH......','................'
    ];
    const marioRun = [
      '....RRRRRR......','...RRRRRRRR.....','...HHSSSS.......','..HSSSSSSS......',
      '..HSSKSSS.......','...SSSSSS.......','....HHHH........','...BBBBBB.......',
      '..BBBBBBBB......','..BB.BB.B.......','..BB.BB.B.......','....RRRR........',
      '...RR..RR.......','..HH....HH......','..HH....HH......','................'
    ];
    const goombaRows = ['................','.....bbbbbb.....','....bbbbbbbb....','...bbbbbbbbbb...','..bbSSbbbbSSbb..','.bbSSSSbbSSSSbb.','.bbSSSSbbSSSSbb.','..bbbbbbbbbbbb..','...bbbbbbbbbb...','....bbbbbbbb....','....bb.bbbb.....','...bbb.bbbbb....','..bbbb...bbbb...','................','................','................'];
    const koopaRows = ['......gggg......','.....gggggg.....','.....gSSSSg.....','......SSSS......','....gggggggg....','...gggggggggg...','...gggSSSSggg...','....gggggggg....','.....GGGGGG.....','....GGGGGGGG....','...GGGGGGGGGG...','...GGGG..GGGG...','....GG....GG....','....bb....bb....','...bbb....bbb...','................'];
    const mushroomRows = ['................','......rrrr......','....rrrrrrrr....','...rrrrrrrrrr...','..rrrwwrrrrrrr..','.rrrwwwwrrrrrrr.','.rrrrrrrrrrrrrr.','.rrrrrrrrrrrrrr.','...ssssssssss...','....ssssssss....','.....ssssss.....','......ssss......','......ss.ss.....','.....ss...ss....','................','................'];
    const mapColors = { R:palette.red, H:palette.brown, S:palette.skin, K:palette.black, B:palette.blue, b:palette.brown, r:palette.red, w:palette.white, s:palette.skin, g:palette.shell, G:'#b8a64b' };

    function drawSprite(x, y, rows, colors, flip = false, scaleY = 1) {
      ctx.save();
      if (flip) { ctx.translate(x + 16, y); ctx.scale(-1, 1); x = 0; y = 0; }
      for (let row = 0; row < rows.length; row++) {
        const line = rows[row];
        for (let col = 0; col < line.length; col++) {
          const key = line[col];
          if (key !== '.' && colors[key]) { ctx.fillStyle = colors[key]; ctx.fillRect(Math.round(x + col), Math.round(y + row * scaleY), 1, scaleY); }
        }
      }
      ctx.restore();
    }
    function drawCloud(x, y) {
      ctx.fillStyle = palette.cloud;
      ctx.fillRect(x+6,y,13,4); ctx.fillRect(x+2,y+4,22,6); ctx.fillRect(x+7,y+10,15,3);
    }
    function drawBackground(camera, area) {
      if (area === 'bonus') {
        ctx.fillStyle = '#101b45'; ctx.fillRect(0,0,W,H);
        for (let x=0;x<W;x+=16) { ctx.fillStyle='#263a70';ctx.fillRect(x,24,16,8);ctx.fillRect(x,40,16,8);ctx.fillStyle='#182a59';ctx.fillRect(x+2,26,12,4); }
        for (let x=0;x<W;x+=32) { ctx.fillStyle='#344b82';ctx.fillRect(x,64,16,8);ctx.fillRect(x+16,80,16,8); }
        return;
      }
      ctx.fillStyle = palette.sky; ctx.fillRect(0,0,W,H);
      const cloudPositions = [[45,35],[165,24],[350,44],[520,31],[710,48],[900,27],[1110,41],[1340,29],[1570,44],[1800,25],[2030,38],[2290,28],[2510,43],[2780,26],[3030,40],[3290,32],[3480,45]];
      for (const [wx,y] of cloudPositions) { let x = Math.floor(wx - camera*.42) % 310; if (x < -28) x += 310; drawCloud(x,y); }
      const hills = [[10,48,35],[175,66,47],[390,50,36],[620,70,50],[850,48,35],[1080,64,46],[1320,48,35],[1550,70,50],[1790,48,35],[2030,65,46],[2280,48,35],[2510,70,50],[2760,48,35],[3000,68,48],[3230,48,35]];
      for (const [wx,w,h] of hills) {
        const x = wx - camera*.72;
        if (x < -w || x > W) continue;
        ctx.fillStyle = palette.hill; ctx.beginPath(); ctx.moveTo(x,208); ctx.lineTo(x+w/2,208-h); ctx.lineTo(x+w,208); ctx.fill();
        ctx.fillStyle = palette.hillDark; ctx.fillRect(x+w/2-4,208-h+17,3,5); ctx.fillRect(x+w/2+3,208-h+24,3,5);
      }
      const bushes = [100,280,560,820,1030,1260,1490,1740,1980,2210,2450,2690,2950,3110];
      for (const wx of bushes) {
        const x = wx - camera*.85;
        if (x < -40 || x > W+30) continue;
        ctx.fillStyle = '#159044'; ctx.fillRect(x+5,199,25,9); ctx.fillRect(x,203,36,5); ctx.fillRect(x+11,194,12,8);
      }
    }
    function drawGround(game, camera) {
      for (const tile of game.ground) {
        const x = Math.floor(tile.x-camera); if (x < -16 || x > W) continue;
        ctx.fillStyle = palette.soil; ctx.fillRect(x,208,16,32);
        ctx.fillStyle = palette.soil2; ctx.fillRect(x,208,16,3);
        ctx.fillStyle = '#71331f'; ctx.fillRect(x,211,16,1);
        ctx.fillStyle = '#e18a45'; ctx.fillRect(x+2,218,5,1); ctx.fillRect(x+10,226,5,1); ctx.fillRect(x+5,235,5,1);
        ctx.fillStyle = '#73351f'; ctx.fillRect(x+8,214,1,5); ctx.fillRect(x+3,228,1,6);
      }
    }
    function drawBlock(block, camera) {
      const x = Math.round(block.x-camera), y = block.y;
      if (x < -18 || x > W+2) return;
      if (block.broken || (block.kind === 'hidden' && !block.used)) return;
      if (block.kind === 'hard') {
        ctx.fillStyle='#777a88';ctx.fillRect(x,y,16,16);ctx.fillStyle='#a8a7a0';ctx.fillRect(x+1,y+1,14,2);ctx.fillStyle='#454b59';ctx.fillRect(x,y+14,16,2);ctx.fillRect(x+7,y+3,2,10);return;
      }
      if (block.kind === 'question' && !block.used) {
        ctx.fillStyle = palette.gold; ctx.fillRect(x,y,16,16); ctx.fillStyle = '#ffe28b'; ctx.fillRect(x+2,y+2,12,2); ctx.fillStyle = palette.goldDark; ctx.fillRect(x,y+14,16,2); ctx.fillRect(x+14,y,2,16);
        ctx.fillStyle = '#fff0bb'; ctx.font = 'bold 12px monospace'; ctx.fillText('?',x+4,y+12);
      } else {
        ctx.fillStyle = block.used ? '#8c6545' : palette.brick; ctx.fillRect(x,y,16,16);
        ctx.fillStyle = block.used ? '#b18b66' : palette.brickLight; ctx.fillRect(x+1,y+1,14,2);
        ctx.fillStyle = '#5e2d25'; ctx.fillRect(x,y+7,16,1); ctx.fillRect(x+7,y,1,7); ctx.fillRect(x+3,y+8,1,8); ctx.fillRect(x+12,y+8,1,8);
      }
    }
    function drawPipe(pipe, camera) {
      const x = Math.round(pipe.x-camera); if (x < -36 || x > W+4) return;
      ctx.fillStyle = palette.pipeDark; ctx.fillRect(x+2,pipe.y,28,pipe.h);
      ctx.fillStyle = palette.pipe; ctx.fillRect(x+4,pipe.y,24,pipe.h);
      ctx.fillStyle = palette.pipeLight; ctx.fillRect(x+5,pipe.y,5,pipe.h);
      ctx.fillStyle = '#075b35'; ctx.fillRect(x,pipe.y,32,6);
      ctx.fillStyle = '#37c768'; ctx.fillRect(x+1,pipe.y,29,3);
      ctx.fillStyle = '#06492d'; ctx.fillRect(x+29,pipe.y+4,2,pipe.h-4);
    }
    function drawCoin(coin, camera, frame) {
      if (!coin.alive) return;
      const x = Math.round(coin.x-camera), y = Math.round(coin.y + Math.sin(frame/5+coin.x)*1.5);
      const width = Math.abs(Math.sin(frame/7+coin.x))*3+2;
      ctx.fillStyle = '#9a5c1d'; ctx.fillRect(x+3-width/2,y,Math.max(2,width),12);
      ctx.fillStyle = '#ffe36a'; ctx.fillRect(x+4-width/2,y+1,Math.max(1,width-1),10);
    }
    function drawEnemy(enemy, camera, frame) {
      if (!enemy.alive) return;
      const x = Math.round(enemy.x-camera), y = Math.round(enemy.y);
      if (x < -20 || x > W+20) return;
      if (enemy.state === 'shell') {
        ctx.fillStyle = '#236b36'; ctx.fillRect(x+2,y+3,12,9); ctx.fillStyle = '#58bd5b'; ctx.fillRect(x+4,y+1,8,9); ctx.fillStyle = '#f3d47d'; ctx.fillRect(x+3,y+10,10,2); return;
      }
      if (enemy.type === 'koopa') drawSprite(x,y,koopaRows,mapColors,enemy.vx>0,1);
      else drawSprite(x,y,goombaRows,mapColors,enemy.vx>0,1);
    }
    function drawPowerup(item, camera) {
      if (!item.active) return;
      drawSprite(Math.round(item.x-camera),Math.round(item.y),mushroomRows,mapColors,false,1);
    }
    function drawPlayer(player, frame) {
      if (player.dead) return;
      if (player.invulnerable > 0 && Math.floor(frame/4)%2===0) return;
      const rows = Math.abs(player.vx)>.35 && Math.floor(frame/7)%2 ? marioRun : marioSmall;
      const x = Math.round(player.x-2), y = Math.round(player.y);
      drawSprite(x,y,rows,mapColors,player.facing<0,player.power==='big'?2:1);
    }
    function drawEnd(game,camera) {
      if (!game.flagpole || !game.castle) return;
      const fx = Math.round(game.flagpole.x-camera);
      if (fx > -10 && fx < W+10) {
        ctx.fillStyle = '#e7e2d1'; ctx.fillRect(fx,64,2,144); ctx.fillStyle = '#fff'; ctx.fillRect(fx-1,64,1,144);
        ctx.fillStyle = '#f2d14e'; ctx.fillRect(fx+2,73,13,8); ctx.fillRect(fx+2,73,4,8);
        ctx.fillStyle = '#d7d3c3'; ctx.fillRect(fx-3,205,8,3);
      }
      const cx = Math.round(game.castle.x-camera);
      if (cx > -60 && cx < W+50) {
        ctx.fillStyle = '#c8b9a0'; ctx.fillRect(cx,160,48,48); ctx.fillRect(cx+7,151,12,9); ctx.fillRect(cx+29,151,12,9); ctx.fillRect(cx+18,143,12,17);
        ctx.fillStyle = '#8b7967'; ctx.fillRect(cx+19,184,10,24); ctx.fillRect(cx+5,170,8,8); ctx.fillRect(cx+35,170,8,8);
      }
    }
    function render() {
      if (!game) { ctx.fillStyle=palette.sky;ctx.fillRect(0,0,W,H);return; }
      const camera = game.camera;
      drawBackground(camera,game.area); drawGround(game,camera);
      for (const block of game.blocks) drawBlock(block,camera);
      for (const stair of game.stairs) {
        const x=Math.round(stair.x-camera); if(x<-18||x>W)continue;
        ctx.fillStyle=palette.brick;ctx.fillRect(x,stair.y,stair.w,stair.h);ctx.fillStyle=palette.brickLight;ctx.fillRect(x,stair.y,stair.w,2);ctx.fillStyle='#683426';ctx.fillRect(x+14,stair.y,2,stair.h);
      }
      for (const pipe of game.pipes) drawPipe(pipe,camera);
      for (const coin of game.coinsWorld) drawCoin(coin,camera,animationFrame);
      for (const enemy of game.enemies) drawEnemy(enemy,camera,animationFrame);
      for (const item of game.powerups) drawPowerup(item,camera);
      for (const fireball of game.fireballs) { const x=Math.round(fireball.x-camera),y=Math.round(fireball.y);ctx.fillStyle='#ef6b25';ctx.fillRect(x,y,8,8);ctx.fillStyle='#ffe18b';ctx.fillRect(x+2,y+2,4,4); }
      drawEnd(game,camera); drawPlayer(game.player,animationFrame);
    }
    function updateHud() {
      if (!game) return;
      ui.score.textContent=String(game.score).padStart(6,'0');
      ui.coins.textContent='× '+String(game.coins).padStart(2,'0');
      ui.lives.textContent='× '+String(game.lives).padStart(2,'0');
      ui.time.textContent=String(Math.max(0,Math.ceil(game.time)));
    }
    function showOverlay(title, copy, button) {
      ui.title.textContent=title;ui.copy.textContent=copy;ui.start.textContent=button;ui.overlay.classList.remove('is-hidden');
    }
    function startGame() {
      game=Core.createGame();input.left=input.right=input.jump=input.run=input.fire=input.down=false;paused=false;accumulator=0;last=0;lastArea='main';
      ui.overlay.classList.add('is-hidden');ui.status.textContent='GAME RUNNING';updateHud();canvas.focus();
    }
    function finishState() {
      if (game.status==='won') {ui.status.textContent='LEVEL CLEAR';showOverlay('LEVEL CLEAR!','WORLD 1-1 ПРОЙДЕН. ТЫ ДОБРАЛСЯ ДО ЗАМКА.','ИГРАТЬ СНОВА');}
      else if (game.status==='over') {ui.status.textContent='GAME OVER';showOverlay('GAME OVER','ВСЕ ЖИЗНИ ПОТРАЧЕНЫ. ПОПРОБУЙ ПРОЙТИ УРОВЕНЬ ЕЩЁ РАЗ.','ПОВТОРИТЬ');}
    }
    function tick(now) {
      raf=requestAnimationFrame(tick);animationFrame++;
      if (!last) last=now;
      const delta=Math.min(100,now-last);last=now;
      if (game && !paused && game.status==='playing') {
        accumulator+=delta;
        let steps=0;
        while(accumulator>=1000/60 && steps<6) {Core.stepGame(game,input,1);accumulator-=1000/60;steps++;}
        updateHud();finishState();
        if(game.area!==lastArea){ui.status.textContent=game.area==='bonus'?'BONUS ROOM':'GAME RUNNING';lastArea=game.area;}
      }
      render();
    }
    function setKey(code,down) {
      if (code==='ArrowLeft'||code==='KeyA') input.left=down;
      if (code==='ArrowRight'||code==='KeyD') input.right=down;
      if (code==='Space'||code==='ArrowUp'||code==='KeyW') input.jump=down;
      if (code==='ShiftLeft'||code==='ShiftRight'||code==='KeyX') input.run=down;
      if (code==='KeyZ'||code==='KeyC') input.fire=down;
      if (code==='ArrowDown'||code==='KeyS') input.down=down;
    }
    root.addEventListener('keydown',event=>{
      if (['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Space'].includes(event.code)) event.preventDefault();
      if (event.code==='Escape' && game && game.status==='playing') {paused=!paused;ui.status.textContent=paused?'PAUSED':'GAME RUNNING';return;}
      setKey(event.code,true);
    });
    root.addEventListener('keyup',event=>setKey(event.code,false));
    window.addEventListener('blur',()=>{input.left=input.right=input.jump=input.run=input.fire=input.down=false;});
    document.addEventListener('visibilitychange',()=>{if(document.hidden){input.left=input.right=input.jump=input.run=false;last=0;accumulator=0;}});
    root.querySelectorAll('[data-control]').forEach(button=>{
      const control=button.dataset.control;
      const down=event=>{event.preventDefault();button.setPointerCapture?.(event.pointerId);input[control]=true;};
      const up=event=>{event.preventDefault();input[control]=false;};
      button.addEventListener('pointerdown',down);button.addEventListener('pointerup',up);button.addEventListener('pointercancel',up);button.addEventListener('lostpointercapture',()=>{input[control]=false;});
      button.addEventListener('contextmenu',event=>event.preventDefault());
    });
    ui.start.addEventListener('click',startGame);
    render();
    raf=requestAnimationFrame(tick);
    root.dataset.marioReady='1';
  };

  if (window.RedFoxMarioCore) { mount(window.RedFoxMarioCore); return; }
  if (!scriptUrl) { showLoadError(); return; }
  const coreScript = document.createElement('script');
  coreScript.src = new URL('mario-core.js', scriptUrl).href;
  coreScript.onload = () => mount(window.RedFoxMarioCore);
  coreScript.onerror = showLoadError;
  document.head.appendChild(coreScript);
    return true;
  };

  const start = () => {
    if (boot()) return;
    const observer = new MutationObserver(() => {
      if (boot()) observer.disconnect();
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
})();