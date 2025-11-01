import {createCanvasApi, dijkstra, floodFill} from "./lib/graflib.js";

const cv = document.getElementById("canvas");
const api = createCanvasApi(cv);

let nodes = [];
let edges = {};
let last = null;
let start = null;
let goal = null;
const R = 12;

// UI
const bReset = document.getElementById("btn-reset");
const bStart = document.getElementById("btn-set-start");
const bGoal = document.getElementById("btn-set-goal");
const bRun = document.getElementById("btn-run");

let mode = "idle";

bReset.onclick = () => {
  nodes = [];
  edges = {};
  last = null;
  start = goal = null;
  draw();
};

// mode selection
bStart.onclick = () => { mode = "start"; bStart.classList.add("active"); bGoal.classList.remove("active"); };
bGoal.onclick = () => { mode = "goal"; bGoal.classList.add("active"); bStart.classList.remove("active"); };

// find node
function hit(x,y){
  return nodes.find(n => Math.hypot(n.x-x, n.y-y) <= R+2);
}

// interaksi canvas
cv.onclick = e => {
  const r=cv.getBoundingClientRect();
  const x=e.clientX-r.left, y=e.clientY-r.top;
  const h=hit(x,y);

// start
  if(mode==="start" && h){
    start = h.id;
    mode="idle";
    bStart.classList.remove("active");
    draw();
    return;
  }

// goal
  if(mode==="goal" && h){
    goal = h.id;
    mode="idle";
    bGoal.classList.remove("active");
    draw();
    return;
  }

// buat node atau sambung
  if(!h){
    const id = nodes.length+1;
    const n = {id,x,y};
    nodes.push(n);
    edges[id] = edges[id] || [];

    if(last && last.id!==id){
      const w=Math.hypot(last.x-x,last.y-y)|0;
      edges[last.id].push({to:id,w});
      edges[id].push({to:last.id,w});
    }
    last = n;

  } else {
// clicked node connects
    if(last && last.id!==h.id){
      const w=Math.hypot(last.x-h.x,last.y-h.y)|0;
      if(!edges[last.id].some(e=>e.to===h.id)){
        edges[last.id].push({to:h.id,w});
        edges[h.id].push({to:last.id,w});
      }
    }
    last = h;
  }

  draw();
};

// gambar nodes & edges
function draw(keep=false){
  api.clear();

  // edges
  for(const u in edges){
    const A = nodes.find(n=>n.id==u);
    edges[u].forEach(e=>{
      const B = nodes.find(n=>n.id==e.to);
      api.drawLine(A.x,A.y,B.x,B.y,[190,190,190,255]);
    });
  }

  // nodes
  nodes.forEach(n=>{
    api.drawCircle(n.x,n.y,R,[235,235,235,255]);
    if(n.id===start) api.drawCircle(n.x,n.y,6,[0,200,0,255]);
    else if(n.id===goal) api.drawCircle(n.x,n.y,6,[220,60,60,255]);
    else api.drawCircle(n.x,n.y,3,[0,0,0,255]);
  });

  api.commit();
}

// Run Dijkstra
bRun.onclick = () => {
  if(start==null || goal==null) return alert("Pilih start & goal dulu!");

  const path = dijkstra(nodes,edges,start,goal);
  if(!path) return alert("Tidak ada jalur");

  draw();
  
  // flood fill each node on path
  const buf = api.getBuffer();
  for(const pid of path){
    const n = nodes.find(a=>a.id===pid);
    floodFill(buf, api.W, api.H, n.x, n.y, [255,180,0,255]);
  }
  api.commit();

  animate(path);
};

// animasi segitiga sepanjang path
function animate(path) {
  let i = 0, t = 0;
  const SPEED = 10; // atur kecepatan animasi di sini

  function step(){
    if(i >= path.length - 1) return;

    const A = nodes.find(n=>n.id===path[i]);
    const B = nodes.find(n=>n.id===path[i+1]);

    t += 1 / SPEED;
    if(t >= 1){
      t = 0;
      i++;
      if(i >= path.length - 1) return;
    }

    const x = A.x + (B.x - A.x) * t;
    const y = A.y + (B.y - A.y) * t;

    draw();
    api.drawTriangle(x,y,12,Math.atan2(B.y-A.y,B.x-A.x),[50,90,255,255]);
    api.commit();

    requestAnimationFrame(step);
  }

  step();
}


draw();
