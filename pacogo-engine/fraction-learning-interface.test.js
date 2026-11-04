import assert from "node:assert/strict";
import { createFractionLearningInterfaceConfig } from "./fraction-learning-interface-contract.js";
import { createFractionInterfaceControllerBridge } from "./fraction-interface-controller-bridge.js";

const areaConfig = createFractionLearningInterfaceConfig({
  targetFraction: { numerator: 1, denominator: 2 },
  options: [
    { id: "equal", fraction: { numerator: 2, denominator: 4 } },
    { id: "not-equal", fraction: { numerator: 3, denominator: 4 } }
  ],
  representation: "area_model",
  responseProcessRequired: true
});
assert.equal(areaConfig.interfaceId, "fraction");
assert.equal(areaConfig.representation, "area_model");
assert.equal(areaConfig.targetRepresentation, "area_model");
assert.equal(areaConfig.optionRepresentation, "area_model");
assert.equal(areaConfig.targetLayout, "bar");
assert.equal(areaConfig.responseProcessRequired, true);
assert.equal(areaConfig.options.length, 2);
const mixedConfig = createFractionLearningInterfaceConfig({
  targetFraction: { numerator: 2, denominator: 3 },
  options: [
    { id: "eq", fraction: { numerator: 4, denominator: 6 } },
    { id: "neq", fraction: { numerator: 3, denominator: 5 } }
  ],
  targetRepresentation: "area_model",
  optionRepresentation: "symbolic_fraction",
  targetLayout: "grid",
  responseProcessRequired: true
});
assert.equal(mixedConfig.targetRepresentation, "area_model");
assert.equal(mixedConfig.optionRepresentation, "symbolic_fraction");
assert.equal(mixedConfig.targetLayout, "grid");
assert.throws(() => createFractionLearningInterfaceConfig({
  targetFraction: { numerator: 1, denominator: 2 },
  options: [{ id: "a", fraction: { numerator: 1, denominator: 2 } }, { id: "b", fraction: { numerator: 2, denominator: 4 } }],
  targetRepresentation: "unknown"
}), /targetRepresentation/);
assert.throws(() => createFractionLearningInterfaceConfig({
  targetFraction: { numerator: 1, denominator: 2 },
  options: [{ id: "a", fraction: { numerator: 1, denominator: 2 } }, { id: "b", fraction: { numerator: 2, denominator: 4 } }],
  targetRepresentation: "symbolic_fraction",
  targetLayout: "grid"
}), /requires an area_model/);
assert.throws(() => createFractionLearningInterfaceConfig({
  targetFraction: { numerator: 1, denominator: 2 },
  options: [{ id: "same", fraction: { numerator: 1, denominator: 2 } }, { id: "same", fraction: { numerator: 2, denominator: 4 } }]
}), /unique/);
assert.throws(() => createFractionLearningInterfaceConfig({
  targetFraction: { numerator: 3, denominator: 2 },
  options: [{ id: "a", fraction: { numerator: 1, denominator: 2 } }, { id: "b", fraction: { numerator: 2, denominator: 4 } }]
}), /proper fraction/);
assert.throws(() => createFractionLearningInterfaceConfig({
  targetFraction: { numerator: 1, denominator: 2 },
  options: [{ id: "a", fraction: { numerator: 1, denominator: 2 } }, { id: "b", fraction: { numerator: 2, denominator: 4 } }],
  representation: "unknown"
}), /representation/);

const events = [];
let selected = null;
let explanation = "";
let locked = false;
let submitCalls = 0;
const interfaceInstance = {
  getSelectedOptionId: () => selected,
  getExplanation: () => explanation,
  lock: () => { locked = true; },
};
const controller = {
  selectOption: (id, source) => { selected = id; events.push({ type: "selected", id, source }); },
  record: (type, payload) => events.push({ type, payload }),
  submit: (value, source) => {
    submitCalls += 1;
    return { observation: { response: { explanation: value, explanation_source: source } } };
  }
};
const bridge = createFractionInterfaceControllerBridge({
  interfaceInstance,
  controller,
  responseProcessRequired: true
});
bridge.handleInteraction({ type: "option_selected", optionId: "equal", source: "learner_input" });
bridge.handleInteraction({ type: "explanation_changed", explanation: "De delen zijn even groot.", source: "learner_input" });
explanation = "De delen zijn even groot.";
const result = bridge.submit();
assert.equal(result.observation.response.explanation, explanation);
assert.equal(events[0].id, "equal");
assert.equal(events[1].type, "explanation_changed");
assert.equal(locked, true);
assert.equal(bridge.isSubmitted(), true);
assert.equal(submitCalls, 1);
assert.throws(() => bridge.submit(), /already been submitted/);
assert.throws(() => bridge.handleInteraction({ type: "option_selected", optionId: "other" }), /already been submitted/);

let emptySelected = "x";
const emptyInterface = {
  getSelectedOptionId: () => emptySelected,
  getExplanation: () => "  ",
  lock: () => {}
};
const guardedBridge = createFractionInterfaceControllerBridge({
  interfaceInstance: emptyInterface,
  controller,
  responseProcessRequired: true
});
assert.throws(() => guardedBridge.submit(), /explanation is required/);
assert.equal(submitCalls, 1);

console.log("PacoGO Fraction Learning Interface contract and bridge passed.");
