import * as Silicone from '../';

const defaultOptions = Silicone.Event.defaultEventOptions;

export function input(target: Silicone.EventTarget, options: EventInit = defaultOptions): Event {
  return Silicone.Event.genericActionEvent('input', target as Element, options);
}

export function change(target: Silicone.EventTarget, options: EventInit = defaultOptions): Event {
  return Silicone.Event.genericActionEvent('change', target as Element, options);
}
