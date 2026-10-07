import test from 'node:test';
import assert from 'node:assert/strict';
import { createAgendaImportService } from '../src/features/agenda/agenda-import-service.js';

test('agenda image import normalizes and deduplicates AI candidates before review',async()=>{
  const service=createAgendaImportService({understandFrame:async()=>({status:'stable',events:[
    {date:'07/10/2026',title:'Toets: Topografie',type:'test'},
    {date:'2026-10-07',title:'Topografie',type:'test'},
    {date:'2026-10-08',title:'Rekenen',type:'homework'}
  ]})});
  const items=await service.analyzeImage('data:image/jpeg;base64,x');
  assert.equal(items.length,2);
  assert.equal(items[0].date,'2026-10-07');
});

test('agenda video import preserves 30-frame baseline and transition refinement',async()=>{
  const calls=[];
  const service=createAgendaImportService({understandFrame:async()=>{
    calls.push(1);
    if(calls.length===1)return {status:'transition',events:[]};
    return {status:'stable',events:[{date:'2026-10-10',title:'Toets rekenen',type:'test'}]};
  }});
  const result=await service.analyzeVideo({duration:10,captureFrame:async()=>`frame-${calls.length}`});
  assert.equal(result.items.length,1);
  assert.ok(result.analyzedFrames>=30);
  assert.ok(result.refinementFrames>=1);
});
