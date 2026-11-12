import React from 'react';

export function originalPortraitFor(id,cards,avatarForCard){
  const card=cards?.find(item=>item.id===id||item.id===`po_${id}`);
  return card?(avatarForCard?.('primary',card)||card.img||null):null;
}

export function PartyMember({hero,profile,portrait,frame,geometry,visibleBounds,selected=false,onSelect}){
  const {width,height,portraitCircle,textSafeArea}=geometry;
  const crop=visibleBounds||[0,0,width,height],viewWidth=crop[2]-crop[0],viewHeight=crop[3]-crop[1];
  const box=([x,y,w,h])=>({left:`${100*(x-crop[0])/viewWidth}%`,top:`${100*(y-crop[1])/viewHeight}%`,width:`${100*w/viewWidth}%`,height:`${100*h/viewHeight}%`});
  const [cx,cy,radius]=portraitCircle;
  const exhausted=hero.ap===0,disabled=hero.defeated||hero.hp<=0;
  return <button className={`ov-party-member${selected?' ov-party-selected':''}${exhausted?' ov-party-exhausted':''}`} style={{aspectRatio:`${viewWidth} / ${viewHeight}`}} aria-label={`Select ${profile.name}${disabled?', defeated':exhausted?', no actions left':''}`} aria-pressed={selected} disabled={disabled} title={`${profile.name}: ${profile.roleName}, ${profile.discipline}. ${hero.hp}/${profile.maxHealth} health, ${hero.ap} actions${hero.holding?', holding':''}`} onClick={onSelect}>
    <img className="ov-party-frame" style={box([0,0,width,height])} src={frame} alt="" aria-hidden="true"/>
    <span className="ov-party-portrait" style={box([cx-radius,cy-radius,radius*2,radius*2])}>{portrait?<img src={portrait} style={{objectPosition:['cornix','millrace','longshadow'].includes(hero.cardId||hero.id)?'50% 0%':geometry.portraitObjectPosition||'50% 38%'}} alt=""/>:<span aria-label="Original portrait unavailable">?</span>}</span>
    <span className="ov-party-copy" style={box(textSafeArea)}><strong>{selected?<span aria-hidden="true">✓ </span>:null}{profile.name}</strong><span>{disabled?'Defeated':`${hero.hp}/${profile.maxHealth} ♥ · ${hero.ap} AP${hero.holding?' · Hold':''}`}</span></span>
  </button>;
}

export default function PartyTray({state,selectedHero,cards,avatarForCard,frame,geometry,visibleBounds,onSelect}){
  return <div className="ov-party-tray" aria-label="Your expedition team">{state.heroes.toSorted((a,b)=>state.profiles[a.id].initiative-state.profiles[b.id].initiative||a.id.localeCompare(b.id)).map(hero=><PartyMember key={hero.id} hero={hero} profile={state.profiles[hero.id]} portrait={originalPortraitFor(hero.cardId||hero.id,cards,avatarForCard)} frame={frame} geometry={geometry} visibleBounds={visibleBounds} selected={hero.id===selectedHero} onSelect={()=>onSelect(hero)}/>)}</div>;
}
