'use strict';
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.RedFoxMarioCore = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  const TILE = 16;
  const FLOOR = 208;
  const WIDTH = 3584;
  const clone = value => JSON.parse(JSON.stringify(value));

  function buildLevel() {
    const gaps = [[69, 72], [139, 143], [160, 164]];
    const ground = [];
    for (let tx = 0; tx < WIDTH / TILE; tx++) {
      if (!gaps.some(([a, b]) => tx >= a && tx < b)) ground.push({ x: tx * TILE, y: FLOOR, w: TILE, h: 32, kind: 'ground' });
    }
    const blocks = [];
    const add = (tx, ty, kind, reward = null) => blocks.push({ x: tx * TILE, y: ty * TILE, w: TILE, h: TILE, kind, reward, used: false, broken: false });
    // The iconic opening: isolated question block, paired brick/question formation,
    // raised coin formations, then the repeating pipe / pit / block rhythm.
    add(16, 10, 'question', 'coin');
    add(20,10,'question','mushroom'); add(21,10,'brick'); add(22,10,'brick');
    add(21,9,'question','coin'); add(22,9,'brick'); add(22,8,'brick');
    [28, 30, 31, 32].forEach(tx => add(tx, 6, tx === 30 ? 'question' : 'brick', tx === 30 ? 'coin' : null));
    add(38, 10, 'question', 'coin'); add(39, 10, 'brick'); add(40, 10, 'brick');
    [46, 47, 48, 49, 50].forEach(tx => add(tx, 6, tx === 47 || tx === 49 ? 'question' : 'brick', tx === 47 || tx === 49 ? 'coin' : null));
    [55, 56, 57, 58, 59].forEach(tx => add(tx, 10, tx === 57 ? 'question' : 'brick', tx === 57 ? 'coin' : null));
    [64, 65, 66, 67, 68].forEach(tx => add(tx, 6, tx === 66 ? 'question' : 'brick', tx === 66 ? 'coin' : null));
    [75, 76, 77, 78].forEach(tx => add(tx, 10, tx === 76 ? 'question' : 'brick', tx === 76 ? 'coin' : null));
    [83, 84, 85, 86].forEach(tx => add(tx, 6, tx === 84 ? 'question' : 'brick', tx === 84 ? 'coin' : null));
    // Later 1-1 block clusters, staircases and the final approach.
    [100, 101, 102].forEach(tx => add(tx, 10, 'brick'));
    [104, 105, 106].forEach(tx => add(tx, 6, tx === 105 ? 'question' : 'brick', tx === 105 ? 'coin' : null));
    [112, 113, 114, 115].forEach(tx => add(tx, 10, 'brick'));
    [121, 122, 123, 124].forEach(tx => add(tx, 6, tx === 122 ? 'question' : 'brick', tx === 122 ? 'coin' : null));
    // Hidden 1-Up between the fourth pipe and the first pit.
    blocks.push({ x: 1024, y: 160, w: 16, h: 16, kind: 'hidden', reward: '1up', used: false, broken: false });
    // Mid-course low ten-coin brick, star brick and the second question-block formation.
    add(116,10,'brick','tencoin'); add(119,10,'brick'); add(120,10,'brick','star');
    add(128,6,'brick'); add(129,6,'question','coin'); add(130,6,'brick');
    add(129,10,'question','flower');
    [134,135,136,137,138].forEach(tx => add(tx,10,tx===136?'question':'brick',tx===136?'coin':null));
    // Two hard-block pyramids; the second is split by a pit.
    for (let row=0; row<4; row++) for (let col=row; col<7-row; col++) {
      add(145+col,10-row,'hard');
    }
    for (let row=0; row<4; row++) for (let col=0; col<7; col++) {
      if (col < row || col >= 7-row) add(160+col,10-row,'hard');
    }
    [178,179,180,181].forEach(tx => add(tx,10,tx===181?'question':'brick',tx===181?'coin':null));
    const pipes = [
      { x: 448, height: 2 }, { x: 608, height: 3 }, { x: 752, height: 4 },
      { x: 912, height: 2 }, { x: 2592, height: 2 }, { x: 3136, height: 2 }
    ].map(p => ({ ...p, y: FLOOR - p.height * TILE, w: 32, h: p.height * TILE, kind: 'pipe', enterable: p.x === 752 }));
    const coins = [];
    const addCoin = (tx, ty) => coins.push({ x: tx * TILE + 5, y: ty * TILE + 2, w: 7, h: 12, alive: true });
    [[22,8],[23,8],[24,8],[29,4],[30,4],[31,4],[47,4],[48,4],[49,4],[57,8],[58,8],[59,8],[66,4],[67,4],[68,4],[76,8],[77,8],[84,4],[85,4],[106,4],[107,4],[108,4],[122,4],[123,4],[129,4],[130,4],[131,4]].forEach(([x,y]) => addCoin(x,y));
    const enemyXs = [12, 23, 39, 53, 64, 79, 88, 94, 104, 112, 128, 136, 151, 178, 183, 188];
    const enemies = enemyXs.map((tx, i) => ({ id: i, x: tx * TILE, y: FLOOR - TILE, w: 16, h: 16, vx: -0.55, alive: true, type: 'goomba', state: 'walk' }));
    enemies.push({ id:16, x:146*TILE, y:FLOOR-TILE, w:16, h:16, vx:-0.55, alive:true, type:'koopa', state:'walk' });
    const stairs = [];
    for (let i = 0; i < 8; i++) stairs.push({ x: 3200 + i * TILE, y: FLOOR - (i + 1) * TILE, w: TILE, h: (i + 1) * TILE, kind: 'stair' });
    return {
      width: WIDTH, floor: FLOOR, ground, blocks, pipes, coins, enemies, stairs,
      pits: gaps.map(([a,b]) => ({ x:a*TILE, w:(b-a)*TILE })),
      flagpole: { x: 3472, y: 64, h: 144 }, castle: { x: 3504, y: 144, w: 48, h: 64 }
    };
  }
  const LEVEL = buildLevel();
  function getLevelData() { return clone(LEVEL); }
  function createGame() {
    const level = getLevelData();
    const game = {
      status: 'playing', area: 'main', score: 0, coins: 0, lives: 3, time: 400, camera: 0,
      player: { x: 32, y: FLOOR - 16, w: 12, h: 16, vx: 0, vy: 0, onGround: true, power: 'small', facing: 1, dead: false, invulnerable: 0, coyote: 0, deathFrames: 0 },
      blocks: level.blocks, ground: level.ground, pipes: level.pipes, stairs: level.stairs,
      coinsWorld: level.coins, enemies: level.enemies, powerups: [], fireballs: [], fireCooldown: 0, particles: [],
      pits: level.pits, flagpole: level.flagpole, castle: level.castle, deathHandled: false, prevDown: false, bonusUsed: false
    };
    game.mainArea = { ground:game.ground, blocks:game.blocks, pipes:game.pipes, stairs:game.stairs, coinsWorld:game.coinsWorld, enemies:game.enemies, powerups:game.powerups, pits:game.pits, flagpole:game.flagpole, castle:game.castle };
    return game;
  }
  function enterBonus(game) {
    game.area = 'bonus'; game.camera = 0;
    game.ground = Array.from({length:32},(_,i)=>({x:i*TILE,y:FLOOR,w:TILE,h:32,kind:'ground'}));
    game.blocks = [];
    game.pipes = [{x:480,y:FLOOR-32,w:32,h:32,height:2,kind:'pipe',enterable:false}];
    game.stairs = [];
    game.coinsWorld = Array.from({length:19},(_,i)=>({x:76+(i%10)*34,y:i<10?112:152,w:7,h:12,alive:true}));
    game.enemies = []; game.powerups = []; game.fireballs = []; game.pits = [];
    game.flagpole = null; game.castle = null;
    Object.assign(game.player,{x:32,y:FLOOR-game.player.h,vx:0,vy:0,onGround:true,coyote:0});
  }
  function exitBonus(game) {
    const main = game.mainArea;
    game.area='main';
    game.ground=main.ground;game.blocks=main.blocks;game.pipes=main.pipes;game.stairs=main.stairs;
    game.coinsWorld=main.coinsWorld;game.enemies=main.enemies;game.powerups=main.powerups;game.pits=main.pits;
    game.flagpole=main.flagpole;game.castle=main.castle;
    const entrance=game.pipes.find(pipe=>pipe.enterable);if(entrance)entrance.enterable=false;
    Object.assign(game.player,{x:2624,y:FLOOR-game.player.h,vx:0,vy:0,onGround:true,invulnerable:90,coyote:0});
    game.camera=Math.max(0,Math.min(WIDTH-256,game.player.x-92));game.bonusUsed=true;
  }
  function intersects(a,b) { return a.x < b.x+b.w && a.x+a.w > b.x && a.y < b.y+b.h && a.y+a.h > b.y; }
  function solids(game) {
    return game.ground.concat(game.pipes, game.stairs, game.blocks.filter(b => !b.broken));
  }
  function collideX(game, p, dx) {
    p.x += dx;
    for (const s of solids(game)) if (intersects(p,s)) {
      if (dx > 0) p.x = s.x - p.w;
      else if (dx < 0) p.x = s.x + s.w;
      p.vx = 0;
    }
  }
  function collideY(game, p, dy) {
    p.y += dy; p.onGround = false;
    for (const s of solids(game)) if (intersects(p,s)) {
      if (dy > 0) { p.y = s.y - p.h; p.vy = 0; p.onGround = true; }
      else if (dy < 0) {
        p.y = s.y + s.h; p.vy = 0;
        const b = game.blocks.find(block => block === s);
        if (b && b.kind === 'brick' && p.power !== 'small' && b.reward !== 'tencoin') {
          if (!b.broken) { b.broken = true; game.score += 50; }
        } else if (b && !b.used && !b.broken) {
          b.used = true;
          if (b.reward === 'coin') { game.coins++; game.score += 200; }
          else if (b.reward === 'tencoin') { b.used = false; b.hits = (b.hits || 0) + 1; game.coins++; game.score += 200; if (b.hits >= 10) b.used = true; }
          else if (b.reward === 'mushroom' || b.reward === 'flower') game.powerups.push({ x:b.x, y:b.y-16, w:16, h:16, vx:0.7, vy:0, type:p.power === 'small' ? 'mushroom' : 'flower', active:true });
          else if (b.reward === 'star') game.powerups.push({ x:b.x, y:b.y-16, w:16, h:16, vx:0.7, vy:0, type:'star', active:true });
          else if (b.reward === '1up') game.powerups.push({ x:b.x, y:b.y-16, w:16, h:16, vx:0.7, vy:0, type:'1up', active:true });
        }
      }
    }
  }
  function loseLife(game) {
    if (game.player.dead || game.status !== 'playing') return;
    game.lives = Math.max(0, game.lives - 1);
    game.player.dead = true; game.player.deathFrames = 0; game.player.vx = 0; game.player.vy = -4;
    if (game.lives === 0) game.status = 'over';
  }
  function stepGame(game, input = {}, frames = 1) {
    const count = Math.max(0, Math.floor(frames));
    for (let frame = 0; frame < count && game.status === 'playing'; frame++) {
      const p = game.player;
      game.time = Math.max(0, game.time - 1/60);
      if (game.time === 0 && !game.timeExpired && !p.dead) { game.timeExpired=true; loseLife(game); }
      if (p.dead) {
        p.y += p.vy; p.vy += 0.22; p.deathFrames++;
        if (p.deathFrames >= 55 && game.lives > 0) {
          Object.assign(p, { x:32, y:FLOOR-p.h, vx:0, vy:0, onGround:true, dead:false, invulnerable:90, coyote:0, deathFrames:0 });
          if (game.timeExpired) { game.time=400; game.timeExpired=false; }
          game.camera = 0;
        }
        continue;
      }
      const downPressed = !!input.down && !game.prevDown;
      game.prevDown = !!input.down;
      if (game.area === 'bonus' && p.x >= 432 && input.right) { exitBonus(game); continue; }
      if (game.area === 'main' && !game.bonusUsed && downPressed) {
        const entrance = game.pipes.find(pipe => pipe.enterable && p.x+p.w>pipe.x+2 && p.x<pipe.x+pipe.w-2 && Math.abs(p.y+p.h-pipe.y)<=2);
        if (entrance) { enterBonus(game); continue; }
      }
      if (p.invulnerable > 0) p.invulnerable--;
      if (game.fireCooldown > 0) game.fireCooldown--;
      if (input.fire && p.power === 'fire' && game.fireCooldown === 0) {
        game.fireballs.push({ x:p.facing>0?p.x+p.w:p.x-8, y:p.y+14, w:8, h:8, vx:p.facing*3.2, vy:-1.2, alive:true });
        game.fireCooldown = 18;
      }
      const accel = input.run ? 0.22 : 0.16;
      const max = input.run ? 3.0 : 1.85;
      if (input.left) { p.vx -= accel; p.facing = -1; }
      if (input.right) { p.vx += accel; p.facing = 1; }
      if (!input.left && !input.right) p.vx *= 0.78;
      p.vx = Math.max(-max, Math.min(max, p.vx));
      const jumpPressed = !!input.jump && !game.prevJump;
      if (jumpPressed && (p.onGround || p.coyote > 0)) { p.vy = -5.2; p.onGround = false; p.coyote = 0; }
      else if (p.onGround) p.coyote = 6;
      else p.coyote = Math.max(0, p.coyote - 1);
      if (input.jump && p.vy < -1.2) p.vy -= 0.045;
      game.prevJump = !!input.jump;
      p.vy = Math.min(6.5, p.vy + 0.24);
      collideX(game, p, p.vx);
      collideY(game, p, p.vy);
      if (p.y > 250 || game.pits.some(pit => p.x + p.w > pit.x && p.x < pit.x + pit.w && p.y + p.h >= FLOOR + 2)) { loseLife(game); continue; }
      for (const coin of game.coinsWorld) if (coin.alive && intersects(p,coin)) { coin.alive=false; game.coins++; game.score+=200; }
      for (const e of game.enemies) if (e.alive) {
        if (e.state === 'rolling') e.x += e.vx;
        else if (e.state === 'walk') e.x += e.vx;
        if (e.state === 'walk' || e.state === 'rolling') {
          const wall = solids(game).some(s => intersects({x:e.vx<0?e.x-1:e.x+e.w,y:e.y+2,w:2,h:Math.max(8,e.h-4)},s));
          if (wall) e.vx *= -1;
        }
        if (e.state === 'rolling') {
          for (const other of game.enemies) if (other !== e && other.alive && intersects(e,other)) { other.alive=false; game.score+=100; }
        }
        if (intersects(p,e)) {
          const stomp = p.vy > 0 && p.y + p.h - p.vy <= e.y + 8;
          if (stomp) {
            p.vy = -3.1;
            if (e.type === 'koopa' && e.state === 'walk') { e.state='shell'; e.h=12; e.y+=4; e.vx=0; }
            else if (e.state === 'rolling') { e.state='shell'; e.vx=0; }
            else e.alive=false;
            game.score += 100;
          } else if (e.state === 'shell') {
            e.state='rolling'; e.vx = p.x < e.x ? 4 : -4;
          } else if (p.invulnerable === 0) {
            if (p.power !== 'small') { p.power='small'; p.h=16; p.y+=16; p.invulnerable=90; }
            else loseLife(game);
          }
        }
      }
      for (const fireball of game.fireballs) if (fireball.alive) {
        fireball.x += fireball.vx; fireball.y += fireball.vy; fireball.vy += 0.18;
        if (fireball.y + fireball.h >= FLOOR) { fireball.y=FLOOR-fireball.h; fireball.vy=-2.6; }
        for (const enemy of game.enemies) if (enemy.alive && intersects(fireball,enemy)) { enemy.alive=false; fireball.alive=false; game.score+=100; }
        if (fireball.x < game.camera-20 || fireball.x > WIDTH+20) fireball.alive=false;
      }
      game.fireballs = game.fireballs.filter(fireball => fireball.alive);
      for (const item of game.powerups) if (item.active) {
        item.x += item.vx; item.vy = Math.min(3,item.vy+0.16); item.y += item.vy;
        for (const s of solids(game)) if (intersects(item,s)) { if (item.vy > 0) { item.y=s.y-item.h; item.vy=0; } else item.vx *= -1; }
        if (intersects(p,item)) { item.active=false; if(item.type==='1up') game.lives++; else if(item.type==='star') p.invulnerable=600; else if(item.type==='flower') p.power='fire'; else p.power='big'; if(p.power!=='small'&&p.h===16){p.h=32;p.y-=16;} game.score+=item.type==='1up'?0:1000; }
      }
      if (game.area === 'main' && game.flagpole && p.x + p.w >= game.flagpole.x) { game.status='won'; game.score += Math.max(0,Math.round((FLOOR-p.y)*10)); }
      game.camera = Math.max(0,Math.min((game.area === 'bonus' ? 512 : WIDTH)-256,p.x-92));
    }
    return game;
  }
  return { createGame, stepGame, getLevelData, intersects };
});
