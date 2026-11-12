import PaintedButton from './PaintedButton.jsx';
import React,{useEffect,useMemo,useRef,useState} from 'react';
import {SIDE,projectHex,polygonPoints,worldBounds,overviewCamera,clampCamera,zoomCamera,viewportCamera,hitHex} from './viewport.js';
import {entityName} from './feedback.js';
import StationGlyph from './StationGlyph.jsx';
import StationStatus from './StationStatus.jsx';
import StationLabels from './StationLabels.jsx';
import {stationPresentation} from './station-state.js';
import {ORCHARD_SCENE_KIT as kit} from '../art/scene-kit.js';
import {actionGuide} from './action-guide.js';
import {MOVEMENT_COLOUR} from './movement-view.js';
import {riverLayout} from './river-layout.js';
import {RiverSurface,PaintedWalls,RiverBridge} from './RiverTerrain.jsx';
import RotationBoard from './RotationBoard.jsx';
import PackingBoard from './PackingBoard.jsx';
import BalanceBoard from './BalanceBoard.jsx';
import RoostBoard from './RoostBoard.jsx';
import SelectedHeroInfo from './SelectedHeroInfo.jsx';
const colours={floor:'#809967',path:'#c7b183',clearing:'#96a775',roots:'#796447',water:'#467b88',hedge:'#355c39',bridge:'#c4a46b',gate:'#806547'};

export default function MapViewport({state,selectedHero,selectedObject,reachable=[],movementMode=false,movementPreview=null,forecast,onSelect,onMoveTarget,focusRequest,artFor=null,checklist=[],guide=null,lastResult=null,terrainArtMode='candidate',showTerrainGrid=true}) {
  const host=useRef(null),findMenu=useRef(null),pointers=useRef(new Map()),gesture=useRef(null),cameraRef=useRef(null),cameraViewport=useRef(null);
  const [size,setSize]=useState({width:0,height:0}),[camera,setCamera]=useState({x:0,y:0,scale:1}),[locked,setLocked]=useState(false),[minimap,setMinimap]=useState(false),[overlays,setOverlays]=useState([]),[infoObstacles,setInfoObstacles]=useState([]);
  const hoverDismiss=useRef(null);
  const [inspection,setInspection]=useState(null),[hoveredHex,setHoveredHex]=useState(null);
  const bounds=useMemo(()=>worldBounds(state.blueprint.tiles),[state.blueprint]);
  const rivers=useMemo(()=>new Map(riverLayout(state.blueprint.tiles).map(row=>[row.hex,row])),[state.blueprint]);
  const candidate=terrainArtMode==='candidate';
  cameraRef.current=camera;
  const update=next=>setCamera(clampCamera(next,bounds,size.width,size.height));
  useEffect(()=>{const resize=()=>{if(host.current)setSize({width:host.current.clientWidth,height:host.current.clientHeight});};resize();const observer=new ResizeObserver(resize);if(host.current)observer.observe(host.current);return()=>observer.disconnect();},[]);
  useEffect(()=>{if(!size.width||!size.height)return;const next={...size,runId:state.runId},previous=cameraViewport.current;cameraViewport.current=next;setCamera(current=>viewportCamera(current,previous,next,bounds));},[bounds,size.width,size.height,state.runId]);
  useEffect(()=>{const wrap=host.current?.parentElement;if(!wrap)return;const nodes=[...wrap.querySelectorAll('.ov-checklist,.ov-camera-controls,.ov-board-list,.ov-offscreen,.ov-guide,.ov-minimap')],infoNodes=[...wrap.querySelectorAll('[data-station-popup],[data-pan-station] rect,[data-pan-summary] rect')];const measure=()=>{const map=host.current.getBoundingClientRect(),rectangles=elements=>elements.map(node=>{const rect=node.getBoundingClientRect();return {x:rect.x-map.x,y:rect.y-map.y,width:rect.width,height:rect.height};}).filter(rect=>rect.width&&rect.height);setOverlays(rectangles(nodes));setInfoObstacles(rectangles(infoNodes));};measure();const observer=new ResizeObserver(measure);[...nodes,...infoNodes].forEach(node=>observer.observe(node));return()=>observer.disconnect();},[size.width,size.height,state.revision,guide,minimap,camera.x,camera.y,camera.scale,inspection,hoveredHex]);
  useEffect(()=>{if(!focusRequest)return;const station=state.blueprint.stations.find(s=>s.id===focusRequest.id);setInspection(station?.id||null);if(locked)return;const p=projectHex(focusRequest.hex);update({...cameraRef.current,x:size.width/2-p.x*cameraRef.current.scale,y:size.height/2-p.y*cameraRef.current.scale});},[focusRequest,locked]);
  const point=event=>{const rect=host.current.getBoundingClientRect();return {x:event.clientX-rect.left,y:event.clientY-rect.top};};
  const movement=new Set(reachable.map(t=>t.destination));
  const travelCosts=new Map(reachable.map(target=>[target.destination,target.cost]));
  const threats=forecast?.intents?.map(intent=>({id:intent.enemyId,hex:state.enemyStates.find(e=>e.id===intent.enemyId)?.position,label:entityName(state,intent.enemyId)})).filter(t=>t.hex)||[];
  const entities=[...state.blueprint.stations.map(s=>({id:s.id,hex:s.hex,kind:'station',name:s.name})),{id:'orchard',hex:state.blueprint.orchard.hex,kind:'orchard',name:state.blueprint.orchard.name},...state.heroes.map(h=>({...h,hex:h.position,kind:'hero',name:state.profiles[h.id].name})),...state.enemyStates.map(e=>({...e,hex:e.position,kind:'enemy',name:entityName(state,e.id)}))].sort((a,b)=>projectHex(a.hex).y-projectHex(b.hex).y||Number(['hero','enemy'].includes(a.kind))-Number(['hero','enemy'].includes(b.kind))||(a.id<b.id?-1:1));
  const bridges=candidate?state.blueprint.tiles.filter(t=>t.terrain==='bridge'&&rivers.get(`${t.q},${t.r}`)?.kind).map(t=>({id:`bridge-${t.q}-${t.r}`,hex:`${t.q},${t.r}`,kind:'bridge',tile:t})):[];
  const paintables=[...bridges,...entities].sort((a,b)=>projectHex(a.hex).y-projectHex(b.hex).y||(a.kind==='bridge'?-1:b.kind==='bridge'?1:0)||Number(['hero','enemy'].includes(a.kind))-Number(['hero','enemy'].includes(b.kind)));
  useEffect(()=>{if(movementMode){clearTimeout(hoverDismiss.current);hoverDismiss.current=null;setInspection(null);setHoveredHex(null);}},[movementMode]);
  const activeStationId=state.blueprint.stations.find(s=>s.hex===hoveredHex)?.id||inspection;
  const hoverStation=hex=>{if(hex){clearTimeout(hoverDismiss.current);hoverDismiss.current=null;setHoveredHex(hex);}else if(!hoverDismiss.current)hoverDismiss.current=setTimeout(()=>{setHoveredHex(null);hoverDismiss.current=null;},200);};
  useEffect(()=>()=>clearTimeout(hoverDismiss.current),[]);
  const inspectStation=station=>{setInspection(id=>id===station.id?null:station.id);setHoveredHex(null);};
  function activateHex(hex) {
    const entity=entities.filter(e=>e.hex===hex).find(e=>e.kind==='hero'||e.kind==='enemy')||entities.find(e=>e.hex===hex);
    const wheel=state.blueprint.puzzle.kind==='equation-wheels'&&state.blueprint.puzzle.tokens.find(t=>t.hex===hex&&t.faces&&!t.given);
    if(movementMode&&movement.has(hex)){setInspection(null);setHoveredHex(null);onMoveTarget(hex);}
    else if(entity?.kind==='station')inspectStation(entity);
    else if(wheel&&!entity){setInspection(null);setHoveredHex(null);onSelect({...wheel,kind:'wheel',name:`Wheel ${wheel.id}`});}
    else if(!entity&&state.blueprint.puzzle.kind==='polyhex'&&state.blueprint.puzzle.patchCells.includes(hex)){setInspection(null);setHoveredHex(null);onSelect({id:hex,hex,kind:'packing-cell',name:`Branch anchor ${hex}`});}
    else {setInspection(null);setHoveredHex(null);if(entity)onSelect(entity);else if(movement.has(hex))onMoveTarget(hex);else onSelect({id:hex,hex,kind:'tile',name:`Hex ${hex}`});}
  }
  function pointerDown(event) {
    if(event.button!==0&&event.button!==1)return;
    host.current.setPointerCapture(event.pointerId);const p=point(event);pointers.current.set(event.pointerId,p);
    if(pointers.current.size===1)gesture.current={start:p,last:p,camera:{...cameraRef.current},drag:false,middle:event.button===1};
    else {const [a,b]=[...pointers.current.values()];gesture.current={pinch:true,distance:Math.hypot(a.x-b.x,a.y-b.y),centre:{x:(a.x+b.x)/2,y:(a.y+b.y)/2},drag:true};}
  }
  function pointerMove(event) {
    if(!pointers.current.has(event.pointerId)||!gesture.current){if(event.pointerType==='mouse'){const tile=hitHex(point(event),cameraRef.current,state.blueprint.tiles);hoverStation(!movementMode&&tile&&state.blueprint.stations.some(s=>s.hex===`${tile.q},${tile.r}`)?`${tile.q},${tile.r}`:null);}return;}
    const p=point(event);pointers.current.set(event.pointerId,p);const g=gesture.current;
    if(pointers.current.size>=2){const [a,b]=[...pointers.current.values()],distance=Math.hypot(a.x-b.x,a.y-b.y),centre={x:(a.x+b.x)/2,y:(a.y+b.y)/2};if(g.distance){const next=zoomCamera(cameraRef.current,distance/g.distance,g.centre);update({...next,x:next.x+centre.x-g.centre.x,y:next.y+centre.y-g.centre.y});}g.distance=distance;g.centre=centre;g.pinch=true;g.drag=true;return;}
    if(g.pinch)return;
    if(Math.hypot(p.x-g.start.x,p.y-g.start.y)>8||g.middle)g.drag=true;
    if(g.drag)update({...g.camera,x:g.camera.x+p.x-g.start.x,y:g.camera.y+p.y-g.start.y});
  }
  function pointerUp(event) {
    const g=gesture.current,p=point(event);pointers.current.delete(event.pointerId);
    if(!g?.drag&&!g?.pinch&&event.type!=='pointercancel') {
      const tile=hitHex(p,cameraRef.current,state.blueprint.tiles);
      if(tile)activateHex(`${tile.q},${tile.r}`);else {setInspection(null);setHoveredHex(null);}
    }
    if(!pointers.current.size)gesture.current=null;
  }
  useEffect(()=>{
    const element=host.current;if(!element)return;
    const wheel=event=>{event.preventDefault();const rect=element.getBoundingClientRect(),p={x:event.clientX-rect.left,y:event.clientY-rect.top};const next=event.ctrlKey?zoomCamera(cameraRef.current,Math.exp(-event.deltaY*0.002),p):{...cameraRef.current,x:cameraRef.current.x-event.deltaX,y:cameraRef.current.y-event.deltaY};setCamera(clampCamera(next,bounds,size.width,size.height));};
    element.addEventListener('wheel',wheel,{passive:false});return()=>element.removeEventListener('wheel',wheel);
  },[bounds,size]);
  function keyDown(event) {
    if(event.key==='Escape'){setInspection(null);setHoveredHex(null);return;}
    if(event.target!==host.current)return;
    const step={ArrowLeft:[60,0],ArrowRight:[-60,0],ArrowUp:[0,60],ArrowDown:[0,-60]}[event.key];
    if(step){event.preventDefault();update({...camera,x:camera.x+step[0],y:camera.y+step[1]});}
    if(['+','=','-','Home'].includes(event.key)){event.preventDefault();event.key==='Home'?setCamera(overviewCamera(bounds,size.width,size.height)):update(zoomCamera(camera,event.key==='-'?0.8:1.25,{x:size.width/2,y:size.height/2}));}
  }
  const centreOn=hex=>{if(findMenu.current)findMenu.current.open=false;const p=projectHex(hex);update({...camera,x:size.width/2-p.x*camera.scale,y:size.height/2-p.y*camera.scale});};
  return <div className="ov-map-wrap">
    <div className="ov-map" ref={host} tabIndex={0} role="region" aria-label="Battlefield: arrow keys pan, plus and minus zoom, Home shows overview" onKeyDown={keyDown} onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerUp} onPointerCancel={pointerUp} onPointerLeave={()=>hoverStation(null)}>
      <svg width="100%" height="100%" viewBox={`0 0 ${size.width} ${size.height}`} aria-label="Orchard battlefield" data-terrain-art={candidate?'candidate':'legacy'} data-camera-scale={camera.scale} data-river-unsupported={candidate?[...rivers.values()].filter(r=>!r.kind).length:undefined}>
        <defs><clipPath id="ov-river-field"><path d={state.blueprint.tiles.map(t=>`M${polygonPoints(t).replaceAll(' ','L')}Z`).join('')}/></clipPath></defs>
        <defs><radialGradient id="ov-field"><stop stopColor="#6d8a59"/><stop offset="1" stopColor="#284534"/></radialGradient>{['grass','path','roots','water','hedge','bridge'].map(id=><pattern key={id} id={`ov-material-${id}`} patternUnits="objectBoundingBox" width="1" height="1" viewBox="28 26 328 248" preserveAspectRatio="xMidYMid slice"><rect width="384" height="384" fill={id==='water'?'#4d8791':'#83915b'}/><image href={kit[id]} width="384" height="384"/></pattern>)}</defs><image href={kit.gorge} width={size.width} height={size.height} preserveAspectRatio="xMidYMid slice"/><rect width={size.width} height={size.height} fill="#18362b44"/>
        <g transform={`translate(${camera.x} ${camera.y}) scale(${camera.scale})`}>
          {state.blueprint.tiles.toSorted((a,b)=>a.r-b.r||a.q-b.q).map(tile=>{const hex=`${tile.q},${tile.r}`,p=projectHex(tile),vertices=polygonPoints(tile),river=candidate?rivers.get(hex):null,station=state.blueprint.stations.find(st=>st.hex===hex),newBridge=tile.terrain==='bridge'&&river?.kind,closed=tile.passageOutputId&&!state.passages[hex]?.open;return <g key={hex}>
            {candidate?<PaintedWalls tile={tile} tiles={state.blueprint.tiles}/>:<polygon points={vertices} transform="translate(0 9)" fill="#65583c" stroke="#273728" strokeWidth="2"/>}<polygon points={vertices} fill={`url(#ov-material-${({floor:'grass',clearing:'grass',gate:'hedge'})[tile.terrain]||tile.terrain})`} stroke={showTerrainGrid?'#4b5635':'none'} strokeWidth="1.4"/>{station&&<polygon data-station-footprint={station.id} points={vertices} fill="#ffe4a00c" stroke={station.id===activeStationId?'#fff5be':'#d3bd82'} strokeWidth={station.id===activeStationId?3:1.5} vectorEffect="non-scaling-stroke"/>}{river?.kind&&<g clipPath="url(#ov-river-field)"><RiverSurface layout={river}/></g>}{closed&&!newBridge&&<polygon points={vertices} fill="#352d2988"/>}
            {tile.terrain==='roots'&&<path d={`M${p.x-22},${p.y+12}q20,-30 44,-10 M${p.x-20},${p.y-14}q35,15 12,35`} fill="none" stroke="#c4a67b" strokeWidth="4"/>}
            {movement.has(hex)&&<polygon points={vertices} fill={MOVEMENT_COLOUR+'66'} stroke={MOVEMENT_COLOUR} strokeWidth="3" vectorEffect="non-scaling-stroke"/>}
            {selectedObject?.hex===hex&&<polygon points={vertices} fill="none" stroke="#fff4cf" strokeWidth="4"/>}
            {tile.passageOutputId&&!newBridge&&<text x={p.x} y={p.y+6} textAnchor="middle" fontSize="18" fill="#fff2c5">{state.passages[hex]?.closingPending?'⏳':closed?'×':'↔'}<title>{state.passages[hex]?.closingPending?'Passage remains open until occupying figures leave':closed?'Passage closed':'Passage open'}</title></text>}
            <polygon points={vertices} fill="transparent" role="button" tabIndex={0} aria-label={`${movement.has(hex)?'Reachable hex':'Hex'} ${hex}`} aria-description={movement.has(hex)?'Reachable in one action point. Preview this destination.':undefined} data-movement-cost={travelCosts.get(hex)} data-hit-hex={hex} data-station-target={station?.id} aria-describedby={station?.id===activeStationId?`ov-station-tooltip-${station.id}`:undefined} onFocus={()=>station&&!movementMode&&hoverStation(hex)} onBlur={event=>{if(event.relatedTarget?.closest?.('[data-station-popup]'))setInspection(station?.id||null);setHoveredHex(null);}} onKeyDown={event=>{if(!['Enter',' '].includes(event.key))return;event.preventDefault();activateHex(hex);}}/>
          </g>;})}
          <RotationBoard state={state} selectedId={selectedObject?.kind==='wheel'?selectedObject.id:null}/>
          <PackingBoard state={state} selectedHex={selectedObject?.kind==='packing-cell'?selectedObject.hex:null}/>
          {forecast?.intents?.filter(intent=>intent.verb!=='dormant').map(intent=>{const enemy=entities.find(e=>e.id===intent.enemyId),target=entities.find(e=>e.id===intent.targetId)||state.blueprint.puzzle.tokens?.find(t=>t.id===intent.targetId),p=enemy&&projectHex(enemy.hex),to=target&&projectHex(target.hex);return p?<g key={intent.enemyId} pointerEvents="none"><polygon points={polygonPoints(enemy.hex)} fill="#b3432733" stroke="#eea078" strokeWidth="2"/>{to&&<><line x1={p.x} y1={p.y} x2={to.x} y2={to.y} stroke="#f2b68a" strokeWidth="3" strokeDasharray="5 5"/><polygon points={polygonPoints(target.hex)} fill="none" stroke="#eea078" strokeWidth="2"/></>}</g>:null;})}
          {paintables.map(entity=>{
            if(entity.kind==='bridge'){const p=projectHex(entity.hex),closed=entity.tile.passageOutputId&&!state.passages[entity.hex]?.open;return <g key={entity.id} pointerEvents="none"><RiverBridge hex={entity.hex} closed={!!closed} closingPending={!!state.passages[entity.hex]?.closingPending}/>{closed&&<polygon points={polygonPoints(entity.hex)} fill="#352d2955"/>}{movement.has(entity.hex)&&<polygon points={polygonPoints(entity.hex)} fill={MOVEMENT_COLOUR+'44'} stroke={MOVEMENT_COLOUR} strokeWidth="3" vectorEffect="non-scaling-stroke"/>}{selectedObject?.hex===entity.hex&&<polygon points={polygonPoints(entity.hex)} fill="none" stroke="#fff4cf" strokeWidth="4"/>}{entity.tile.passageOutputId&&<text x={p.x} y={p.y+6} textAnchor="middle" fontSize="18" fill="#fff2c5">{state.passages[entity.hex]?.closingPending?'⏳':closed?'×':'↔'}<title>{state.passages[entity.hex]?.closingPending?'Passage remains open until occupying figures leave':closed?'Passage closed':'Passage open'}</title></text>}</g>;}
            const p=projectHex(entity.hex),sprite=artFor?.(entity,state),selected=entity.id===selectedHero||entity.id===selectedObject?.id;
            return <g key={entity.id} pointerEvents="none" data-art-fallback={sprite?.fallback?'idle':undefined}>
              {selected&&<polygon points={polygonPoints(entity.hex)} fill="#fff4b522" stroke="#fff4b5" strokeWidth="3"/>}
              {entity.kind==='hero'||entity.kind==='enemy'?<ellipse data-ground-contact={entity.id} cx={p.x} cy={p.y+8} rx={entity.kind==='hero'?14:22} ry={entity.kind==='hero'?4:9} fill="#102c2555"/>:null}
              {sprite?<image data-entity-art={entity.id} data-entity-hex={entity.hex} href={sprite.url} x={p.x+(sprite.groundOffset?.[0]||0)-sprite.anchor[0]*sprite.scale} y={p.y+(sprite.groundOffset?.[1]||0)-sprite.anchor[1]*sprite.scale} width={sprite.width*sprite.scale} height={sprite.height*sprite.scale}/>:entity.kind==='hero'||entity.kind==='enemy'?<><circle cx={p.x} cy={p.y-17} r="22" fill={entity.kind==='hero'?'#eed5a1':'#ac7058'} stroke={selected?'#fff8c4':'#304335'} strokeWidth="3"/><text x={p.x} y={p.y-11} textAnchor="middle" fontSize="18" fill="#263c2d">{entity.name.slice(0,2)}</text></>:<StationGlyph entity={entity} state={state} x={p.x} y={p.y}/>}
              {entity.kind==='station'&&sprite?<StationStatus layer="damage" state={state} entity={entity} sprite={sprite} x={p.x} y={p.y} zoom={camera.scale}/>:null}
              {!(entity.kind==='station'&&sprite)&&!(entity.kind==='hero'&&entity.id===selectedHero)&&(camera.scale>=0.75||['station','orchard'].includes(entity.kind))&&<g transform={`translate(${p.x} ${p.y+15}) scale(${1/camera.scale})`}><rect x="-52" y="0" width="104" height="19" rx="5" fill="#203d2ae8"/><text x="0" y="14" textAnchor="middle" fontSize="12" fill="#fff4d1">{entity.name}</text></g>}
              {entity.hp!==undefined&&!(entity.kind==='hero'&&entity.id===selectedHero)&&<text x={p.x} y={p.y-48} textAnchor="middle" fontSize="14" fill="#fff">{entity.hp} ♥{entity.ap!==undefined?` · ${entity.ap} AP`:''}</text>}
              {entity.kind==='hero'&&entity.id!==selectedHero&&(entity.holding||entity.ap===0)&&<text x={p.x} y={p.y-65} textAnchor="middle" fontSize="13" fill="#fff4b5">{entity.holding?'Holding':entity.hp>0?'No AP':'Down'}</text>}
              {entity.defeated&&<text x={p.x+20} y={p.y-14} fontSize="20" fill="#fff">×</text>}
              {lastResult?.result.changedEntities?.some(change=>change.id===entity.id)&&<g><rect x={p.x-66} y={p.y-92} width="132" height="21" rx="7" fill="#fff1c8"/><text x={p.x} y={p.y-77} textAnchor="middle" fontSize="12" fill="#2c4835">{(()=>{const change=lastResult.result.changedEntities.find(c=>c.id===entity.id&&['charge','hp','ap'].includes(c.field));return change?`${change.field==='charge'?'Power':change.field==='ap'?'Actions':'Health'} ${change.before} → ${change.after}`:actionGuide(lastResult.command.type).label;})()}</text></g>}
            </g>;
          })}
          <RoostBoard state={state} zoom={camera.scale}/>
          {entities.filter(entity=>entity.kind==='station').map(entity=>{const sprite=artFor?.(entity,state),p=projectHex(entity.hex);return sprite?<StationStatus key={entity.id} state={state} entity={entity} sprite={sprite} x={p.x} y={p.y} zoom={camera.scale} detailed={entity.id===activeStationId}/>:null;})}
          {movementPreview?.path.length>0&&<polyline points={[state.heroes.find(hero=>hero.id===selectedHero).position,...movementPreview.path].map(hex=>{const p=projectHex(hex);return `${p.x},${p.y}`;}).join(' ')} fill="none" stroke="#fff7cd" strokeWidth="4" strokeDasharray="7 5" vectorEffect="non-scaling-stroke" pointerEvents="none"/>}
          {movementPreview?.destination&&<g pointerEvents="none" aria-label="Chosen destination"><polygon points={polygonPoints(movementPreview.destination)} fill="#fff4c422" stroke="#fff6c9" strokeWidth="5" vectorEffect="non-scaling-stroke"/>{(()=>{const p=projectHex(movementPreview.destination);return <g transform={`translate(${p.x} ${p.y}) scale(${1/camera.scale})`}><circle r="15" fill="#fff3b6" stroke="#243a30" strokeWidth="2"/><text textAnchor="middle" y="6" fontSize="20" fill="#243a30">✓</text></g>;})()}</g>}
        </g>
        <BalanceBoard state={state} zoom={camera.scale} camera={camera} size={size} overlays={[...overlays,...entities.filter(entity=>entity.kind==='hero'||entity.kind==='enemy').map(entity=>{const p=projectHex(entity.hex);return {x:(p.x-32)*camera.scale+camera.x,y:(p.y-80)*camera.scale+camera.y,width:64*camera.scale,height:100*camera.scale};})]}/>
        <StationLabels state={state} camera={camera} size={size} entities={entities} artFor={artFor} activeStationId={activeStationId} overlays={overlays} onHover={station=>hoverStation(station?.hex||null)} onActions={entity=>{setInspection(null);setHoveredHex(null);onSelect(entity);}} onDismiss={()=>{setInspection(null);setHoveredHex(null);}}/>
        <SelectedHeroInfo state={state} selectedHero={selectedHero} camera={camera} size={size} entities={entities} artFor={artFor} overlays={[...overlays,...infoObstacles]}/>
      </svg>
    </div>
    <details className="ov-checklist" aria-label="Mission checklist"><summary>Goal: {checklist.filter(item=>item.ready).length}/{checklist.length} ready</summary><small>All together before turn {state.blueprint.deadline}</small>{checklist.map(item=><PaintedButton key={item.id} onClick={()=>{const station=state.blueprint.stations.find(s=>s.id===item.id);centreOn(station.hex);setInspection(station.id);}}><strong>{item.ready?'✓':'○'} {item.name}</strong>{item.detail&&<small>{item.detail}</small>}</PaintedButton>)}</details>{guide}
    <div className="ov-camera-controls"><PaintedButton aria-label="Zoom in" onClick={()=>update(zoomCamera(camera,1.25,{x:size.width/2,y:size.height/2}))}>+</PaintedButton><PaintedButton aria-label="Zoom out" onClick={()=>update(zoomCamera(camera,0.8,{x:size.width/2,y:size.height/2}))}>−</PaintedButton><PaintedButton onClick={()=>setCamera(overviewCamera(bounds,size.width,size.height))}>Overview</PaintedButton><PaintedButton onClick={()=>update(zoomCamera(camera,1/camera.scale,{x:size.width/2,y:size.height/2}))}>100%</PaintedButton><PaintedButton aria-pressed={locked} onClick={()=>setLocked(!locked)}>{locked?'Camera locked':'Lock camera'}</PaintedButton><PaintedButton aria-expanded={minimap} onClick={()=>setMinimap(!minimap)}>Minimap</PaintedButton></div>
    <div className="ov-offscreen">{threats.filter(t=>{const p=projectHex(t.hex),x=p.x*camera.scale+camera.x,y=p.y*camera.scale+camera.y;return x<0||x>size.width||y<0||y>size.height;}).map(t=><PaintedButton key={t.id} onClick={()=>centreOn(t.hex)}>↗ {t.label}</PaintedButton>)}</div>
    <details ref={findMenu} className="ov-board-list" aria-label="Battlefield objects and reachable targets"><summary>Find on map</summary><div>{entities.map(entity=><PaintedButton key={entity.id} onClick={()=>{centreOn(entity.hex);if(entity.kind==='station')inspectStation(entity);else onSelect(entity);}}>{entity.name}: {entity.hex}{entity.hp!==undefined?`, ${entity.hp} health`:''}{entity.ap!==undefined?`, ${entity.ap} AP`:''}{entity.kind==='station'?`, ${stationPresentation(state,entity.id)?.lines.join('; ')}`:''}</PaintedButton>)}{reachable.map(target=><PaintedButton key={target.destination} onClick={()=>{centreOn(target.destination);onMoveTarget(target.destination);}}>Preview move to {target.destination}, path cost {target.cost}</PaintedButton>)}</div></details>
    {minimap&&<div className="ov-minimap"><svg viewBox={`${bounds.left} ${bounds.top} ${bounds.right-bounds.left} ${bounds.bottom-bounds.top}`} role="img" aria-label="Minimap with current viewport"><rect x={bounds.left} y={bounds.top} width={bounds.right-bounds.left} height={bounds.bottom-bounds.top} fill="#294b36"/>{entities.map(e=>{const p=projectHex(e.hex);return <circle key={e.id} cx={p.x} cy={p.y} r={e.kind==='hero'?12:8} fill={e.kind==='enemy'?'#ea9271':e.kind==='hero'?'#ffed99':'#a5c498'}/>;})}<rect x={-camera.x/camera.scale} y={-camera.y/camera.scale} width={size.width/camera.scale} height={size.height/camera.scale} fill="none" stroke="#fff" strokeWidth="4"/></svg></div>}
  </div>;
}
