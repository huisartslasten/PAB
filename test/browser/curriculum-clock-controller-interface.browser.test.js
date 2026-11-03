import { test, expect } from '@playwright/test';
const pageUrl='http://127.0.0.1:4173/curriculum-clock-controller-interface.html';

test('Clock analog source is read and answered through digital input',async({page})=>{
 await page.goto(pageUrl);const face=page.locator('.pacogo-clock__face');
 await expect(face).toHaveAttribute('aria-label','Analoge klok: 08:35');
 await expect(page.locator('.pacogo-clock__digital')).toHaveText('--:--');
 await expect(page.locator('.pacogo-clock__controls')).toBeVisible();
 await page.locator('.pacogo-clock__hour').fill('8');await page.locator('.pacogo-clock__minute').fill('35');
 await page.getByRole('button',{name:'Zet tijd'}).click();
 await expect(page.locator('.pacogo-clock__digital')).toHaveText('08:35');
 await page.getByRole('button',{name:'Controleer antwoord'}).click();await expect(page.locator('#status')).toContainText('Goed');
 const trace=JSON.parse(await page.locator('#trace').textContent());
 expect(trace.task_type).toBe('read_analog_time');expect(trace.correctness).toBe(true);expect(trace.representation).toBe('digital_time');expect(trace.event_count).toBeGreaterThanOrEqual(3);
});

test('Clock digital source is set and answered through analog hand interaction',async({page})=>{
 await page.goto(`${pageUrl}?mode=digital_to_analog`);const face=page.locator('.pacogo-clock__face');
 await expect(page.locator('.pacogo-clock__digital')).toHaveText('08:35');
 await expect(face).toHaveAttribute('aria-label','Analoge klok: 08:00');await expect(page.locator('.pacogo-clock__controls')).toBeHidden();
 const faceBox=await face.boundingBox(),handBox=await page.locator('[data-hand="minute"]').boundingBox();
 if(!faceBox||!handBox)throw new Error('Clock face or minute hand is not visible');
 const start={x:handBox.x+handBox.width/2,y:handBox.y+handBox.height/2},angle=210*Math.PI/180,radius=faceBox.width*.32;
 const target={x:faceBox.x+faceBox.width/2+Math.sin(angle)*radius,y:faceBox.y+faceBox.height/2-Math.cos(angle)*radius};
 await page.mouse.move(start.x,start.y);await page.mouse.down();await page.mouse.move(target.x,target.y,{steps:8});await page.mouse.up();
 await expect(face).toHaveAttribute('aria-label','Analoge klok: 08:35');
 await page.getByRole('button',{name:'Controleer antwoord'}).click();await expect(page.locator('#status')).toContainText('Goed');
 const trace=JSON.parse(await page.locator('#trace').textContent());
 expect(trace.task_type).toBe('set_analog_clock');expect(trace.correctness).toBe(true);expect(trace.representation).toBe('analog_time');expect(trace.event_count).toBeGreaterThanOrEqual(3);
});

test('Clock analog source can be matched to a digital time option',async({page})=>{
 await page.goto(`${pageUrl}?mode=match_representations`);
 await expect(page.locator('.pacogo-clock__face')).toHaveAttribute('aria-label','Analoge klok: 08:35');
 await expect(page.locator('.pacogo-clock__option')).toHaveCount(3);
 const choice=page.locator('.pacogo-clock__option[data-option-id="option-b"]');
 await choice.click();await expect(choice).toHaveAttribute('aria-pressed','true');
 await page.getByRole('button',{name:'Controleer antwoord'}).click();await expect(page.locator('#status')).toContainText('Goed');
 const trace=JSON.parse(await page.locator('#trace').textContent());
 expect(trace.task_type).toBe('match_representations');expect(trace.correctness).toBe(true);
 expect(trace.source_representation).toBe('analog_clock');expect(trace.option_representation).toBe('digital_time');
 expect(trace.selected_option_id).toBe('option-b');expect(trace.event_count).toBeGreaterThanOrEqual(3);
});

test('Clock digital source can be matched to an analog clock option',async({page})=>{
 await page.goto(`${pageUrl}?mode=match_representations&source=digital`);
 await expect(page.locator('.pacogo-clock__face')).toBeHidden();
 await expect(page.locator('.pacogo-clock__digital')).toHaveText('08:35');
 await expect(page.locator('.pacogo-clock__option-face')).toHaveCount(3);
 const choice=page.locator('.pacogo-clock__option[data-option-id="option-b"]');
 await expect(choice).toHaveAttribute('aria-label','Analoge tijd 08:35');
 await choice.click();await page.getByRole('button',{name:'Controleer antwoord'}).click();
 await expect(page.locator('#status')).toContainText('Goed');
 const trace=JSON.parse(await page.locator('#trace').textContent());
 expect(trace.task_type).toBe('match_representations');expect(trace.correctness).toBe(true);
 expect(trace.source_representation).toBe('digital_time');expect(trace.response_representation).toBe('representation_choice');
 expect(trace.option_representation).toBe('analog_clock');expect(trace.selected_option_id).toBe('option-b');
});
