import * as Silicone from '../';

const defaultOptions = Silicone.Event.defaultEventOptions;

export function click(target: Silicone.EventTarget, options: EventInit = defaultOptions): Event {
  return Silicone.Event.genericActionEvent('click', target as Element, options);
}

export function doubleClick(target: Silicone.EventTarget, options: EventInit = defaultOptions): Event {
  return Silicone.Event.genericActionEvent('dblclick', target as Element, options);
}

export function scroll(target: Silicone.EventTarget, options: EventInit = defaultOptions): Event {
  return Silicone.Event.genericActionEvent('scroll', target as Element, options);
}

export function mouseEnter(target: Silicone.EventTarget, options: EventInit = defaultOptions): Event {
  return Silicone.Event.genericActionEvent('mouseenter', target as Element, options);
}

export function mouseLeave(target: Silicone.EventTarget, options: EventInit = defaultOptions): Event {
  return Silicone.Event.genericActionEvent('mouseleave', target as Element, options);
}

export function mouseMove(target: Silicone.EventTarget, options: EventInit = defaultOptions): Event {
  return Silicone.Event.genericActionEvent('mousemove', target as Element, options);
}

export function mouseOver(target: Silicone.EventTarget, options: EventInit = defaultOptions): Event {
  return Silicone.Event.genericActionEvent('mouseover', target as Element, options);
}

export function mouseUp(target: Silicone.EventTarget, options: EventInit = defaultOptions): Event {
  return Silicone.Event.genericActionEvent('mouseup', target as Element, options);
}

export function mouseDown(target: Silicone.EventTarget, options: EventInit = defaultOptions): Event {
  return Silicone.Event.genericActionEvent('mousedown', target as Element, options);
}

export function mouseOut(target: Silicone.EventTarget, options: EventInit = defaultOptions): Event {
  return Silicone.Event.genericActionEvent('mouseout', target as Element, options);
}
