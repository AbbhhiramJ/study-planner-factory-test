const VERSION="3";
const goalsKey="studyflow-goals-v3",sessionsKey="studyflow-sessions-v3",themeKey="studyflow-theme";
const defaultGoals=[{t:"Review DSA",d:"Monday",done:false},{t:"Physics problem set",d:"Wednesday",done:false},{t:"Japanese revision",d:"Friday",done:false},{t:"Build project milestone",d:"Sunday",done:false}];
const defaultSessions=[{t:"Deep work · DSA",d:"Mon · 7:00 PM"},{t:"Physics problems",d:"Wed · 6:30 PM"},{t:"Project sprint",d:"Sat · 10:00 AM"}];
let goals=load(goalsKey,defaultGoals),sessions=load(sessionsKey,defaultSessions);
function load(k,f){try{const v=localStorage.getItem(k);return v?JSON.parse(v):f.map(x=>({...x}))}catch{return f.map(x=>({...x}))}}
function save(){localStorage.setItem(goalsKey,JSON.stringify(goals));localStorage.setItem(sessionsKey,JSON.stringify(sessions));render()}
function $(id){return document.getElementById(id)}
function esc(v){return String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function render(){const done=goals.filter(g=>g.done).length,total=goals.length,p=total?Math.round(done/total*100):0;$("goals").innerHTML=goals.map((g,i)=>'<div class="card"><input type="checkbox" data-goal="'+i+'" '+(g.done?"checked":"")+'><div class="'+(g.done?"done":"")+'">'+esc(g.t)+'</div><span class="meta">'+esc(g.d)+'</span></div>').join("");$("sessions").innerHTML=sessions.map(s=>'<div class="card"><div>◷</div><div>'+esc(s.t)+'</div><span class="meta">'+esc(s.d)+'</span></div>').join("");$("percent").textContent=p+"%";document.querySelector(".ring").style.setProperty("--p",p*3.6+"deg");$("count").textContent=done+" / "+total;$("weekLabel").textContent=new Date().toLocaleDateString(undefined,{month:"long",day:"numeric",year:"numeric"});$("bars").innerHTML=["M","T","W","T","F","S","S"].map((d,i)=>'<div class="bar" style="height:'+(35+(i%3)*25)+'px"><i style="height:'+(i<done?80:25)+'%"></i><span>'+d+'</span></div>').join("")}
function openModal(kind){$("modalTitle").textContent=kind==="Goal"?"Add goal":"Add focus session";$("kind").value=kind;$("modal").classList.add("open");$("title").focus()}
function closeModal(){$("modal").classList.remove("open")}
$("addGoal").onclick=()=>openModal("Goal");$("addSession").onclick=()=>openModal("Focus session");$("closeModal").onclick=closeModal;
$("form").onsubmit=e=>{e.preventDefault();const title=$("title").value.trim(),day=$("day").value,kind=$("kind").value;if(!title)return;if(kind==="Goal")goals.push({t:title,d:day,done:false});else sessions.push({t:title,d:day+" · planned"});save();closeModal();$("title").value=""};
$("goals").onchange=e=>{if(e.target.matches("[data-goal]")){goals[Number(e.target.dataset.goal)].done=e.target.checked;save()}};
$("theme").onclick=()=>{document.body.classList.toggle("dark");const dark=document.body.classList.contains("dark");localStorage.setItem(themeKey,dark?"dark":"light");$("theme").textContent=dark?"☀":"☾"};
if(localStorage.getItem(themeKey)==="dark"){document.body.classList.add("dark");$("theme").textContent="☀"}
render();