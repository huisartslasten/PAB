function positiveInteger(value,label,max=40){
 const number=Number(value);
 if(!Number.isInteger(number)||number<1||number>max)throw new TypeError(`${label} must be an integer from 1 to ${max}`);
 return number;
}

export function createQuantityRepresentationModel(config){
 if(!config||typeof config!=='object'||Array.isArray(config))throw new TypeError('A quantity representation config is required.');
 if(config.mode==='equal-groups'){
  const groups=positiveInteger(config.groups,'groups');
  const itemsPerGroup=positiveInteger(config.items_per_group,'items_per_group');
  return Object.freeze({
   mode:'equal-groups',groups,items_per_group:itemsPerGroup,total:groups*itemsPerGroup,
   accessible_label:`${groups} gelijke groepen van ${itemsPerGroup}; totaal ${groups*itemsPerGroup}`,
   caption:`${groups} groepjes van ${itemsPerGroup}`
  });
 }
 if(config.mode==='array'){
  const rows=positiveInteger(config.rows,'rows');
  const columns=positiveInteger(config.columns,'columns');
  return Object.freeze({
   mode:'array',rows,columns,total:rows*columns,
   accessible_label:`Array met ${rows} rijen en ${columns} kolommen; totaal ${rows*columns}`,
   caption:`${rows} rijen × ${columns} kolommen`
  });
 }
 throw new TypeError(`Unsupported quantity representation mode: ${config.mode}`);
}

export function renderQuantityRepresentation({root,model}){
 if(!root||!model)throw new TypeError('root and model are required');
 root.replaceChildren();
 const figure=document.createElement('figure');
 figure.className='pacogo-quantity-representation';
 figure.setAttribute('role','img');
 figure.setAttribute('aria-label',model.accessible_label);
 const visual=document.createElement('div');
 visual.className=model.mode==='array'?'pacogo-quantity-array':'pacogo-quantity-groups';
 if(model.mode==='array'){
  visual.style.gridTemplateColumns=`repeat(${model.columns}, minmax(14px, 1fr))`;
  for(let index=0;index<model.total;index+=1){
   const cell=document.createElement('span');
   cell.className='pacogo-quantity-cell';
   cell.setAttribute('aria-hidden','true');
   visual.append(cell);
  }
 }else{
  visual.style.gridTemplateColumns=`repeat(${model.groups}, minmax(0, 1fr))`;
  for(let groupIndex=0;groupIndex<model.groups;groupIndex+=1){
   const group=document.createElement('div');
   group.className='pacogo-quantity-group';
   for(let item=0;item<model.items_per_group;item+=1){
    const dot=document.createElement('span');
    dot.className='pacogo-quantity-dot';
    dot.setAttribute('aria-hidden','true');
    group.append(dot);
   }
   visual.append(group);
  }
 }
 const caption=document.createElement('figcaption');
 caption.className='pacogo-quantity-caption';
 caption.textContent=model.caption;
 figure.append(visual,caption);
 root.append(figure);
 return figure;
}
