function freezeTask(task) {
  return Object.freeze({
    id: task.id,
    source: "pacogo-original-variation",
    leftMixedNumber: Object.freeze({ wholeNumber: task.left[0], numerator: task.left[1], denominator: task.left[2] }),
    rightMixedNumber: Object.freeze({ wholeNumber: task.right[0], numerator: task.right[1], denominator: task.right[2] })
  });
}

// Niveau 5: beide termen zijn gemengde getallen en de breukdelen zijn ongelijknamig.
// De opgaven zijn nieuw samengesteld voor PacoGO; geen formele SLO- of mastery-mapping.
const FRACTION_ADDITION_LEVEL_5_GUIDED_TASKS = Object.freeze([
  freezeTask({ id: "fraction-addition-5-guided-01", left: [2,1,3], right: [1,1,4] }),
  freezeTask({ id: "fraction-addition-5-guided-02", left: [3,2,5], right: [2,1,6] }),
  freezeTask({ id: "fraction-addition-5-guided-03", left: [1,5,8], right: [2,1,4] }),
  freezeTask({ id: "fraction-addition-5-guided-04", left: [2,3,7], right: [1,2,3] }),
  freezeTask({ id: "fraction-addition-5-guided-05", left: [1,5,6], right: [3,3,4] }),
  freezeTask({ id: "fraction-addition-5-guided-06", left: [4,1,2], right: [2,2,3] }),
  freezeTask({ id: "fraction-addition-5-guided-07", left: [2,3,8], right: [1,5,8] }),
  freezeTask({ id: "fraction-addition-5-guided-08", left: [3,4,9], right: [2,5,9] }),
  freezeTask({ id: "fraction-addition-5-guided-09", left: [1,7,10], right: [2,2,5] }),
  freezeTask({ id: "fraction-addition-5-guided-10", left: [2,1,6], right: [3,1,3] })
]);

const FRACTION_ADDITION_LEVEL_5_INDEPENDENT_TASKS = Object.freeze([
  freezeTask({ id: "fraction-addition-5-independent-01", left: [2,1,5], right: [1,1,4] }),
  freezeTask({ id: "fraction-addition-5-independent-02", left: [3,2,7], right: [2,1,3] }),
  freezeTask({ id: "fraction-addition-5-independent-03", left: [1,3,8], right: [4,1,4] }),
  freezeTask({ id: "fraction-addition-5-independent-04", left: [2,5,6], right: [1,1,2] }),
  freezeTask({ id: "fraction-addition-5-independent-05", left: [3,3,4], right: [2,5,6] }),
  freezeTask({ id: "fraction-addition-5-independent-06", left: [1,7,8], right: [2,2,3] }),
  freezeTask({ id: "fraction-addition-5-independent-07", left: [4,2,5], right: [1,3,5] }),
  freezeTask({ id: "fraction-addition-5-independent-08", left: [2,3,10], right: [3,7,10] }),
  freezeTask({ id: "fraction-addition-5-independent-09", left: [1,4,9], right: [2,5,6] }),
  freezeTask({ id: "fraction-addition-5-independent-10", left: [3,1,8], right: [2,3,4] }),
  freezeTask({ id: "fraction-addition-5-independent-11", left: [2,5,12], right: [1,1,3] }),
  freezeTask({ id: "fraction-addition-5-independent-12", left: [1,5,7], right: [3,1,2] }),
  freezeTask({ id: "fraction-addition-5-independent-13", left: [2,2,9], right: [4,5,6] }),
  freezeTask({ id: "fraction-addition-5-independent-14", left: [3,1,4], right: [1,1,2] }),
  freezeTask({ id: "fraction-addition-5-independent-15", left: [1,2,3], right: [2,3,4] })
]);

export { FRACTION_ADDITION_LEVEL_5_GUIDED_TASKS, FRACTION_ADDITION_LEVEL_5_INDEPENDENT_TASKS };
