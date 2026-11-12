import {ORCHARD_V2_ART} from './runtime-art.js';
import manifest from './manifest.json' with {type:'json'};
import {ORCHARD_STATION_ART} from './station-art.js';
import stations from './station-manifest.json' with {type:'json'};
import {ORCHARD_FAMILY_ART} from './family-art.js';
import families from './family-manifest.json' with {type:'json'};
import {fitSpriteInHex,standingSpritePlacement} from './placement.js';

export function orchardStationFor(entity,state) {
  if(entity.kind!=='station')return null;
  const id=(families.familyMappings[state.blueprint.familyId]||stations.familyMappings?.[state.blueprint.familyId])?.[entity.id];
  const asset=families.assets[id]||stations.assets[id];
  return asset?{id:asset.id,url:ORCHARD_FAMILY_ART[asset.id]||ORCHARD_STATION_ART[asset.id],width:asset.width,height:asset.height,visibleBounds:asset.visibleBounds,overlayAnchors:asset.overlayAnchors,...fitSpriteInHex(asset),pose:'base',fallback:false}:null;
}

export function orchardHeroPose(entity,state) {
  if(entity.hp<=0)return 'exhausted';
  if(entity.holding)return 'action';
  if(entity.ap===0)return 'exhausted';
  return 'idle';
}

export function orchardPortraitFor(heroId) {
  return orchardArtFor({id:heroId,kind:'hero'},{events:[]});
}

export function orchardArtFor(entity,state) {
  const station=orchardStationFor(entity,state);if(station)return station;
  const definition=entity.kind==='enemy'?state.blueprint.enemies.find(e=>e.id===entity.id):null;
  const pose=entity.kind==='hero'?orchardHeroPose(entity,state):entity.defeated?'defeated':'idle';
  const requested=entity.kind==='hero'?`hero-${entity.id}-${pose}`:entity.kind==='orchard'?'hero-ninefoldtree-idle':definition?`enemy-${definition.artId}-${pose}`:null;
  const id=manifest.assets[requested]?requested:entity.kind==='hero'?`hero-${entity.id}-idle`:null;
  const asset=manifest.assets[id];if(!asset)return null;
  const placement=entity.kind==='hero'?standingSpritePlacement(asset):{anchor:asset.groundAnchor,scale:88/(asset.visibleBounds[3]-asset.visibleBounds[1]),groundOffset:[0,0]};
  return {url:ORCHARD_V2_ART[id],width:asset.width,height:asset.height,visibleBounds:asset.visibleBounds,...placement,pose,fallback:requested!==id};
}
