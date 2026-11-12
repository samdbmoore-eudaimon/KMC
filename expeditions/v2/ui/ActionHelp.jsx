import PaintedButton from './PaintedButton.jsx';
import React from 'react';
import {actionGuide} from './action-guide.js';
import {reasonText} from './feedback.js';
import {actionHelpText} from './action-help-text.js';
export {actionHelpText};

// Explains an action without executing it: purpose, cost, target, stat and (if blocked) why. Shown from a
// separate info button so ordinary play never needs a tooltip dismissal.
export default function ActionHelp({state,command,heroId,onClose}){
  if(!command)return null;
  const guide=actionGuide(command.type,state.profiles[heroId]);
  return <section className="ov-drawer ov-action-help" role="note" aria-label={`${guide.label} help`}>
    <h2>{guide.label}</h2><p>{guide.purpose}</p>
    <ul><li><b>Cost:</b> {command.apCost} action{command.apCost===1?'':'s'}{command.cardKey?'; the ability is then spent':''}</li><li><b>Uses:</b> {guide.stat}</li><li><b>Target:</b> {guide.target}</li></ul>
    <p>{command.available?'You can use this now.':`Not available yet: ${reasonText(command.reasonCode,command.reasonParams,state)}`}</p>
    <PaintedButton onClick={onClose}>Close help</PaintedButton>
  </section>;
}
