// Text provenance is a display concern. Never modify saved records or form values.
export const PRIVATE_SELECTORS=Object.freeze([
 '[data-private-text]','[data-home-private]','#idea-list','#room-name','#room-purpose','#room-list','#home-history','#home-edition','#scene-room','#activity-room',
 '#resident-messages','#artist-resident-messages','#conversation-messages','#conversation-evidence-text',
 '#design-detail-title','#design-detail-note','#residence-entry-text','#residence-entry-title','#city-travel-notes','#city-travel-cargo-list','#city-travel-displays','#city-travel-activity-text',
 '#plan-grid','#residence-map','.journal-entry','.city-journal-entry','.conversation-turn','.conversation-archive-turn','.artist-message',
 '.conversation-development-brief h3','.conversation-development-brief p','.conversation-development-brief small'
]);
const NON_TEXT='textarea,input,script,style,code,pre,[contenteditable]';
export function collectPrivateStrings(state){const out=new Set();const collect=value=>{if(typeof value==='string'&&value.trim())out.add(value.trim());else if(Array.isArray(value))value.forEach(collect);else if(value&&typeof value==='object')Object.values(value).forEach(collect);};if(state){collect(state.house);collect(state.neighborhood);collect(state.cityNetwork);}return out;}
export function protectedText(node,privateStrings){const el=node.nodeType===3?node.parentElement:node;if(!el||el.closest(NON_TEXT))return true;if(el.closest(PRIVATE_SELECTORS.join(',')))return true;
 // Only callbacks rendering known authored source material may override an ambiguous slot.
 if(el.closest('[data-public-authored]'))return false;
 if(el.closest('#activity-title,#activity-text'))return true;
 return node.nodeType===3&&privateStrings.has(String(node.nodeValue||'').trim());}
export function protectedAttribute(el,name,value,privateStrings){
 if(el.closest('script,style,code,pre,[contenteditable]'))return true;
 // Public form instructions can translate. Their value/ID/name/URL/action never changes.
 if(name==='placeholder'&&['INPUT','TEXTAREA'].includes(el.tagName))return false;
 if(el.closest(PRIVATE_SELECTORS.join(',')))return true;
 if(el.closest('[data-public-authored]'))return false;
 return privateStrings.has(value.trim());
}
const esc=value=>value.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
function parseTemplate(value){const parts=[];let cursor=0;const regex=/\$\{([^{}]+)\}/g;let match;while(match=regex.exec(value)){parts.push({literal:value.slice(cursor,match.index),expression:match[1].trim()});cursor=match.index+match[0].length;}return parts.length?{parts,end:value.slice(cursor)}:null;}
export function createPublicTranslator(dictionary){
 const templates=[];
 for(const [en,fa]of Object.entries(dictionary)){const source=parseTemplate(en),target=parseTemplate(fa);if(!source||!target)continue;const expressions=source.parts.map(p=>p.expression);if(target.parts.some(p=>!expressions.includes(p.expression)))continue;try{templates.push({source,target,pattern:new RegExp('^'+source.parts.map(p=>esc(p.literal)+'([\\s\\S]*?)').join('')+esc(source.end)+'$')});}catch{}}
 const translateSegment=value=>{const trimmed=value.trim();if(Object.hasOwn(dictionary,trimmed))return value.replace(trimmed,dictionary[trimmed]);for(const {source,target,pattern}of templates){const match=trimmed.match(pattern);if(!match)continue;const captures=new Map(source.parts.map((p,i)=>[p.expression,match[i+1]]));return value.replace(trimmed,target.parts.map(p=>p.literal+captures.get(p.expression)).join('')+target.end);}return value;};
 return (value,lang)=>lang!=='fa'?value:translateSegment(value).split(/(\n\s*\n)/).map((part,index)=>index%2?part:translateSegment(part)).join('');
}
export function markPublicText(element){if(!element)return;element.removeAttribute('data-private-text');element.removeAttribute('data-home-private');element.setAttribute('data-public-authored','');}
export function markPrivateText(element){if(!element)return;element.removeAttribute('data-public-authored');element.setAttribute('data-home-private','');}
