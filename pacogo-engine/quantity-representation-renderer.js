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
 }else if(model.mode==='equal-groups'){
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
 }else{
  throw new TypeError(`Unsupported quantity representation model: ${model.mode}`);
 }
 const caption=document.createElement('figcaption');
 caption.className='pacogo-quantity-caption';
 caption.textContent=model.caption;
 figure.append(visual,caption);
 root.append(figure);
 return figure;
}
