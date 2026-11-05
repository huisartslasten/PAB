import {test,expect} from '@playwright/test';
const pageUrl='http://127.0.0.1:4173/curriculum-b5-learner.html';
const parentUserId='5d0e1e5c-1dbe-4909-bd3a-81a1e7b26d09';
const learnerKey='523e4567-e89b-42d3-a456-426614174000';
const registryVersionId='b5000000-0000-4000-8000-000000000006';

test('B5 learner route completes twelve process-aware tasks and persists observations',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(({parentUserId,learnerKey,registryVersionId})=>{
  const s={profiles:[],evidence:[],longitudinalStates:[],traces:[],calls:[]};
  window.__pacoB5TestDb=s;
  const match=(r,f)=>f.every(([k,v])=>r[k]===v);
  const rows=t=>t==='learner_profiles'?s.profiles:t==='curriculum_registry_versions'?[{id:registryVersionId,registry_key:'pacogo-curriculum',version:'0.6.0-candidate'}]:t==='student_evidence'?s.evidence:t==='student_longitudinal_state'?s.longitudinalStates:[];
  const from=t=>{const f=[];const q={select(c){s.calls.push(['select',t,c]);return q;},eq(k,v){f.push([k,v]);return q;},order(){return q;},maybeSingle(){return Promise.resolve({data:rows(t).filter(r=>match(r,f))[0]||null,error:null});},then(a,b){return Promise.resolve({data:rows(t).filter(r=>match(r,f)),error:null}).then(a,b);}};return q;};
  const db={functions:{invoke:async()=>({data:null,error:null})},auth:{getSession:async()=>({data:{session:{user:{id:parentUserId}}},error:null}),onAuthStateChange:()=>({data:{subscription:{unsubscribe(){}}}}),signOut:async()=>({error:null})},from,rpc:async(n,p)=>{
   s.calls.push(['rpc',n,p]);
   if(n==='create_learner_profile'){s.profiles.push({learner_key:learnerKey,display_name:p.p_display_name});return{data:learnerKey,error:null};}
   if(n==='persist_curriculum_learning_cycle'){
    const e=p.p_evidence,dup=s.evidence.some(x=>x.student_key===p.p_student_key&&x.source_event_id===e.source_event_id);
    if(!dup){s.evidence.push({id:'evidence-'+(s.evidence.length+1),student_key:p.p_student_key,curriculum_registry_version_id:p.p_curriculum_registry_version_id,skill_id:p.p_skill_id,development_id:e.development_id,claim_id:e.claim_id,evidence_target_id:e.evidence_target_id,task_model_id:e.task_model_id,task_instance_id:e.task_instance_id,performance:e.performance,observation:e.observation,evidence_assessment:e.evidence_assessment,source_event_id:e.source_event_id,observed_at:e.observed_at});s.longitudinalStates=[{student_key:p.p_student_key,curriculum_registry_version_id:p.p_curriculum_registry_version_id,skill_id:p.p_skill_id,state:p.p_state.state}];s.traces.push(p.p_decision_trace);}
    return{data:{duplicate:dup,evidence_id:'e',state_id:'s',decision_trace_id:'t'},error:null};
   }
   return{data:null,error:new Error('Unexpected RPC '+n)};
  }};
  window.__pacoSupabaseStub={createClient:()=>db};
 },{parentUserId,learnerKey,registryVersionId});
 await page.route('https://cdn.jsdelivr.net/**',r=>r.fulfill({status:200,contentType:'application/javascript',body:'window.supabase = window.__pacoSupabaseStub;'}));
 await page.goto(pageUrl);
 await expect(page.locator('#learnerSetup h1')).toHaveText('Wie gaat oefenen?');
 await page.locator('#learnerName').fill('Leerling B5');
 await page.getByRole('button',{name:'Leerling toevoegen'}).click();
 await page.getByRole('button',{name:'Leerling kiezen: Leerling B5'}).click();
 await expect(page.locator('#exerciseCard h1')).toHaveText('Bewerkingen combineren oefenen');
 const correctChoices=['5 × 4 + 3','36 verdelen in 6 gelijke delen en daarna 2 erbij','4 × 6 + 3','2 × 8 + 5','4 × 20 + 4 × 3','5 × 12 − 5 × 2','5 × 12 − 8'];
 const stepAnswers=[
  {steps:{first:8},answer:24},
  {steps:{parentheses:11},answer:44},
  {steps:{division:9,multiplication:18},answer:27},
  {steps:{multiplication:48},answer:52},
  null,null,null,
  {steps:{cards:24,spent:28},answer:2,check_answer:30}
 ];
 for(let i=0;i<12;i++){
  await expect(page.locator('#progress')).toContainText('Oefening '+(i+1)+' van 12');
  if([0,1,2,3,8,9,10].includes(i)){
   const option=correctChoices[i];await page.getByRole('button',{name:option,exact:true}).click();
  }else{
   const data=stepAnswers[i-4];
   for(const [id,value] of Object.entries(data.steps)){
    const taskPrompts={first:'Wat is de uitkomst van de eerste bewerking: 48 ÷ 6?',parentheses:'Wat is 8 + 3?',division:'Wat is 72 ÷ 8?',multiplication:i===6?'Wat is 6 × 3?':'Wat is 4 × 12?',cards:'Wat kosten de 3 kaartjes samen?',spent:'Hoeveel geef je in totaal uit, inclusief de snack?'};
    const prompt=taskPrompts[id];await page.getByLabel(prompt).fill(String(value));
   }
   await page.getByLabel('Eindantwoord').fill(String(data.answer));
   if(data.check_answer!==undefined){await page.getByRole('button',{name:'Terugrekenen: uitgaven + wisselgeld',exact:true}).click();await page.getByLabel('Tel je uitgaven en je wisselgeld bij elkaar op. Wat is het totaal?').fill(String(data.check_answer));}
  }
  await page.getByRole('button',{name:'Controleren',exact:true}).click();
  await expect(page.locator('#feedback')).toContainText('antwoord is opgeslagen');
  if(i<11)await page.getByRole('button',{name:'Volgende oefening'}).click();
 }
 await expect(page.locator('#progress')).toHaveText('Oefenronde afgerond');
 await expect(page.locator('#sessionSummary')).toContainText('12 antwoorden veilig opgeslagen');
 const saved=await page.evaluate(()=>({profiles:window.__pacoB5TestDb.profiles,evidence:window.__pacoB5TestDb.evidence,states:window.__pacoB5TestDb.longitudinalStates,traces:window.__pacoB5TestDb.traces}));
 expect(saved.profiles).toHaveLength(1);expect(saved.evidence).toHaveLength(12);expect(saved.states).toHaveLength(1);expect(saved.traces).toHaveLength(12);
 expect(saved.evidence.every(x=>x.skill_id==='B5'&&x.student_key===learnerKey)).toBe(true);
 expect(saved.evidence[4].observation.response.submitted_steps).toEqual({first:8});
 expect(saved.evidence[11].observation.response.submitted_check_answer).toBe(30);
 expect(errors).toEqual([]);
});
