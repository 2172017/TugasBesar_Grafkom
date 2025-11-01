export function createCanvasApi(canvas){
  const ctx = canvas.getContext("2d", {willReadFrequently:true});
  const W = canvas.width, H = canvas.height;
  let buf = ctx.getImageData(0,0,W,H);

  function clear(){
    ctx.clearRect(0,0,W,H);
    buf = ctx.createImageData(W,H);
  }

  function commit(){ ctx.putImageData(buf,0,0); }
  function getBuffer(){ return buf; }

  function setPixel(x,y,r,g,b,a=255){
    x|=0; y|=0;
    if(x<0||y<0||x>=W||y>=H) return;
    const i=(y*W + x)*4;
    buf.data[i]=r; buf.data[i+1]=g; buf.data[i+2]=b; buf.data[i+3]=a;
  }

  function drawLine(x0,y0,x1,y1, c){
    const [r,g,b,a]=c;
    x0|=0;y0|=0;x1|=0;y1|=0;
    let dx=Math.abs(x1-x0), sx=x0<x1?1:-1;
    let dy=-Math.abs(y1-y0), sy=y0<y1?1:-1;
    let err=dx+dy;
    while(true){
      setPixel(x0,y0,r,g,b,a);
      if(x0===x1&&y0===y1) break;
      let e2=2*err;
      if(e2>=dy){err+=dy; x0+=sx;}
      if(e2<=dx){err+=dx; y0+=sy;}
    }
  }

  function drawCircle(cx,cy,r,color){
    const [R,G,B,A]=color;
    for(let y=-r;y<=r;y++)
      for(let x=-r;x<=r;x++)
        if(x*x+y*y<=r*r) setPixel(cx+x,cy+y,R,G,B,A);
  }

  function drawTriangle(cx,cy,s,ang,color){
    const p0=[cx+Math.cos(ang)*s, cy+Math.sin(ang)*s];
    const p1=[cx+Math.cos(ang+2.3)*s*0.7, cy+Math.sin(ang+2.3)*s*0.7];
    const p2=[cx+Math.cos(ang-2.3)*s*0.7, cy+Math.sin(ang-2.3)*s*0.7];
    const denom=(p1[1]-p2[1])*(p0[0]-p2[0])+(p2[0]-p1[0])*(p0[1]-p2[1]);
    if(Math.abs(denom)<1e-6) return;
    const minX=Math.min(p0[0],p1[0],p2[0]);
    const maxX=Math.max(p0[0],p1[0],p2[0]);
    const minY=Math.min(p0[1],p1[1],p2[1]);
    const maxY=Math.max(p0[1],p1[1],p2[1]);
    for(let y=minY|0;y<=maxY;y++)
      for(let x=minX|0;x<=maxX;x++){
        const a=((p1[1]-p2[1])*(x-p2[0])+(p2[0]-p1[0])*(y-p2[1]))/denom;
        const b=((p2[1]-p0[1])*(x-p2[0])+(p0[0]-p2[0])*(y-p2[1]))/denom;
        const c=1-a-b;
        if(a>=0&&b>=0&&c>=0) setPixel(x,y,...color);
      }
  }

  return {
    W, H,
    clear,
    commit,
    getBuffer,
    setPixel,
    drawLine,
    drawCircle,
    drawTriangle
  };
}


export function dijkstra(nodes,edges,start,goal){
  const dist={}, prev={}, Q=new Set();
  nodes.forEach(n=>{dist[n.id]=1e9; prev[n.id]=null; Q.add(n.id)});
  dist[start]=0;
  while(Q.size){
    let u=[...Q].reduce((a,b)=>dist[a]<dist[b]?a:b);
    Q.delete(u);
    if(u===goal) break;
    for(const e of edges[u]){
      const alt=dist[u]+e.w;
      if(alt<dist[e.to]){dist[e.to]=alt;prev[e.to]=u;}
    }
  }
  if(dist[goal]===1e9) return null;
  let p=[],u=goal; while(u!=null){p.push(u);u=prev[u];}
  return p.reverse();
}

export function floodFill(buf, W, H, x, y, newC) {
  const idx = (y * W + x) * 4;
  const oR = buf.data[idx], oG = buf.data[idx + 1], oB = buf.data[idx + 2];

  // Cegah fill jika warna sama
  if (oR === newC[0] && oG === newC[1] && oB === newC[2]) return;

  // Cegah fill background putih atau canvas kosong
  if (oR === 255 && oG === 255 && oB === 255) return;

  const stack = [[x, y]];
  let count = 0;
  const MAX_FILL = 4000; // node circle only, prevent hang

  while (stack.length && count < MAX_FILL) {
    const [px, py] = stack.pop();
    if (px < 0 || py < 0 || px >= W || py >= H) continue;

    const i = (py * W + px) * 4;
    if (buf.data[i] === oR && buf.data[i + 1] === oG && buf.data[i + 2] === oB) {
      buf.data[i] = newC[0];
      buf.data[i + 1] = newC[1];
      buf.data[i + 2] = newC[2];
      buf.data[i + 3] = 255;

      stack.push([px + 1, py], [px - 1, py], [px, py + 1], [px, py - 1]);
      count++;
    }
  }
}

