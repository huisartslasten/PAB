import { test, expect } from '@playwright/test';

const pageUrl='http://127.0.0.1:4173/curriculum-b3-learner.html';
const parentUserId='5d0e1e5c-1dbe-4909-bd3a-81a1e7b26d09';
const learnerKey='123e4567-e89b-42d3-a456-426614174000';
const registryVersionId='f4b7b7e1-8d28-45de-9a6b-3c51f9d2a4e7';

test('B3 multiplication route renders reusable quantity models and persists all seven candidate developments',async({page})=>{
 const pageErrors=[];page.on('pageerror',error=>pageErrors.push(error.message));
 await page.addInitScript(({parentUserId,learnerKey,registryVersionId})=>{
  const state={profiles:[],evidence:[],longitudinalStates:[],traces:[],calls:[]};
  window.__pacoB3TestDb=state;
  const matches=(row,filters)=>filters.every(([key,value])=>row[key]===value);
  const rowsFor=table=>{
   if(table==='learner_profiles')return state.profiles;
   if(table==='curriculum_registry_versions')return[{id:registryVersionId,registry_key:'pacogo-curriculum',version:'0.4.0-candidate'}];
   if(table==='student_evidence')return state.evidence;
   if(table==='student_longitudinal_state')return state.longitudinalStates;
   return[];
  };
  const queryFor=table=>{
   const filters=[];
   const query={
    select(columns){state.calls.push(['select',table,columns]);return query;},
    eq(key,value){filters.push([key,value]);return query;},
    order(){return query;},
    maybeSingle(){return Promise.resolve({data:rowsFor(table).filter(row=>matches(row,filters))[0]||null,error:null});},
    then(resolve,reject){return Promise.resolve({data:rowsFor(table).filter(row=>matches(row,filters)),error:null}).then(resolve,reject);}
   };return query;
  };
  const db={
   functions:{invoke:async()=>({data:null,error:null})},
   auth:{
    getSession:async()=>({data:{session:{user:{id:parentUserId}}},error:null}),
    onAuthStateChange:()=>({data:{subscription:{unsubscribe(){}}}}),
    signOut:async()=>({error:null})
   },
   from:queryFor,
   rpc:async(name,payload)=>{
    state.calls.push(['rpc',name,payload]);
    if(name==='create_learner_profile'){
     state.profiles.push({learner_key:learnerKey,display_name:payload.p_display_name});
     return{data:learnerKey,error:null};
    }
    if(name==='persist_curriculum_learning_cycle'){
     const evidence=payload.p_evidence;
     const duplicate=state.evidence.some(row=>row.student_key===payload.p_student_key&&row.source_event_id===evidence.source_event_id);
     if(!duplicate){
      state.evidence.push({
       id:`evidence-${state.evidence.length+1}`,student_key:payload.p_student_key,
       curriculum_registry_version_id:payload.p_curriculum_registry_version_id,skill_id:payload.p_skill_id,
       development_id:evidence.development_id,claim_id:evidence.claim_id,evidence_target_id:evidence.evidence_target_id,
       task_model_id:evidence.task_model_id,task_instance_id:evidence.task_instance_id,
       performance:evidence.performance,observation:evidence.observation,
       evidence_assessment:evidence.evidence_assessment,source_event_id:evidence.source_event_id,observed_at:evidence.observed_at
      });
      state.longitudinalStates=state.longitudinalStates.filter(row=>
       !(row.student_key===payload.p_student_key&&row.curriculum_registry_version_id===payload.p_curriculum_registry_version_id&&row.skill_id===payload.p_skill_id));
      state.longitudinalStates.push({
       student_key:payload.p_student_key,curriculum_registry_version_id:payload.p_curriculum_registry_version_id,
       skill_id:payload.p_skill_id,state:payload.p_state.state
      });
      state.traces.push(payload.p_decision_trace);
     }
     return{data:{duplicate,evidence_id:'evidence-id',state_id:'state-id',decision_trace_id:'trace-id'},error:null};
    }
    return{data:null,error:new Error(`Unexpected RPC: ${name}`)};
   }
  };
  window.__pacoSupabaseStub={createClient:()=>db};
 },{parentUserId,learnerKey,registryVersionId});
 await page.route('https://cdn.jsdelivr.net/**',route=>route.fulfill({
  status:200,contentType:'application/javascript',body:'window.supabase = window.__pacoSupabaseStub;'
 }));
 await page.goto(pageUrl);
 await expect(page.locator('#learnerSetup h1')).toHaveText('Wie gaat oefenen?');
 await page.locator('#learnerName').fill('Leerling B3');
 await page.getByRole('button',{name:'Leerling toevoegen'}).click();
 await page.getByRole('button',{name:'Leerling kiezen: Leerling B3'}).click();
 await expect(page.locator('#exerciseCard h1')).toHaveText('Vermenigvuldigen oefenen');
 await expect(page.getByRole('link',{name:'Aftrekken'})).toBeVisible();

 const tasks=[
  {kind:'model',answer:12,model:'dot',count:12},
  {kind:'model',answer:10,model:'dot',count:10},
  {kind:'model',answer:12,model:'cell',count:12},
  {kind:'model',answer:24,model:'cell',count:24},
  {kind:'model',answer:16,model:'dot',count:16},
  {kind:'model',answer:30,model:'dot',count:30},
  {kind:'strategy',answer:56,strategy:'7 × 5 + 7 × 3'},
  {kind:'strategy',answer:72,strategy:'10 × 6 + 2 × 6'},
  {kind:'input',answer:312},
  {kind:'input',answer:1000},
  {kind:'input',answer:10},
  {kind:'input',answer:4.2},
  {kind:'strategy-check',answer:400,strategy:'25 × 16 als 50 × 8',check:'Controleren met delen'},
  {kind:'strategy-check',answer:1200,strategy:'50 × 25 − 2 × 25',check:'Controleren met een schatting'}
 ];
 for(let index=0;index<tasks.length;index+=1){
  const task=tasks[index];
  await expect(page.locator('#progress')).toContainText(`Oefening ${index+1} van 14`);
  if(task.kind==='model'){
   if(task.model==='dot')await expect(page.locator('.pacogo-quantity-dot')).toHaveCount(task.count);
   else await expect(page.locator('.pacogo-quantity-cell')).toHaveCount(task.count);
  }
  await page.locator('#answerInput').fill(String(task.answer));
  if(task.strategy)await page.getByRole('button',{name:task.strategy,exact:true}).click();
  if(task.check)await page.getByRole('button',{name:task.check,exact:true}).click();
  await page.getByRole('button',{name:'Controleren',exact:true}).click();
  await expect(page.locator('#feedback')).toContainText('antwoord is opgeslagen');
  if(index<tasks.length-1)await page.getByRole('button',{name:'Volgende oefening'}).click();
 }
 await expect(page.locator('#progress')).toHaveText('Oefenronde afgerond');
 await expect(page.locator('#sessionSummary')).toContainText('14 antwoorden veilig opgeslagen');
 const persisted=await page.evaluate(()=>({
  profiles:window.__pacoB3TestDb.profiles,evidence:window.__pacoB3TestDb.evidence,
  states:window.__pacoB3TestDb.longitudinalStates,traces:window.__pacoB3TestDb.traces
 }));
 expect(persisted.profiles).toHaveLength(1);
 expect(persisted.evidence).toHaveLength(14);
 expect(persisted.states).toHaveLength(1);
 expect(persisted.traces).toHaveLength(14);
 expect(persisted.evidence.every(row=>row.skill_id==='B3'&&row.student_key===learnerKey)).toBe(true);
 expect(pageErrors).toEqual([]);
});
