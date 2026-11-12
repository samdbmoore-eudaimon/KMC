import {actionGuide} from './action-guide.js';
import {reasonText} from './feedback.js';

export function actionHelpText(state,command,heroId){
  const guide=actionGuide(command.type,state.profiles[heroId]);
  const cost=`${command.apCost} action${command.apCost===1?'':'s'}${command.cardKey?', then this ability is spent':''}`;
  const why=command.available?'Available now.':`Not available: ${reasonText(command.reasonCode,command.reasonParams,state)}`;
  return `${guide.label}. ${guide.purpose} Cost: ${cost}. Uses: ${guide.stat}. Target: ${guide.target}. ${why}`;
}
