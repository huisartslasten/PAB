export function renderDivisionRepresentation({root,model}){
 if(!root||!model)throw new TypeError('root and model are required');root.replaceChildren();
 const figure=document.createElement('figure');figure.className='pacogo-division-representation';figure.setAttribute('role','img');figure.setAttribute('aria-label',model.accessible_label);
 const pool=document.createElement('div');pool.className='pacogo-division-pool';
 for(let i=0;i<model.total;i++){const dot=document.createElement('span');dot.className='pacogo-division-dot';dot.setAttribute('aria-hidden','true');pool.append(dot);}figure.append(pool);
 const constraint=document.createElement('div');constraint.className='pacogo-division-constraint';
 if(model.mode==='sharing'){constraint.textContent=`${model.group_count} gelijke groepen`;const groups=document.createElement('div');groups.className='pacogo-division-groups';for(let i=0;i<model.group_count;i++){const group=document.createElement('span');group.className='pacogo-division-group';group.textContent='?';group.setAttribute('aria-hidden','true');groups.append(group);}figure.append(constraint,groups);}
 else{constraint.textContent=`${model.items_per_group} in elke groep`;const sample=document.createElement('div');sample.className='pacogo-division-sample';for(let i=0;i<model.items_per_group;i++){const dot=document.createElement('span');dot.className='pacogo-division-dot';dot.setAttribute('aria-hidden','true');sample.append(dot);}figure.append(constraint,sample);}
 const caption=document.createElement('figcaption');caption.className='pacogo-division-caption';caption.textContent=model.caption;figure.append(caption);root.append(figure);return figure;
}
