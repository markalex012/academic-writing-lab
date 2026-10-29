const Engine={
 number:x=>Number(String(x).replace(',','.')),
 resistor(r1,r2,u){if(![r1,r2,u].every(Number.isFinite)||r1<=0||r2<=0||u<0)throw Error('נתונים לא תקינים');return {r:r1*r2/(r1+r2),i:u/r1+u/r2,i1:u/r1,i2:u/r2}},
 ship(m,a,rho,h){if(![m,a,rho,h].every(x=>Number.isFinite(x)&&x>0))throw Error('נדרשים ערכים חיוביים');let draft=m/(rho*a);return {volume:m/rho,draft,floats:draft<=h}},
 average(nums,fixed){if(!nums.length)return {value:null,trace:[]};if(!nums.every(x=>typeof x==='number'&&Number.isFinite(x)))throw Error('מספרים בלבד');let sum=0,trace=[];for(let i=fixed?0:1;i<nums.length;i++){sum+=nums[i];trace.push({index:i,value:nums[i],sum})}return {value:sum/nums.length,trace}},
 button(mode,scenario){const inputs={short:[1,1,0,0,0,0,1,1],long:[1,1,0,0,0,0,0,0,0,0,1,1],bounce:[1,1,0,1,0,1,0,0,0,0,1,1]}[scenario];let count=0,last=1,stable=1,run=0,events=[];inputs.forEach((v,i)=>{if(mode==='level'&&v===0){count++;events.push(i)}if(mode==='edge'&&last===1&&v===0){count++;events.push(i)}if(mode==='debounce'){run=v===last?run+1:1;if(run>=3&&v!==stable){stable=v;if(v===0){count++;events.push(i)}}}last=v});return {inputs,count,events}},
 rank(products,budget,usb,weight){return products.filter(p=>p.price+p.ship<=budget&&(!usb||p.usb===true)).map(p=>({...p,score:weight*(p.rate/200)+(1-weight)*(p.battery/12)})).sort((a,b)=>b.score-a.score)},
 restore(text){try{let x=JSON.parse(text);if(x?.schema===1&&x.answers&&typeof x.answers==='object'&&!Array.isArray(x.answers)&&Array.isArray(x.versions)&&Array.isArray(x.done)){x.done=x.done.filter(a=>typeof a==='string');x.versions=x.versions.filter(a=>a&&typeof a.text==='string'&&typeof a.title==='string');x.favorites=Array.isArray(x.favorites)?x.favorites.filter(a=>typeof a==='string'):[];x.last=Number.isInteger(x.last)&&x.last>=0&&x.last<10?x.last:0;return x}}catch{}return {schema:1,answers:{},versions:[],done:[],favorites:[],last:0}},
 csv(rows){return 'name,value,unit\n'+rows.map(x=>[x.name,x.value,x.unit].map(v=>'"'+String(v).replaceAll('"','""')+'"').join(',')).join('\n')},
 validateJSON(text){try{const x=JSON.parse(text);return {ok:Array.isArray(x)&&x.length===3&&x.every((r,i)=>r.name===COMPONENT_DATA[i].name&&r.value===COMPONENT_DATA[i].value&&r.unit===COMPONENT_DATA[i].unit),parsed:true}}catch{return {ok:false,parsed:false}}},
 diff(a,b){const aa=a.split('\n'),bb=b.split('\n');return [...aa.filter(x=>!bb.includes(x)).map(text=>({type:'−',text})),...bb.filter(x=>!aa.includes(x)).map(text=>({type:'+',text}))]},
 grade(questions,answers){return questions.map((q,i)=>({ok:q.accept.includes(Number(answers[i])),explain:q.explain}))}
};
if(typeof module!=='undefined')module.exports=Engine;
