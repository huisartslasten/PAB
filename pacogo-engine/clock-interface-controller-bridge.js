function createClockInterfaceControllerBridge({ interfaceInstance, controller, representation = 'digital' }) {
  if (!interfaceInstance || typeof interfaceInstance.setTime !== 'function' || typeof interfaceInstance.lock !== 'function') {
    throw new TypeError('interfaceInstance must expose setTime and lock');
  }
  if (!controller || typeof controller.submit !== 'function') {
    throw new TypeError('controller must expose submit');
  }
  if (!['analog', 'digital', 'choice'].includes(representation)) {
    throw new TypeError('representation must be analog, digital or choice');
  }

  let fallbackRepresentation = representation;

  const getRepresentation = () => {
    const current = typeof interfaceInstance.getRepresentation === 'function'
      ? interfaceInstance.getRepresentation()
      : fallbackRepresentation;
    if (!['analog', 'digital', 'choice'].includes(current)) {
      throw new TypeError('interface response representation must be analog, digital or choice');
    }
    fallbackRepresentation = current;
    return current;
  };

  const setTime = ({ hour, minute }) => {
    const responseRepresentation = getRepresentation();
    if (responseRepresentation === 'choice') {
      throw new TypeError('Use selectRepresentation for a choice response');
    }
    if (responseRepresentation === 'analog') {
      if (typeof controller.setAnalogTime !== 'function') throw new TypeError('controller does not support analog time');
      controller.setAnalogTime({ hour, minute });
    } else {
      if (typeof controller.setDigitalTime !== 'function') throw new TypeError('controller does not support digital time');
      controller.setDigitalTime({ hour, minute });
    }
  };

  const selectRepresentation = (optionId) => {
    if (getRepresentation() !== 'choice') {
      throw new TypeError('Representation selection is only available for choice responses');
    }
    if (typeof controller.selectRepresentation !== 'function') {
      throw new TypeError('controller does not support representation selection');
    }
    controller.selectRepresentation(optionId);
  };

  const submit = () => {
    const result = controller.submit();
    interfaceInstance.lock();
    return result;
  };

  return Object.freeze({ setTime, selectRepresentation, submit, getRepresentation });
}

export { createClockInterfaceControllerBridge };
