'use strict';
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.RedFoxMarioCore = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  const TILE = 16;
  const FLOOR = 192;
  const WIDTH = 3584;
  const clone = value => JSON.parse(JSON.stringify(value));

  // Decoded original NES World 1-1 metatile map (223 x 13).
  // Grid was extracted by running the original AreaParserCore against the
  // World 1-1 area data; values are original metatile IDs.
  const WORLD_1_1_GRID = [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,128,129,130,0,0,0,0,0,0,0,0,0,0,0,0,0,0,128,129,129,130,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,128,129,130,0,0,0,0,0,0,0,0,0,0,0,0,0,0,128,129,129,130,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,128,129,130,0,0,0,0,0,0,0,0,0,0,0,0,0,0,128,129,129,130,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,128,129,130,0,0,0,0,0,0,0,0,0,0,0,0,0,0,128,129,129,130,0,0,0,0,0,0,0,0,0,0,0,0,0,0,36,0,0,0,0,0,0,0,0,0,0,0,0,128,129,130,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,128,129,130,0,0,0,0,0,0,0,0,131,132,133,0,0,0,0,0,128,129,129,129,130,0,0,0,0,131,132,132,133,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,128,129,130,0,0,0,0,0,0,0,0,131,132,133,0,0,0,0,0,128,129,129,129,130,0,0,0,0,131,132,132,133,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,128,129,130,0,0,0,0,0,0,0,0,131,132,133,0,0,0,0,0,128,129,129,129,130,0,0,0,0,131,132,132,133,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,128,129,130,0,0,0,0,0,0,0,0,131,132,133,0,0,0,0,0,128,129,129,129,130,0,0,0,0,131,132,132,133,0,0,0,0,0,0,0,0,0,0,0,0,0,0,37,0,128,129,130,0,0,0,0,0,0,0,0,131,132,133,0,0,0,0,0,128,129,129,129],[0,0,0,0,0,0,0,0,131,132,133,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,131,132,132,132,133,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,131,132,133,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,131,132,132,132,133,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,131,132,133,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,131,132,132,132,133,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,131,132,133,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,131,132,132,132,133,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,37,0,131,132,133,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,131,132,132,132],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,192,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,81,81,81,81,81,81,81,81,0,0,0,81,81,81,192,0,0,0,0,0,0,0,0,0,0,0,0,0,0,193,0,0,0,0,0,0,0,0,0,0,0,81,81,81,0,0,0,0,81,192,192,81,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,97,97,0,0,0,0,0,0,0,0,37,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,97,97,97,0,0,0,0,0,0,0,0,37,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,97,97,97,97,0,0,0,0,0,0,0,0,37,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,96,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,97,97,97,97,97,0,0,0,0,0,0,0,0,37,0,0,0,0,69,69,69,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,192,0,0,0,81,193,81,192,81,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,18,19,0,0,0,0,0,0,0,0,0,16,17,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,81,193,81,0,0,0,0,0,0,0,0,0,0,0,0,0,0,88,0,0,0,0,0,81,87,0,0,0,0,192,0,0,192,0,0,192,0,0,0,0,0,81,0,0,0,0,0,0,0,0,0,0,81,81,0,0,0,0,0,0,97,0,0,97,0,0,0,0,0,0,0,0,0,0,97,97,0,0,97,0,0,0,0,0,0,0,0,0,0,0,0,81,81,192,81,0,0,0,0,0,0,0,0,0,0,0,0,97,97,97,97,97,97,0,0,0,0,0,0,0,0,37,0,0,0,0,70,71,72,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,7,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,18,19,0,0,0,0,0,0,20,21,0,0,7,0,0,0,0,0,0,20,21,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,7,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,97,97,0,0,97,97,0,0,0,0,7,0,0,0,97,97,97,0,0,97,97,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,97,97,97,97,97,97,97,0,0,0,0,7,0,0,0,37,0,0,0,69,73,73,73,69,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,5,6,8,0,0,0,0,0,0,0,0,0,0,0,0,0,7,0,0,0,0,0,0,0,0,0,0,18,19,0,0,0,0,0,0,0,0,20,21,0,0,0,0,0,0,20,21,0,5,6,8,0,0,0,0,0,20,21,0,0,0,0,0,0,7,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,6,8,0,0,0,0,0,0,0,0,0,0,0,0,0,7,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,97,97,97,0,0,97,97,97,0,0,5,6,8,0,97,97,97,97,0,0,97,97,97,0,0,0,7,0,18,19,0,0,0,0,0,0,0,0,0,0,0,0,0,0,18,19,0,97,97,97,97,97,97,97,97,0,0,0,5,6,8,0,0,37,0,0,0,71,71,74,71,71,0,0,7,0,0,0,0,0,0,0,0,0,0,0,0,0],[5,6,10,9,8,0,0,0,0,0,0,2,3,3,3,4,5,6,8,0,0,0,0,2,3,4,0,0,20,21,0,0,0,0,0,0,0,0,20,21,0,2,3,3,4,0,20,21,5,6,10,9,8,0,0,0,0,20,21,2,3,3,3,4,5,6,8,0,0,0,0,2,3,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,3,4,0,0,0,5,6,10,9,8,0,0,0,0,0,0,2,3,3,3,4,5,6,8,0,0,0,0,2,3,4,0,0,0,0,0,0,0,0,0,0,0,0,97,97,97,97,3,3,97,97,97,97,5,6,10,9,97,97,97,97,97,0,0,97,97,97,97,4,5,6,8,20,21,0,0,2,3,4,0,0,0,0,0,0,0,0,0,20,21,97,97,97,97,97,97,97,97,97,0,0,5,6,10,9,8,0,97,0,0,0,71,71,75,82,71,4,5,6,8,0,0,0,0,2,3,4,0,0,0,0,0],[84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,0,0,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,0,0,0,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,0,0,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84],[84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,0,0,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,0,0,0,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,0,0,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84,84]];
  const WORLD_1_1_ENTITIES = [{"type":"goomba","id":6,"page":0,"col":6,"row":11,"x_in_page":6,"hard_only":false},{"type":"goomba","id":6,"page":1,"col":24,"row":11,"x_in_page":8,"hard_only":false},{"type":"goomba_duo_lo","id":55,"page":2,"col":38,"row":3,"x_in_page":6,"hard_only":false},{"type":"goomba","id":6,"page":5,"col":80,"row":3,"x_in_page":0,"hard_only":false},{"type":"goomba","id":6,"page":5,"col":82,"row":3,"x_in_page":2,"hard_only":false},{"type":"goomba_duo_lo","id":55,"page":6,"col":100,"row":11,"x_in_page":4,"hard_only":false},{"type":"koopa_green","id":0,"page":6,"col":107,"row":11,"x_in_page":11,"hard_only":false},{"type":"goomba_duo_lo","id":55,"page":7,"col":117,"row":11,"x_in_page":5,"hard_only":false},{"type":"goomba_duo_lo","id":55,"page":7,"col":127,"row":11,"x_in_page":15,"hard_only":false},{"type":"goomba_duo_lo","id":55,"page":8,"col":131,"row":11,"x_in_page":3,"hard_only":false},{"type":"goomba_duo_lo","id":55,"page":11,"col":177,"row":11,"x_in_page":1,"hard_only":false}];
  function decodeWorld11Metatiles(grid) {
    const ground = [], blocks = [], pipes = [], stairs = [], coins = [], scenery = [];
    const width = grid[0].length * TILE;
    const cell = (x,y) => grid[y] && grid[y][x] !== undefined ? grid[y][x] : 0;
    // Ground is represented by the original ground metatile rows, preserving pits.
    let run = null;
    for (let x=0; x<grid[0].length; x++) {
      const solid = cell(x,12) === 84;
      if (solid && run === null) run = x;
      if ((!solid || x === grid[0].length-1) && run !== null) {
        const stop = solid && x === grid[0].length-1 ? x+1 : x;
        ground.push({x:run*TILE,y:192,w:(stop-run)*TILE,h:48,kind:'ground'});
        run = null;
      }
    }
    const pipeCells = new Map();
    for (let y=0; y<12; y++) for (let x=0; x<grid[0].length; x++) {
      const id=cell(x,y), px=x*TILE, py=y*TILE;
      if (id===194 || id===195) coins.push({x:px+5,y:py+2,w:7,h:12,alive:true});
      else if (id===192 || id===193 || (id>=81 && id<=96)) {
        const kind = id===192 ? 'question' : id===193 ? 'question' :
          (id===95 || id===96) ? 'hidden' : 'brick';
        const reward = id===192 ? 'coin' : id===193 ? 'mushroom' :
          id===85 || id===90 ? 'vine' : id===86 || id===91 ? 'star' :
          id===87 || id===92 ? 'tencoin' : id===88 || id===93 ? '1up' :
          id===95 ? 'coin' : id===96 ? '1up' : null;
        blocks.push({x:px,y:py,w:TILE,h:TILE,kind,reward,used:false,broken:false,metatile:id});
      } else if (id===97) {
        stairs.push({x:px,y:py,w:TILE,h:TILE,kind:'stair',metatile:id});
      } else if (id===16 || id===18 || id===20) {
        const key=x;
        if (!pipeCells.has(key)) pipeCells.set(key,{x:px,top:py,bottom:py,kind:'pipe',enterable:false});
        const p=pipeCells.get(key); p.top=Math.min(p.top,py);p.bottom=Math.max(p.bottom,py);
      } else if (id!==0 && id!==84 && id!==36 && id!==37 && id!==17 && id!==19 && id!==21) {
        scenery.push({x:px,y:py,w:TILE,h:TILE,id});
      }
    }
    for (const p of pipeCells.values()) pipes.push({x:p.x,y:p.top,w:32,h:p.bottom-p.top+TILE,kind:'pipe',enterable:false});
    // Convert original actor records (page/column/row) to world coordinates.
    const enemies=[];
    for (const actor of WORLD_1_1_ENTITIES) {
      const x=actor.col*TILE, y=actor.row*TILE;
      const add=(type,dx=0)=>enemies.push({id:enemies.length,x:x+dx,y:192-TILE,w:16,h:16,vx:-0.55,alive:true,type,state:'walk'});
      if (actor.type==='koopa_green') add('koopa');
      else if (actor.type==='goomba_duo_lo') { add('goomba'); add('goomba',TILE); }
      else add('goomba');
    }
    const flagCell=[];
    for(let y=0;y<12;y++)for(let x=0;x<grid[0].length;x++)if(cell(x,y)===36||cell(x,y)===37)flagCell.push({x,y,id:cell(x,y)});
    const flagX=flagCell.length?Math.min(...flagCell.map(v=>v.x))*TILE:width-112;
    return {width,floor:192,ground,blocks,pipes,coins,scenery,enemies,stairs,pits:[],flagpole:{x:flagX,y:64,h:128},castle:{x:width-80,y:144,w:48,h:48}};
  }
  function buildLevel() { return decodeWorld11Metatiles(WORLD_1_1_GRID); }
  const LEVEL = buildLevel();
  function getLevelData() { return clone(LEVEL); }
  function createGame() {
    const level = getLevelData();
    const game = {
      status: 'playing', area: 'main', score: 0, coins: 0, lives: 3, time: 400, camera: 0,
      player: { x: 32, y: FLOOR - 16, w: 12, h: 16, vx: 0, vy: 0, onGround: true, power: 'small', facing: 1, dead: false, invulnerable: 0, coyote: 0, deathFrames: 0 },
      blocks: level.blocks, ground: level.ground, pipes: level.pipes, stairs: level.stairs,
      coinsWorld: level.coins, scenery: level.scenery, enemies: level.enemies, powerups: [], fireballs: [], fireCooldown: 0, particles: [],
      pits: level.pits, flagpole: level.flagpole, castle: level.castle, deathHandled: false, prevDown: false, prevJump: false, jumpBuffer: 0, bonusUsed: false
    };
    game.mainArea = { ground:game.ground, blocks:game.blocks, pipes:game.pipes, stairs:game.stairs, coinsWorld:game.coinsWorld, scenery:game.scenery, enemies:game.enemies, powerups:game.powerups, pits:game.pits, flagpole:game.flagpole, castle:game.castle };
    return game;
  }
  function enterBonus(game) {
    game.area = 'bonus'; game.camera = 0;
    game.ground = Array.from({length:32},(_,i)=>({x:i*TILE,y:FLOOR,w:TILE,h:32,kind:'ground'}));
    game.blocks = []; game.scenery = [];
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
    game.coinsWorld=main.coinsWorld;game.scenery=main.scenery;game.enemies=main.enemies;game.powerups=main.powerups;game.pits=main.pits;
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
    const steps = Math.max(1, Math.ceil(Math.abs(dx) / 4));
    const part = dx / steps;
    const all = solids(game);
    for (let n = 0; n < steps; n++) {
      p.x += part;
      for (const s of all) if (intersects(p, s)) {
        if (part > 0) p.x = s.x - p.w;
        else if (part < 0) p.x = s.x + s.w;
        p.vx = 0;
      }
    }
  }
  function hitBlock(game, p, b) {
    if (!b || b.broken || b.kind === 'hidden' && b.used) return;
    if (b.kind === 'brick' && p.power !== 'small' && b.reward !== 'tencoin') {
      b.broken = true; game.score += 50;
      game.particles.push({x:b.x,y:b.y,vx:-1.2,vy:-2,life:18});
      game.particles.push({x:b.x+8,y:b.y,vx:1.2,vy:-2.5,life:18});
      return;
    }
    if (b.used) return;
    b.used = true;
    if (b.reward === 'coin' || b.reward === 'tencoin') {
      game.coins++; game.score += 200;
      if (b.reward === 'tencoin') { b.used = false; b.hits = (b.hits || 0) + 1; if (b.hits >= 10) b.used = true; }
    } else if (b.reward === 'mushroom' || b.reward === 'flower') {
      game.powerups.push({x:b.x,y:b.y-16,w:16,h:16,vx:0.65,vy:-1.8,type:p.power==='small'?'mushroom':'flower',active:true});
    } else if (b.reward === 'star' || b.reward === '1up') {
      game.powerups.push({x:b.x,y:b.y-16,w:16,h:16,vx:0.65,vy:-1.8,type:b.reward,active:true});
    }
  }
  function collideY(game, p, dy) {
    const steps = Math.max(1, Math.ceil(Math.abs(dy) / 4));
    const part = dy / steps;
    const all = solids(game);
    p.onGround = false;
    for (let n = 0; n < steps; n++) {
      p.y += part;
      for (const s of all) if (intersects(p, s)) {
        if (part > 0) {
          p.y = s.y - p.h; p.vy = 0; p.onGround = true;
        } else if (part < 0) {
          p.y = s.y + s.h; p.vy = 0;
          hitBlock(game, p, game.blocks.find(block => block === s));
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
      const accel = input.run ? 0.105 : 0.075;
      const max = input.run ? 2.75 : 1.65;
      if (input.left) { p.vx -= accel; p.facing = -1; }
      if (input.right) { p.vx += accel; p.facing = 1; }
      if (!input.left && !input.right) {
        p.vx *= p.onGround ? 0.72 : 0.94;
        if (Math.abs(p.vx) < 0.035) p.vx = 0;
      }
      p.vx = Math.max(-max, Math.min(max, p.vx));
      const jumpPressed = !!input.jump && !game.prevJump;
      if (jumpPressed) game.jumpBuffer = 7;
      else game.jumpBuffer = Math.max(0, game.jumpBuffer - 1);
      if (p.onGround) p.coyote = 7;
      else p.coyote = Math.max(0, p.coyote - 1);
      if (game.jumpBuffer > 0 && (p.onGround || p.coyote > 0)) {
        p.vy = p.power === 'small' ? -5.25 : -5.45;
        p.onGround = false; p.coyote = 0; game.jumpBuffer = 0;
      }
      if (!input.jump && p.vy < -1.4) p.vy *= 0.58;
      game.prevJump = !!input.jump;
      p.vy = Math.min(6.2, p.vy + (p.vy < 0 ? 0.23 : 0.34));
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
