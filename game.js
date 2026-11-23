(()=>{
const $=id=>document.getElementById(id), bpm=$('bpm'), drum=$('drum'), lights=[...$('beatLights').children];
const tolerances={easy:150,medium:100,hard:50};let audio=null, running=false, beatNo=0, beatTimer=null, audioScheduler=null, phase='audible', phaseBeat=0, silentBeatCount=0, lastBeatMs=0, nextBeatAudio=0, basePerf=0, bpmValue=140, beatsPerBar=4, audibleBars=4, tolerance=100, soundOn=true, tapTimes=[], currentSilent=0, best=Number(localStorage.mutronBest||0), lastAcceptedBeat=-1, missedBeat=-1;
$('best').textContent=best;
function updateStatus(){let s=$('statusText'), box=$('status');s.textContent=running?(phase==='silent'?'SILENT — KEEP THE BEAT':'AUDIBLE — FOLLOW THE BEAT'):'READY';box.classList.toggle('silent',running&&phase==='silent');$('statusDot').style.background=running?(phase==='silent'?'#28f0d5':'#a143ff'):'#555';}
function feedback(t){$('feedback').textContent=t;}
function audioInit(){if(!audio)audio=new (window.AudioContext||window.webkitAudioContext)();if(audio.state==='suspended')audio.resume();}
function tone(time,accent=false,drumSound=false){if(!audio||!soundOn)return;let osc=audio.createOscillator(),gain=audio.createGain();osc.type=drumSound?'triangle':'sine';osc.frequency.value=drumSound?150:(accent?1000:740);gain.gain.setValueAtTime(drumSound?.0001:.0001,time);gain.gain.exponentialRampToValueAtTime(drumSound?.25:(accent?.12:.065),time+.005);gain.gain.exponentialRampToValueAtTime(.0001,time+(drumSound?.11:.09));osc.connect(gain);gain.connect(audio.destination);osc.start(time);osc.stop(time+(drumSound?.12:.1));}
function tapSound(){if(!audio)return;let now=audio.currentTime; tone(now,false,true);}
function flashBeat(n){lights.forEach((l,i)=>l.classList.toggle('active',i===n%4));document.querySelector('.drum-wrap').classList.remove('pulse');void document.querySelector('.drum-wrap').offsetWidth;document.querySelector('.drum-wrap').classList.add('pulse');}
function barsSilent(){return Math.floor(silentBeatCount/beatsPerBar)}
function tick(){if(!running||!audio)return;let now=audio.currentTime;while(nextBeatAudio<now+.12){let beatIndex=beatNo;let scheduled=nextBeatAudio;let phaseForBeat=phase;
 if(phaseForBeat==='audible')tone(scheduled,beatIndex%beatsPerBar===0,false);
 let perfAt=performance.now()+(scheduled-now)*1000; setTimeout(()=>{if(!running)return;flashBeat(beatIndex);if(phase==='silent')$('statusText').textContent='SILENT — KEEP THE BEAT';},Math.max(0,perfAt-performance.now()));
 beatNo++;phaseBeat++;
 if(phase==='silent'){silentBeatCount++;currentSilent=barsSilent();$('streak').textContent=currentSilent;$('streakUnit').textContent='bars · '+(silentBeatCount*60/bpmValue).toFixed(1)+'s';if(currentSilent>best){best=currentSilent;$('best').textContent=best;localStorage.mutronBest=best;}}
 if(phaseBeat>=beatsPerBar*audibleBars){phase='silent';phaseBeat=0;silentBeatCount=0;currentSilent=0;$('streak').textContent='0';$('streakUnit').textContent='bars';updateStatus();}
 nextBeatAudio+=60/bpmValue;
 }
}
function start(){audioInit();running=true;beatNo=0;phase='audible';phaseBeat=0;silentBeatCount=0;currentSilent=0;lastAcceptedBeat=-1;missedBeat=-1;nextBeatAudio=audio.currentTime+.18;basePerf=performance.now()+180;$('start').textContent='Ⅱ PAUSE';$('streak').textContent='0';updateStatus();feedback('Get ready — follow the beat');audioScheduler=setInterval(tick,20);}
function pause(){running=false;clearInterval(audioScheduler);$('start').textContent='▶ RESUME';updateStatus();feedback('Paused');}
function resetGame(){if(running)pause();beatNo=0;phase='audible';phaseBeat=0;silentBeatCount=0;$('streak').textContent='0';$('streakUnit').textContent='bars';$('start').textContent='▶ START';updateStatus();feedback('Ready for another run');}
function miss(reason){if(phase!=='silent')return;let score=barsSilent();feedback(`Beat missed — ${score} silent bars. Metronome is back.`);if(score>best){best=score;$('best').textContent=best;localStorage.mutronBest=best;}phase='audible';phaseBeat=0;silentBeatCount=0;currentSilent=0;$('streak').textContent='0';$('streakUnit').textContent='bars';updateStatus();}
function hit(){if(!running){feedback('Tap Start to begin');return;}let now=audio.currentTime;tapSound();drum.classList.add('hit');setTimeout(()=>drum.classList.remove('hit'),90);if(phase!=='silent'){feedback('Keep steady — silence is coming');return;}let beatDuration=60/bpmValue;let nearest=Math.round((now-nextBeatAudio)/beatDuration)+beatNo; // approximate future/previous beat
 let candidates=[beatNo-1,beatNo,beatNo+1];let target=candidates.reduce((a,b)=>Math.abs((basePerf+b*beatDuration*1000)-performance.now())<Math.abs((basePerf+a*beatDuration*1000)-performance.now())?b:a,candidates[0]);
 // Use scheduled audio beat mapped onto performance clock, independent of UI tick jitter
 let perfTarget=basePerf+(target*beatDuration*1000);let delta=performance.now()-perfTarget;
 if(Math.abs(delta)<=tolerance){if(target!==lastAcceptedBeat){lastAcceptedBeat=target;feedback(delta<-25?'Early':delta>25?'Late':'Perfect');}else feedback('Tap once per beat');}else{feedback(delta<0?'Too early':'Too late');miss('timing');}
}
$('start').onclick=()=>running?pause():start();drum.onclick=hit;document.addEventListener('keydown',e=>{if(e.code==='Space'&&!e.repeat){e.preventDefault();hit();}});$('minus').onclick=()=>{bpm.value=Math.max(40,(+bpm.value||140)-1);bpmValue=+bpm.value;};$('plus').onclick=()=>{bpm.value=Math.min(240,(+bpm.value||140)+1);bpmValue=+bpm.value;};bpm.onchange=()=>{bpmValue=Math.max(40,Math.min(240,+bpm.value||140));bpm.value=bpmValue;};
$('tapTempo').onclick=()=>{let t=performance.now();tapTimes.push(t);tapTimes=tapTimes.slice(-6);if(tapTimes.length>=2){let intervals=tapTimes.slice(1).map((v,i)=>v-tapTimes[i]);let avg=intervals.reduce((a,b)=>a+b,0)/intervals.length;bpm.value=Math.round(Math.max(40,Math.min(240,60000/avg)));bpmValue=+bpm.value;feedback('Tap tempo: '+bpmValue+' BPM');}else feedback('Tap a few more times');};
$('menuBtn').onclick=$('settingsShortcut').onclick=()=>$('settingsPanel').classList.add('open');$('closeSettings').onclick=()=>{$('settingsPanel').classList.remove('open');audibleBars=Math.max(1,Math.min(16,+$('audibleBars').value||4));beatsPerBar=+$('beats').value;tolerance=tolerances[$('difficulty').value];};$('meter').onclick=()=>{$('settingsPanel').classList.add('open');$('beats').focus();};$('sound').onclick=()=>{soundOn=!soundOn;$('sound').textContent=soundOn?'♫':'🔇';feedback(soundOn?'Sound on':'Sound off');};
// Miss detection checks the beat deadline. If no timely tap was registered, recovery begins.
setInterval(()=>{if(!running||phase!=='silent'||!audio)return;let elapsed=audio.currentTime-(nextBeatAudio-60/bpmValue);if(elapsed>(tolerance/1000)&&lastAcceptedBeat<beatNo-1&&missedBeat!==beatNo-1){missedBeat=beatNo-1;miss('missed beat');}},25);
window.addEventListener('beforeunload',()=>{if(audio)audio.close();});updateStatus();
})();
