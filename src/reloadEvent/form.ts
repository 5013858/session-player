export function triggerInput(input, enteredValue) {

    // const input = document.getElementById(enteredName);
  
    const lastValue = input.value;
  
    input.value = enteredValue;
  
    const event = new Event("input", { bubbles: true });
  
    const tracker = input._valueTracker;
  
    if (tracker) {
  
      tracker.setValue(lastValue);
  
    }
  
    input.dispatchEvent(event);
  
  }