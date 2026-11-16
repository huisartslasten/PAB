function positiveInteger(value,label,max=40){const n=Number(value);if(!Number.isInteger(n)||n<1||n>max)throw new TypeError(`${label} must be an integer from 1 to ${max}`);return n;}
export function createDivisionRepresentationModel(config){
 if(!config||typeof config!=='object'||Array.isArray(config))throw new TypeError('A division representation config is required.');
 const total=positiveInteger(config.total,'total');
 if(config.mode==='sharing'){const group_count=positiveInteger(config.group_count,'group_count');if(group_count>total)throw new TypeError('group_count cannot exceed total.');return Object.freeze({mode:'sharing',total,group_count,accessible_label:`Eerlijk verdelen: ${total} voorwerpen over ${group_count} gelijke groepen; hoeveelheid per groep onbekend.`,caption:`${total} voorwerpen verdelen over ${group_count} groepen`});}
 if(config.mode==='grouping'){const items_per_group=positiveInteger(config.items_per_group,'items_per_group');if(items_per_group>total)throw new TypeError('items_per_group cannot exceed total.');return Object.freeze({mode:'grouping',total,items_per_group,accessible_label:`Groeperen: ${total} voorwerpen, ${items_per_group} per groep; aantal groepen onbekend.`,caption:`${total} voorwerpen; ${items_per_group} per groep`});}
 throw new TypeError(`Unsupported division representation mode: ${config.mode}`);
}
