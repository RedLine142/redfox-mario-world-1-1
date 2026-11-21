import Level from 'https://cdn.jsdelivr.net/gh/meth-meth-method/super-mario@a6d8fece2e9e9445f873771adda2c1b17881ed9e/public/js/Level.js';
import Timer from 'https://cdn.jsdelivr.net/gh/meth-meth-method/super-mario@a6d8fece2e9e9445f873771adda2c1b17881ed9e/public/js/Timer.js';
import Pipe from 'https://cdn.jsdelivr.net/gh/meth-meth-method/super-mario@a6d8fece2e9e9445f873771adda2c1b17881ed9e/public/js/traits/Pipe.js';
import {createLevelLoader} from 'https://cdn.jsdelivr.net/gh/meth-meth-method/super-mario@a6d8fece2e9e9445f873771adda2c1b17881ed9e/public/js/loaders/level.js';
import {loadFont} from 'https://cdn.jsdelivr.net/gh/meth-meth-method/super-mario@a6d8fece2e9e9445f873771adda2c1b17881ed9e/public/js/loaders/font.js';
import {loadEntities} from 'https://cdn.jsdelivr.net/gh/meth-meth-method/super-mario@a6d8fece2e9e9445f873771adda2c1b17881ed9e/public/js/entities.js';
import {makePlayer, bootstrapPlayer, resetPlayer, findPlayers} from 'https://cdn.jsdelivr.net/gh/meth-meth-method/super-mario@a6d8fece2e9e9445f873771adda2c1b17881ed9e/public/js/player.js';
import {setupKeyboard} from 'https://cdn.jsdelivr.net/gh/meth-meth-method/super-mario@a6d8fece2e9e9445f873771adda2c1b17881ed9e/public/js/input.js';
import {createColorLayer} from 'https://cdn.jsdelivr.net/gh/meth-meth-method/super-mario@a6d8fece2e9e9445f873771adda2c1b17881ed9e/public/js/layers/color.js';
import {createTextLayer} from 'https://cdn.jsdelivr.net/gh/meth-meth-method/super-mario@a6d8fece2e9e9445f873771adda2c1b17881ed9e/public/js/layers/text.js';
import {createDashboardLayer} from 'https://cdn.jsdelivr.net/gh/meth-meth-method/super-mario@a6d8fece2e9e9445f873771adda2c1b17881ed9e/public/js/layers/dashboard.js';
import {createPlayerProgressLayer} from 'https://cdn.jsdelivr.net/gh/meth-meth-method/super-mario@a6d8fece2e9e9445f873771adda2c1b17881ed9e/public/js/layers/player-progress.js';
import SceneRunner from 'https://cdn.jsdelivr.net/gh/meth-meth-method/super-mario@a6d8fece2e9e9445f873771adda2c1b17881ed9e/public/js/SceneRunner.js';
import Scene from 'https://cdn.jsdelivr.net/gh/meth-meth-method/super-mario@a6d8fece2e9e9445f873771adda2c1b17881ed9e/public/js/Scene.js';
import TimedScene from 'https://cdn.jsdelivr.net/gh/meth-meth-method/super-mario@a6d8fece2e9e9445f873771adda2c1b17881ed9e/public/js/TimedScene.js';
import {connectEntity} from 'https://cdn.jsdelivr.net/gh/meth-meth-method/super-mario@a6d8fece2e9e9445f873771adda2c1b17881ed9e/public/js/traits/Pipe.js';
import Entity from 'https://cdn.jsdelivr.net/gh/meth-meth-method/super-mario@a6d8fece2e9e9445f873771adda2c1b17881ed9e/public/js/Entity.js';
import Trait from 'https://cdn.jsdelivr.net/gh/meth-meth-method/super-mario@a6d8fece2e9e9445f873771adda2c1b17881ed9e/public/js/Trait.js';
import TileCollider from 'https://cdn.jsdelivr.net/gh/meth-meth-method/super-mario@a6d8fece2e9e9445f873771adda2c1b17881ed9e/public/js/TileCollider.js';
import Player from 'https://cdn.jsdelivr.net/gh/meth-meth-method/super-mario@a6d8fece2e9e9445f873771adda2c1b17881ed9e/public/js/traits/Player.js';
import Killable from 'https://cdn.jsdelivr.net/gh/meth-meth-method/super-mario@a6d8fece2e9e9445f873771adda2c1b17881ed9e/public/js/traits/Killable.js';
import {Sides} from 'https://cdn.jsdelivr.net/gh/meth-meth-method/super-mario@a6d8fece2e9e9445f873771adda2c1b17881ed9e/public/js/Entity.js';
import {loadImage} from 'https://cdn.jsdelivr.net/gh/meth-meth-method/super-mario@a6d8fece2e9e9445f873771adda2c1b17881ed9e/public/js/loaders.js';

const UPSTREAM = 'https://cdn.jsdelivr.net/gh/meth-meth-method/super-mario@a6d8fece2e9e9445f873771adda2c1b17881ed9e/public/';

class PowerUp extends Trait {
  constructor(kind) {
    super();
    this.kind = kind;
    this.emerge = 0.55;
    this.collected = false;
  }
  update(entity, gameContext, level) {
    const dt = gameContext.deltaTime;
    if (this.collected) {
      level.entities.delete(entity);
      return;
    }
    if (this.emerge > 0) {
      entity.pos.y -= 30 * dt;
      this.emerge -= dt;
      return;
    }
    entity.pos.x += entity.vel.x * dt;
    level.tileCollider.checkX(entity, gameContext, level);
    entity.pos.y += entity.vel.y * dt;
    level.tileCollider.checkY(entity, gameContext, level);
    entity.vel.y += level.gravity * dt;
  }
  collides(entity, other) {
    if (this.collected || !other.traits.has(Player)) return;
    this.collected = true;
    if (this.kind === 'mushroom') {
      if (!other.powerLevel) {
        other.powerLevel = 1;
        other.size.y = 32;
        other.pos.y -= 16;
      }
      other.sounds.add('powerup');
    } else if (this.kind === 'star') {
      other.starTime = 10;
      other.sounds.add('powerup');
    }
  }
  obstruct(entity, side) {
    if (side === Sides.BOTTOM) {
      entity.vel.y = this.kind === 'star' ? -235 : 0;
    } else if (side === Sides.LEFT || side === Sides.RIGHT) {
      entity.vel.x *= -1;
    }
  }
}

class MarioPowerState extends Trait {
  update(entity, {deltaTime}) {
    entity.starTime = Math.max(0, (entity.starTime || 0) - deltaTime);
    entity.hitInvulnerable = Math.max(0, (entity.hitInvulnerable || 0) - deltaTime);
  }
  collides(entity, other) {
    if (entity.starTime > 0 && other !== entity) {
      const killable = other.traits.get(Killable);
      if (killable && !killable.dead) killable.kill();
    }
  }
}

function drawPowerUp(kind) {
  return function(context) {
    context.save();
    context.imageSmoothingEnabled = false;
    if (kind === 'mushroom') {
      context.fillStyle = '#d62929';
      context.fillRect(2,1,12,6);
      context.fillRect(1,4,14,5);
      context.fillStyle = '#fff';
      context.fillRect(4,3,3,3);
      context.fillRect(10,3,3,3);
      context.fillStyle = '#f3d8a0';
      context.fillRect(4,8,8,6);
      context.fillStyle = '#4b271c';
      context.fillRect(5,9,2,2);
      context.fillRect(10,9,2,2);
      context.fillRect(6,13,4,2);
    } else {
      context.fillStyle = '#f7d52a';
      context.beginPath();
      context.moveTo(8,0); context.lineTo(10,5); context.lineTo(16,6);
      context.lineTo(11,10); context.lineTo(13,16); context.lineTo(8,12);
      context.lineTo(3,16); context.lineTo(5,10); context.lineTo(0,6);
      context.lineTo(6,5); context.closePath(); context.fill();
      context.fillStyle = '#70421b';
      context.fillRect(5,7,2,2); context.fillRect(10,7,2,2);
    }
    context.restore();
  };
}

function makePowerUp(level, match, kind) {
  const item = new Entity();
  item.size.set(16,16);
  item.pos.set(match.x1 + (match.x2-match.x1-16)/2, match.y1-8);
  item.vel.set(kind === 'star' ? 65 : 42, kind === 'star' ? -235 : 0);
  item.addTrait(new PowerUp(kind));
  item.draw = drawPowerUp(kind);
  level.entities.add(item);
}

const originalTileHandle = TileCollider.prototype.handle;
TileCollider.prototype.handle = function(index, entity, match, resolver, gameContext, level) {
  const isMario = entity.traits.has(Player);
  const fromBelow = index === 1 && entity.vel.y < 0;
  if (isMario && match.tile.behavior === 'brick' && !entity.powerLevel) {
    match.tile.behavior = 'ground';
    originalTileHandle.call(this, index, entity, match, resolver, gameContext, level);
    return;
  }
  const isQuestion = isMario && fromBelow && match.tile.style === 'chance' && !match.tile.used;
  originalTileHandle.call(this, index, entity, match, resolver, gameContext, level);
  if (isQuestion) {
    match.tile.used = true;
    match.tile.style = 'metal';
    match.tile.behavior = 'ground';
    const x = match.indexX;
    const y = match.indexY;
    if (x === 22 && y === 9) {
      makePowerUp(level, match, 'mushroom');
    } else if (x === 78 && y === 9) {
      makePowerUp(level, match, 'star');
    } else {
      const player = entity.traits.get(Player);
      player.addCoins(1);
      player.score += 200;
    }
  }
};

async function main(canvas) {
  const videoContext = canvas.getContext('2d');
  const audioContext = new AudioContext();
  const [entityFactory, font, marioSheet] = await Promise.all([
    loadEntities(audioContext),
    loadFont(),
    loadImage(UPSTREAM + 'img/sprites.png'),
  ]);
  const loadLevel = await createLevelLoader(entityFactory);
  const sceneRunner = new SceneRunner();
  const mario = entityFactory.mario();
  makePlayer(mario, 'MARIO');
  mario.powerLevel = 0;
  mario.starTime = 0;
  mario.hitInvulnerable = 0;
  mario.addTrait(new MarioPowerState());
  const killable = mario.traits.get(Killable);
  const originalKill = killable.kill.bind(killable);
  killable.kill = function() {
    if (mario.starTime > 0 || mario.hitInvulnerable > 0) return;
    if (mario.powerLevel > 0) {
      mario.powerLevel = 0;
      mario.size.y = 16;
      mario.pos.y += 16;
      mario.hitInvulnerable = 1.5;
      mario.sounds.add('powerdown');
      return;
    }
    originalKill();
  };
  const smallDraw = mario.draw;
  mario.draw = function(context) {
    if (!this.powerLevel) {
      smallDraw.call(this, context);
      return;
    }
    const go = this.traits.get((this.traits.get.constructor && this.traits.get.constructor) || Object);
    let sx = 112;
    if (this.traits.get) {
      const jump = [...this.traits.values()].find(t => 'falling' in t);
      if (jump && jump.falling) sx = 192;
      else {
        const movement = [...this.traits.values()].find(t => 'distance' in t && 'heading' in t);
        if (movement && movement.distance > 0) sx = 128 + (Math.floor(movement.distance / 8) % 3) * 16;
      }
    }
    context.save();
    if (this.traits.get) {
      const movement = [...this.traits.values()].find(t => 'heading' in t && 'distance' in t);
      if (movement && movement.heading < 0) {
        context.translate(16,0);
        context.scale(-1,1);
      }
    }
    context.drawImage(marioSheet, sx, 88, 16, 32, 0, 0, 16, 32);
    context.restore();
  };

  const inputRouter = setupKeyboard(window);
  inputRouter.addReceiver(mario);
  window.mario = mario;

  function createLoadingScreen(name) {
    const scene = new Scene();
    scene.comp.layers.push(createColorLayer('#000'));
    scene.comp.layers.push(createTextLayer(font, `Loading ${name}...`));
    return scene;
  }

  async function setupLevel(name) {
    const loadingScreen = createLoadingScreen(name);
    sceneRunner.addScene(loadingScreen);
    sceneRunner.runNext();
    const level = await loadLevel(name);
    const spriteIndex = level.comp.layers.findIndex(layer => layer.name === 'drawSpriteLayer');
    if (spriteIndex >= 0) {
      const spriteLayer = level.comp.layers.splice(spriteIndex, 1)[0];
      level.comp.layers.push(spriteLayer);
    }
    bootstrapPlayer(mario, level);
    level.events.listen(Level.EVENT_TRIGGER, (spec, trigger, touches) => {
      if (spec.type === 'goto') {
        for (const _ of findPlayers(touches)) {
          startWorld('1-1');
          return;
        }
      }
    });
    level.events.listen(Pipe.EVENT_PIPE_COMPLETE, async pipe => {
      if (pipe.props.goesTo) {
        const nextLevel = await setupLevel('1-1');
        sceneRunner.addScene(nextLevel);
        sceneRunner.runNext();
        if (pipe.props.backTo) {
          nextLevel.events.listen(Level.EVENT_COMPLETE, async () => {
            const returnLevel = await setupLevel('1-1');
            const exitPipe = returnLevel.entities.get(pipe.props.backTo);
            if (exitPipe) connectEntity(exitPipe, mario);
            sceneRunner.addScene(returnLevel);
            sceneRunner.runNext();
          });
        }
      } else {
        level.events.emit(Level.EVENT_COMPLETE);
      }
    });
    const dashboardLayer = createDashboardLayer(font, mario);
    level.comp.layers.push(dashboardLayer);
    return level;
  }

  function makeWaitScene(level) {
    const playerProgressLayer = createPlayerProgressLayer(font, level);
    const dashboardLayer = createDashboardLayer(font, mario);
    const waitScreen = new TimedScene();
    waitScreen.countDown = 1.5;
    waitScreen.comp.layers.push(createColorLayer('#000'));
    waitScreen.comp.layers.push(dashboardLayer);
    waitScreen.comp.layers.push(playerProgressLayer);
    return waitScreen;
  }

  async function startWorld(name) {
    const level = await setupLevel('1-1');
    resetPlayer(mario, '1-1');
    killable.revive();
    mario.vel.set(0,0);
    mario.powerLevel = 0;
    mario.starTime = 0;
    mario.hitInvulnerable = 0;
    sceneRunner.addScene(makeWaitScene(level));
    sceneRunner.addScene(level);
    sceneRunner.runNext();
    deathHandling = false;
  }

  let deathHandling = false;
  let gameOver = false;
  async function handleDeath() {
    if (deathHandling || gameOver) return;
    deathHandling = true;
    const player = mario.traits.get(Player);
    player.lives = Math.max(0, player.lives - 1);
    if (player.lives <= 0) {
      gameOver = true;
      const overlay = document.getElementById('game-over');
      if (overlay) overlay.style.display = 'flex';
      return;
    }
    await new Promise(resolve => setTimeout(resolve, 900));
    await startWorld('1-1');
  }

  const gameContext = {audioContext, videoContext, entityFactory, deltaTime:null, tick:0};
  const timer = new Timer(1/60);
  timer.update = function(deltaTime) {
    gameContext.tick++;
    gameContext.deltaTime = deltaTime;
    sceneRunner.update(gameContext);
    if (!gameOver && !deathHandling) {
      if (mario.pos.y > 270 && !killable.dead) killable.kill();
      if (killable.dead) handleDeath();
    }
  };
  timer.start();
  startWorld('1-1');

  const gameOverButton = document.getElementById('game-over-restart');
  if (gameOverButton) gameOverButton.addEventListener('click', async () => {
    gameOver = false;
    mario.traits.get(Player).lives = 3;
    mario.traits.get(Player).score = 0;
    mario.traits.get(Player).coins = 0;
    await startWorld('1-1');
    const overlay = document.getElementById('game-over');
    if (overlay) overlay.style.display = 'none';
  });
}

const canvas = document.getElementById('screen');
const start = () => {
  window.removeEventListener('click', start);
  main(canvas).catch(error => {
    console.error('RED FOX Mario startup failed:', error);
    const overlay = document.getElementById('launch');
    if (overlay) {
      overlay.style.display = 'flex';
      overlay.innerHTML = '<strong>ОШИБКА ЗАПУСКА</strong><span>Открой консоль браузера для подробностей</span>';
    }
  });
};
window.addEventListener('click', start);
