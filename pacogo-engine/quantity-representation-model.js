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
