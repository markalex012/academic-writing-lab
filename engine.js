'use strict';
const Writing=(()=>{
const mean=a=>a.reduce((s,x)=>s+x,0)/a.length;
const words=s=>String(s).trim().split(/\s+/).filter(Boolean).length;
const percent=(from,to)=>{if(!Number.isFinite(from)||!Number.isFinite(to)||from===0)throw Error('נדרש בסיס סופי שונה מאפס');return(to-from)/from*100;};
function unitMeans(rows){return [...new Set(rows.map(r=>r.unit))].map(unit=>{const m=(mode,k)=>mean(rows.filter(r=>r.unit===unit&&r.mode===mode).map(r=>r[k]));return{unit,rawNoise:m('RAW','rms_noise_mv'),maNoise:m('MA5','rms_noise_mv'),rawTime:m('RAW','response_ms'),maTime:m('MA5','response_ms')};});}
function metrics(rows){const units=unitMeans(rows),rawNoise=mean(units.map(r=>r.rawNoise)),maNoise=mean(units.map(r=>r.maNoise)),rawTime=mean(units.map(r=>r.rawTime)),maTime=mean(units.map(r=>r.maTime));return{n:units.length,rows:rows.length,rawNoise,maNoise,rawTime,maTime,noiseReduction:rawNoise-maNoise,noisePercent:-percent(rawNoise,maNoise),timeIncrease:maTime-rawTime,timePercent:percent(rawTime,maTime),ratio:maTime/rawTime,maxMA:Math.max(...rows.filter(r=>r.mode==='MA5').map(r=>r.response_ms))};}
function requirement(rows,limit){if(!Number.isFinite(limit)||limit<0)throw Error('נדרש סף לא שלילי');const ma=rows.filter(r=>r.mode==='MA5');return{limit,passing:ma.filter(r=>r.response_ms<=limit).length,total:ma.length,all:ma.every(r=>r.response_ms<=limit),max:Math.max(...ma.map(r=>r.response_ms))};}
function rubric(levels){const weights=[20,20,15,20,10,15];if(levels.length!==6||levels.some(x=>!Number.isInteger(x)||x<0||x>4))throw Error('רמה חייבת להיות 0–4');return levels.reduce((s,l,i)=>s+weights[i]*l/4,0);}
function escape(digits,sources,reasons){return digits.length===5&&sources.length===5&&reasons.length===5&&digits.every((x,i)=>String(x)===String([4,2,2,3,0][i]))&&sources.every(x=>String(x).trim())&&reasons.every(x=>String(x).trim());}
return{mean,words,percent,unitMeans,metrics,requirement,rubric,escape};
})();
if(typeof module!=='undefined')module.exports=Writing;
