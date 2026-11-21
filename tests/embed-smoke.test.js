'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const Core = require('../mario-core.js');
const source = fs.readFileSync(require.resolve('../redfox-mario-embed.js'),'utf8');

function makeElement(extra={}) {
  const listeners = {};
  const classes = new Set();
  return Object.assign({
    dataset:{}, style:{}, textContent:'', innerHTML:'', tabIndex:0, width:768, height:720,
    listeners,
    addEventListener(type,fn){listeners[type]=fn;},
    click(){listeners.click?.({preventDefault(){}});},
    focus(){},
    classList:{add(name){classes.add(name);},remove(name){classes.delete(name);},contains(name){return classes.has(name);}},
    getContext(){return new Proxy({}, {get(target,key){if(key==='measureText')return ()=>({width:0});return (...args)=>{};},set(target,key,value){target[key]=value;return true;}});}
  },extra);
}
function harness() {
  const root=makeElement();
  const canvas=makeElement();
  const overlay=makeElement();
  const start=makeElement();
  const selectors={
    '#rfm-canvas':canvas,'#rfm-score':makeElement(),'#rfm-coins':makeElement(),'#rfm-lives':makeElement(),
    '#rfm-time':makeElement(),'#rfm-overlay':overlay,'#rfm-overlay-title':makeElement(),
    '#rfm-overlay-copy':makeElement(),'#rfm-start':start,'#rfm-status':makeElement()
  };
  root.querySelector=selector=>selectors[selector]||makeElement();
  root.querySelectorAll=()=>[];
  root.addEventListener=(type,fn)=>{root.listeners[type]=fn;};
  const document={
    currentScript:{src:'https://cdn.jsdelivr.net/gh/RedLine142/redfox-mario-world-1-1@abc/redfox-mario-embed.js'},
    getElementById:id=>id==='pp-mario-game'?root:null,
    createElement:()=>makeElement(),
    head:{appendChild(){}},
    addEventListener(){}
  };
  const window={RedFoxMarioCore:Core,addEventListener(){}};
  const context={document,window,URL,requestAnimationFrame:()=>1,console,Set,Math,JSON};
  return {root,canvas,overlay,start,context};
}

test('embed mounts once, renders the game canvas, and starts from the overlay',()=>{
  const h=harness();
  vm.runInNewContext(source,h.context);
  assert.equal(h.root.dataset.marioReady,'1');
  assert.equal(h.canvas.width,768);
  assert.equal(h.canvas.height,720);
  h.start.click();
  assert.equal(h.overlay.classList.contains('is-hidden'),true);
  vm.runInNewContext(source,h.context);
  assert.equal(h.root.dataset.marioMounted,'1');
});
