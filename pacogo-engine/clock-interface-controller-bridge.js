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

  let fallbackRepresentation = representation;

  const getRepresentation = () => {
    const current = typeof interfaceInstance.getRepresentation === 'function'
      ? interfaceInstance.getRepresentation()
      : fallbackRepresentation;
    if (!['analog', 'digital'].includes(current)) {
      throw new TypeError('interface response representation must be analog or digital');
    }
    fallbackRepresentation = current;
    return current;
  };

  const setTime = ({ hour, minute }) => {
    const responseRepresentation = getRepresentation();
    if (responseRepresentation === 'analog') {
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

  return Object.freeze({ setTime, submit, getRepresentation });
}

export { createClockInterfaceControllerBridge };
