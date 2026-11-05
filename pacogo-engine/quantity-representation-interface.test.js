import test from 'node:test';
import assert from 'node:assert/strict';
import { createQuantityRepresentationModel } from './quantity-representation-interface.js';

test('equal-groups representation preserves group count, group size and total',()=>{
 const model=createQuantityRepresentationModel({mode:'equal-groups',groups:4,items_per_group:3});
 assert.equal(model.total,12);assert.equal(model.groups,4);assert.equal(model.items_per_group,3);
 assert.match(model.accessible_label,/4 gelijke groepen van 3/);
});

test('array representation preserves row/column factors and total',()=>{
 const model=createQuantityRepresentationModel({mode:'array',rows:3,columns:4});
 assert.equal(model.total,12);assert.equal(model.rows,3);assert.equal(model.columns,4);
 assert.match(model.accessible_label,/3 rijen en 4 kolommen/);
});

test('quantity representation rejects invalid dimensions and unsupported modes',()=>{
 assert.throws(()=>createQuantityRepresentationModel({mode:'equal-groups',groups:0,items_per_group:3}),/groups/);
 assert.throws(()=>createQuantityRepresentationModel({mode:'array',rows:3,columns:0}),/columns/);
 assert.throws(()=>createQuantityRepresentationModel({mode:'circle',count:12}),/Unsupported/);
});
