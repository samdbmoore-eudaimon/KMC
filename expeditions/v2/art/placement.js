export function fitSpriteInHex(asset,side=40,inset=4) {
  const [left,top,right,bottom]=asset.visibleBounds,width=right-left,height=bottom-top,radius=side-inset;
  const scale=Math.min(Math.sqrt(3)*radius/width,radius/(height/2+width/(2*Math.sqrt(3))));
  return {scale,anchor:[(left+right)/2,(top+bottom)/2],groundOffset:[0,0]};
}

export function standingSpritePlacement(asset,height=66) {
  return {scale:height/(asset.visibleBounds[3]-asset.visibleBounds[1]),anchor:[asset.groundAnchor[0],asset.visibleBounds[3]],groundOffset:[0,8]};
}
