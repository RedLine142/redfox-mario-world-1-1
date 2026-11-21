'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { createGame, stepGame, getLevelData } = require('../mario-core.js');

function frames(game, input, n) {
  for (let i = 0; i < n; i++) stepGame(game, input, 1);
}

test('World 1-1 starts at the opening ground with recognizable level landmarks', () => {
  const game = createGame();
  const level = getLevelData();
  assert.equal(game.player.x, 32);
  assert.equal(game.player.onGround, true);
  assert.equal(level.width, 3584);
  assert.deepEqual(level.pipes.slice(0, 3).map(p => [p.x, p.height]), [[448, 2], [608, 3], [752, 4]]);
  assert.equal(level.flagpole.x, 3472);
  assert.equal(level.enemies.length, 17);
  assert.equal(level.enemies.filter(e => e.type === 'koopa').length, 1);
});

test('holding right accelerates Mario and releasing it slows him down', () => {
  const game = createGame();
  frames(game, { right: true, run: false }, 30);
  const movingSpeed = game.player.vx;
  assert.ok(movingSpeed > 1.2 && movingSpeed <= 2.1);
  frames(game, {}, 20);
  assert.ok(game.player.vx < movingSpeed);
});

test('jump input launches Mario and gravity returns him to the ground', () => {
  const game = createGame();
  frames(game, { jump: true }, 1);
  assert.ok(game.player.vy < 0);
  const startY = game.player.y;
  frames(game, {}, 30);
  assert.ok(game.player.y < startY);
  frames(game, {}, 100);
  assert.equal(game.player.onGround, true);
  assert.equal(game.player.y + game.player.h, 208);
});

test('solid pipe collision prevents Mario from walking through it', () => {
  const game = createGame();
  game.player.x = 420;
  frames(game, { right: true, run: true }, 60);
  assert.ok(game.player.x + game.player.w <= 448);
});

test('a question block grants its coin once, then remains spent', () => {
  const game = createGame();
  const block = getLevelData().blocks.find(b => b.kind === 'question' && b.reward === 'coin');
  game.player.x = block.x + 2;
  game.player.y = block.y + 18;
  game.player.vy = -5;
  game.player.onGround = false;
  frames(game, {}, 1);
  assert.equal(game.coins, 1);
  assert.equal(game.score, 200);
  game.player.y = block.y + 18;
  game.player.vy = -5;
  frames(game, {}, 1);
  assert.equal(game.coins, 1);
});

test('stomping a goomba defeats it, while a side collision costs a life', () => {
  const stomp = createGame();
  const enemy = stomp.enemies[0];
  stomp.player.x = enemy.x;
  stomp.player.y = enemy.y - 12;
  stomp.player.vy = 3;
  stomp.player.onGround = false;
  frames(stomp, {}, 1);
  assert.equal(enemy.alive, false);
  assert.equal(stomp.score, 100);

  const side = createGame();
  const foe = side.enemies[0];
  side.player.x = foe.x;
  side.player.y = foe.y;
  side.player.onGround = true;
  frames(side, {}, 1);
  assert.equal(side.lives, 2);
});

test('mushroom pickup changes Mario to big form and awards points', () => {
  const game = createGame();
  game.powerups.push({ x: 80, y: 192, w: 16, h: 16, vx: 0, vy: 0, type: 'mushroom', active: true });
  game.player.x = 80;
  game.player.y = 192;
  frames(game, {}, 1);
  assert.equal(game.player.power, 'big');
  assert.equal(game.player.h, 32);
  assert.equal(game.score, 1000);
});

test('falling into a pit consumes one life and resets Mario', () => {
  const game = createGame();
  game.player.x = 1110;
  game.player.y = 230;
  game.player.vy = 2;
  frames(game, {}, 1);
  assert.equal(game.lives, 2);
  assert.equal(game.player.dead, true);
});

test('reaching the flagpole completes World 1-1', () => {
  const game = createGame();
  game.player.x = 3468;
  game.player.y = 170;
  game.player.vy = 0;
  frames(game, { right: true }, 2);
  assert.equal(game.status, 'won');
});

test('stomping a koopa leaves a shell, and touching the shell kicks it rolling', () => {
  const game = createGame();
  const koopa = game.enemies.find(e => e.type === 'koopa');
  game.player.x = koopa.x;
  game.player.y = koopa.y - 12;
  game.player.vy = 3;
  game.player.onGround = false;
  frames(game, {}, 1);
  assert.equal(koopa.state, 'shell');
  assert.equal(koopa.alive, true);
  assert.equal(koopa.h, 12);

  game.player.x = koopa.x - 10;
  game.player.y = 192;
  game.player.vy = 0;
  game.player.onGround = true;
  frames(game, { right: true }, 1);
  assert.equal(koopa.state, 'rolling');
  assert.ok(koopa.vx > 0);
});

test('big Mario breaks a brick block from below', () => {
  const game = createGame();
  const brick = game.blocks.find(b => b.kind === 'brick');
  game.player.power = 'big';
  game.player.h = 32;
  game.player.x = brick.x + 2;
  game.player.y = brick.y + brick.h + 1;
  game.player.vy = -5;
  game.player.onGround = false;
  frames(game, {}, 1);
  assert.equal(brick.broken, true);
  assert.equal(game.score, 50);
});

test('jumping requires a fresh press rather than auto-bouncing while held', () => {
  const game = createGame();
  frames(game, { jump: true }, 1);
  const launchVy = game.player.vy;
  frames(game, { jump: true }, 45);
  assert.ok(game.player.vy > launchVy);
  assert.equal(game.player.onGround, false);
});

test('Mario respawns at the start after a non-final life is lost', () => {
  const game = createGame();
  game.player.x = 1110;
  game.player.y = 230;
  game.player.vy = 2;
  frames(game, {}, 1);
  assert.equal(game.lives, 2);
  frames(game, {}, 60);
  assert.equal(game.player.dead, false);
  assert.equal(game.player.x, 32);
});

test('the hidden block between the fourth pipe and first pit reveals a 1-Up', () => {
  const game = createGame();
  const hidden = game.blocks.find(b => b.reward === '1up');
  game.player.x = hidden.x + 2;
  game.player.y = hidden.y + hidden.h + 1;
  game.player.vy = -5;
  game.player.onGround = false;
  frames(game, {}, 1);
  assert.equal(game.powerups[0].type, '1up');
  game.player.x = game.powerups[0].x;
  game.player.y = game.powerups[0].y;
  frames(game, {}, 1);
  assert.equal(game.lives, 4);
});

test('the ten-coin brick awards ten coins across ten hits', () => {
  const game = createGame();
  const block = game.blocks.find(b => b.reward === 'tencoin');
  for (let i=0;i<10;i++) {
    block.used=false;
    game.player.x=block.x+2;game.player.y=block.y+block.h+1;game.player.vy=-5;game.player.onGround=false;
    frames(game,{},1);
  }
  assert.equal(game.coins,10);
  assert.equal(block.used,true);
});

test('a flower reward upgrades big Mario to fire form', () => {
  const game = createGame();
  const block = game.blocks.find(b => b.reward === 'flower');
  game.player.power='big';game.player.h=32;
  game.player.x=block.x+2;game.player.y=block.y+block.h+1;game.player.vy=-5;game.player.onGround=false;
  frames(game,{},1);
  assert.equal(game.powerups[0].type,'flower');
  game.player.x=game.powerups[0].x;game.player.y=game.powerups[0].y;
  frames(game,{},1);
  assert.equal(game.player.power,'fire');
});

test('fire Mario shoots a fireball that defeats a Goomba on contact', () => {
  const game = createGame();
  game.player.power='fire';game.player.h=32;game.player.x=100;game.player.y=176;game.player.onGround=true;game.player.facing=1;
  const goomba=game.enemies[0];goomba.x=150;goomba.y=192;goomba.vx=0;
  frames(game,{fire:true},1);
  assert.equal(game.fireballs.length,1);
  frames(game,{},20);
  assert.equal(goomba.alive,false);
  assert.ok(game.score>=100);
});

test('the third pipe opens the 19-coin underground bonus room', () => {
  const game = createGame();
  const entryPipe = game.pipes[2];
  game.player.x = entryPipe.x + 4;
  game.player.y = entryPipe.y - game.player.h;
  game.player.onGround = true;
  frames(game, { down:true }, 1);
  assert.equal(game.area, 'bonus');
  assert.equal(game.coinsWorld.length, 19);
  assert.equal(game.enemies.length, 0);
});

test('leaving the bonus room returns Mario near the fifth pipe', () => {
  const game = createGame();
  const entryPipe = game.pipes[2];
  game.player.x = entryPipe.x + 4;
  game.player.y = entryPipe.y - game.player.h;
  game.player.onGround = true;
  frames(game, { down:true }, 1);
  game.player.x = 432;
  game.player.y = 192;
  frames(game, { right:true }, 1);
  assert.equal(game.area, 'main');
  assert.ok(game.player.x >= 2592);
  assert.equal(game.pipes.some(pipe => pipe.enterable), false);
});

test('coins in the underground room can be collected and add to the shared counter', () => {
  const game = createGame();
  const pipe = game.pipes[2];
  game.player.x=pipe.x+4;game.player.y=pipe.y-game.player.h;game.player.onGround=true;
  frames(game,{down:true},1);
  const coin=game.coinsWorld[0];
  game.player.x=coin.x;game.player.y=coin.y;
  frames(game,{},1);
  assert.equal(coin.alive,false);
  assert.equal(game.coins,1);
});
