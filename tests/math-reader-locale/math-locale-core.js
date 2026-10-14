export const PRIVATE_SELECTORS=Object.freeze(['[data-math-private]','[data-city-private]','[data-private-text]','[data-home-private]','textarea','input','[contenteditable="true"]','.saved-note p','.copy-fallback']);
export const MATH_SELECTORS='script,style,code,pre,.formula,.equation-large,.math-source,[role="math"],mjx-container';
export const normal=value=>String(value??'').replace(/\s+/g,' ').trim();
const escape=value=>value.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const fieldPattern=name=>['count','read','index','percent','revision'].includes(name)?'(\\d+(?:\\.\\d+)?)':name==='year'?'(-?\\d+(?: BCE)?)':name==='date'?'(\\d{4}-\\d{2}-\\d{2})':name==='url'?'(https?://\\S+)':name==='theme'?'(light|dark)':'(.+?)';
export function createPublicTranslator(dictionary,publicTemplates=[]){
 const exact=new Map(Object.entries(dictionary).map(([key,value])=>[normal(key),value]));
 const patterns=publicTemplates.map(([key,value])=>{const names=[];let at=0,pattern='';for(const match of key.matchAll(/\$\{([A-Za-z]+)\}/g)){pattern+=escape(key.slice(at,match.index))+fieldPattern(match[1]);names.push(match[1]);at=match.index+match[0].length;}pattern+=escape(key.slice(at));return{source:key,value,names,regex:new RegExp('^'+pattern+'$'),weight:key.replace(/\$\{[^}]+\}/g,'').length};}).sort((a,b)=>b.weight-a.weight);
 function lookup(value){return exact.get(normal(value))??null;}
 function matched(value){const text=normal(value);if(exact.has(text))return{kind:'exact',text:exact.get(text)};for(const item of patterns){const match=item.regex.exec(text);if(!match)continue;const values=Object.fromEntries(item.names.map((name,i)=>[name,match[i+1]]));const out=item.value.replace(/\$\{([A-Za-z]+)\}/g,(_,name)=>['equation','url','terms','year','date','count','read','index','percent','revision'].includes(name)?values[name]:(lookup(values[name])??values[name]));return{kind:'template',text:out,source:item.source};}return null;}
 return{lookup,match:matched,translate(value,language='fa'){const raw=String(value??'');if(language!=='fa')return raw;const found=matched(raw);return found?raw.match(/^\s*/)[0]+found.text+raw.match(/\s*$/)[0]:raw;},coverage:()=>({exact:exact.size,templates:patterns.length})};
}
export function privateText(node){const element=node?.nodeType===1?node:node?.parentElement;return Boolean(element?.closest?.(PRIVATE_SELECTORS.join(',')));}
export function privateAttribute(element,name){
 if(element?.closest?.('[data-math-private],[data-city-private],[data-private-text],[data-home-private]'))return true;
 if(element?.closest?.(MATH_SELECTORS))return true;
 if(element?.closest?.('[contenteditable="true"],.saved-note p,.copy-fallback'))return true;
 // Public instructions on form fields may translate; their values and text cannot.
 return !['title','aria-label','placeholder','alt'].includes(name);
}
