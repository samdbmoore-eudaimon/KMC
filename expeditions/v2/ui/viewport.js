export const SIDE=40;
export const MIN_ZOOM=0.45;
export const MAX_ZOOM=2;
export function projectHex(hex,side=SIDE) {
  const [q,r]=typeof hex==='string'?hex.split(',').map(Number):[hex.q,hex.r];
  return {x:Math.sqrt(3)*side*(q+r/2),y:1.5*side*r};
}
export function hexVertices(hex,side=SIDE) {
  const centre=projectHex(hex,side);
  return Array.from({length:6},(_,i)=>{const a=(-90+i*60)*Math.PI/180;return {x:centre.x+Math.cos(a)*side,y:centre.y+Math.sin(a)*side};});
}
export const polygonPoints=(hex,side=SIDE)=>hexVertices(hex,side).map(p=>`${p.x},${p.y}`).join(' ');
export function worldBounds(tiles,side=SIDE) {
  const points=tiles.flatMap(t=>hexVertices(t,side));
  return {left:Math.min(...points.map(p=>p.x))-side,top:Math.min(...points.map(p=>p.y))-side*2,right:Math.max(...points.map(p=>p.x))+side,bottom:Math.max(...points.map(p=>p.y))+side};
}
export function overviewCamera(bounds,width,height) {
  const scale=Math.max(MIN_ZOOM,Math.min(1,(width-32)/(bounds.right-bounds.left),(height-32)/(bounds.bottom-bounds.top)));
  return {scale,x:width/2-(bounds.left+bounds.right)*scale/2,y:height/2-(bounds.top+bounds.bottom)*scale/2};
}
export function clampCamera(camera,bounds,width,height) {
  const scale=Math.max(MIN_ZOOM,Math.min(MAX_ZOOM,camera.scale));
  const axis=(offset,min,max,size)=>{
    const extent=(max-min)*scale;
    if(extent<size)return size/2-(min+max)*scale/2;
    return Math.max(size-max*scale,Math.min(-min*scale,offset));
  };
  return {scale,x:axis(camera.x,bounds.left,bounds.right,width),y:axis(camera.y,bounds.top,bounds.bottom,height)};
}
export function zoomCamera(camera,factor,point) {
  const scale=Math.max(MIN_ZOOM,Math.min(MAX_ZOOM,camera.scale*factor)),ratio=scale/camera.scale;
  return {scale,x:point.x-(point.x-camera.x)*ratio,y:point.y-(point.y-camera.y)*ratio};
}
export function viewportCamera(camera,previous,next,bounds) {
  if(!previous||previous.runId!==next.runId)return next.width<600?overviewCamera(bounds,next.width,next.height):clampCamera({scale:1,x:next.width/2-(bounds.left+bounds.right)/2,y:next.height/2-(bounds.top+bounds.bottom)/2},bounds,next.width,next.height);
  return clampCamera({...camera,x:camera.x+(next.width-previous.width)/2,y:camera.y+(next.height-previous.height)/2},bounds,next.width,next.height);
}
export function screenToWorld(point,camera){return {x:(point.x-camera.x)/camera.scale,y:(point.y-camera.y)/camera.scale};}
export function containsHex(point,hex,side=SIDE) {
  const vertices=hexVertices(hex,side);let sign=0;
  for(let i=0;i<6;i++){const a=vertices[i],b=vertices[(i+1)%6],cross=(b.x-a.x)*(point.y-a.y)-(b.y-a.y)*(point.x-a.x);if(Math.abs(cross)<1e-8)continue;const current=Math.sign(cross);if(sign&&current!==sign)return false;sign=current;}
  return true;
}
export const hitHex=(point,camera,tiles)=>tiles.find(t=>containsHex(screenToWorld(point,camera),t))||null;
