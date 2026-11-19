import { test, expect } from '@playwright/test';
test('guided unlike-denominator division is listed before independent practice and has ten tasks',async({page})=>{
 await page.goto('http://127.0.0.1:4173/skills.html?domain=fractions&topic=delen',{waitUntil:'domcontentloaded'});
 const result=await page.evaluate(async()=>{
  localStorage.removeItem('pacogo:fraction-unlike-denominator-division-guided:v1:Zyon');
  const {createSkillsRuntime}=await import('/src/features/skills/runtime.js');
  const {FRACTION_UNLIKE_DENOMINATOR_DIVISION_GUIDED_TASKS}=await import('/pacogo-engine/fraction-unlike-denominator-division-guided-task-bank.js');
  const mount=document.createElement('div');mount.id='paco-template-mount';document.body.replaceChildren(mount);
  const app={auth:{isParent:false,isLoggedIn:false,session:null,subscribe:()=>({unsubscribe(){}})},authSession:{},managementCapabilities:{getAvailableForPage:()=>[]}};
  const runtime=createSkillsRuntime({app,templateMount:mount,context:{student:'Zyon',mode:'student'},domain:'fractions',topic:'delen',exercise:'unlike-denominator-division-guided',documentRef:document,navigate:()=>{}});
  await runtime.mount();
  const labels=[...document.querySelectorAll('.skills-addition-overview-list button,.skills-addition-overview-list a')].map(x=>x.textContent.trim());
  return {title:document.querySelector('h2')?.textContent||'',progress:document.querySelector('.fraction-practice-progress')?.textContent||'',steps:document.querySelectorAll('.fraction-guided-step-card').length,taskCount:FRACTION_UNLIKE_DENOMINATOR_DIVISION_GUIDED_TASKS.length,labels};
 });
 expect(result.taskCount).toBe(10);expect(result.progress).toContain('Som 1 van 10');expect(result.steps).toBe(3);
});
