export const WHEEL_GEOMETRY={width:512,height:512,rotationCentre:[256,256],visibleDiameter:384,sectorRadius:150,hubRadius:52,labelRadius:108,labelSafeRadius:24,fixedPointer:[256,118]};
export const WHEEL_STATES=['neutral','selected','locked','jammed'];
export function wheelSlots(rotation=0){
  if(!Number.isInteger(rotation))throw Error('Wheel rotation must be an integer sector count');
  return Array.from({length:6},(_,index)=>{const angle=(-90+(index-rotation)*60)*Math.PI/180;return {index,x:256+108*Math.cos(angle),y:256+108*Math.sin(angle)};});
}
export function wheelSector(index){
  const point=(radius,angle)=>[256+radius*Math.cos(angle*Math.PI/180),256+radius*Math.sin(angle*Math.PI/180)].join(',');
  const start=-120+index*60,end=start+60;
  return `M${point(52,start)}L${point(150,start)}A150,150 0 0 1 ${point(150,end)}L${point(52,end)}A52,52 0 0 0 ${point(52,start)}Z`;
}
