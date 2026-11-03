function createClockInterfaceControllerBridge({ interfaceInstance, controller, representation = 'digital' }) {
  if (!interfaceInstance || typeof interfaceInstance.setTime !== 'function' || typeof interfaceInstance.lock !== 'function') {
    throw new TypeError('interfaceInstance must expose setTime and lock');
  }
  if (!controller || typeof controller.submit !== 'function') {
    throw new TypeError('controller must expose submit');
  }
  if (!['analog', 'digital'].includes(representation)) {
    throw new TypeError('representation must be analog or digital');
  }

  let activeRepresentation = representation;

  const getActiveRepresentation = () => {
    const current = typeof interfaceInstance.getRepresentation === 'function'
      ? interfaceInstance.getRepresentation()
      : activeRepresentation;
    if (!['analog', 'digital'].includes(current)) {
      throw new TypeError('interface representation must be analog or digital');
    }
    activeRepresentation = current;
    return current;
  };

  const setRepresentation = (nextRepresentation) => {
    if (!['analog', 'digital'].includes(nextRepresentation)) {
      throw new TypeError('representation must be analog or digital');
    }
    if (typeof interfaceInstance.setRepresentation === 'function') {
      interfaceInstance.setRepresentation(nextRepresentation, 'controller_bridge');
    }
    activeRepresentation = nextRepresentation;
  };

  const setTime = ({ hour, minute }) => {
    const representationInUse = getActiveRepresentation();
    if (representationInUse === 'analog') {
      if (typeof controller.setAnalogTime !== 'function') throw new TypeError('controller does not support analog time');
      controller.setAnalogTime({ hour, minute });
    } else {
      if (typeof controller.setDigitalTime !== 'function') throw new TypeError('controller does not support digital time');
      controller.setDigitalTime({ hour, minute });
    }
  };

  const submit = () => {
    const result = controller.submit();
    interfaceInstance.lock();
    return result;
  };

  return Object.freeze({ setTime, setRepresentation, submit, getRepresentation: getActiveRepresentation });
}

export { createClockInterfaceControllerBridge };
