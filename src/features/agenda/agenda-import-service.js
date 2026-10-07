import { mergeAgendaAiEvents } from './agenda-domain-service.js';

export function createAgendaImportService({understandFrame, clock=()=>new Date()}={}) {
  if(typeof understandFrame!=='function') throw new Error('An agenda frame analyzer is required.');

  async function analyzeImage(dataUrl) {
    const result=await understandFrame(dataUrl);
    return mergeAgendaAiEvents(result?.events||[]);
  }

  async function analyzeVideo({duration, captureFrame, status=()=>{}}={}) {
    const totalDuration=Number(duration||0);
    if(!totalDuration) throw new Error('Geen videoduur gevonden');
    const count=30;
    const baseStep=count>1?totalDuration/(count-1):totalDuration;
    const analyzed=new Set(), events=[];
    let successfulFrames=0, failedFrames=0, refinementFrames=0;
    const analyzeAt=async(time)=>{
      const safe=Math.max(0,Math.min(totalDuration-0.25,Number(time)||0));
      const key=safe.toFixed(3); if(analyzed.has(key)) return {status:'none',events:[]};
      analyzed.add(key);
      const frame=await captureFrame(safe);
      const result=await understandFrame(frame);
      successfulFrames++; events.push(...(result?.events||[])); return result||{status:'none',events:[]};
    };
    for(let i=0;i<count;i++) {
      const time=count===1?0:Math.max(0,Math.min(totalDuration-0.25,totalDuration*(i/(count-1))));
      status({step:i+1,total:count,uniqueCount:mergeAgendaAiEvents(events).length});
      try {
        const result=await analyzeAt(time);
        if(result.status==='transition') {
          const offsets=[-baseStep*.25,baseStep*.25,-baseStep*.5,baseStep*.5,-baseStep*.75,baseStep*.75,-baseStep,baseStep,-baseStep*1.5,baseStep*1.5,-baseStep*2,baseStep*2,-baseStep*3,baseStep*3];
          for(const offset of offsets) {
            const nearby=time+offset; if(nearby<0||nearby>totalDuration-.25) continue;
            try { refinementFrames++; const refined=await analyzeAt(nearby); if(refined.status==='stable'&&refined.events?.length) break; }
            catch { failedFrames++; }
          }
        }
      } catch { failedFrames++; }
    }
    return {items:mergeAgendaAiEvents(events),successfulFrames,failedFrames,refinementFrames,analyzedFrames:analyzed.size,startedAt:clock()};
  }
  return Object.freeze({analyzeImage,analyzeVideo});
}
