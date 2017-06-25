import { Event, EventInterface, Error, ErrorType, IEventActionArguments, Helpers } from '../common';

export const click = (target: Element | string, options: EventInit = Event.defaultDragEventOptions): Event => Event.genericActionEvent('click', target as Element, options);
export const doubleClick = (target: Element | string, options: EventInit = Event.defaultDragEventOptions): Event => Event.genericActionEvent('dblclick', target as Element, options);
export const scroll = (target: Element | string, options: EventInit = Event.defaultDragEventOptions): Event => Event.genericActionEvent('scroll', target as Element, options);
export const mouseEnter = (target: Element | string, options: EventInit = Event.defaultDragEventOptions): Event => Event.genericActionEvent('mouseenter', target as Element, options);
export const mouseLeave = (target: Element | string, options: EventInit = Event.defaultDragEventOptions): Event => Event.genericActionEvent('mouseleave', target as Element, options);
export const mouseMove = (target: Element | string, options: EventInit = Event.defaultDragEventOptions): Event => Event.genericActionEvent('mousemove', target as Element, options);
export const mouseOver = (target: Element | string, options: EventInit = Event.defaultDragEventOptions): Event => Event.genericActionEvent('mouseover', target as Element, options);
export const mouseUp = (target: Element | string, options: EventInit = Event.defaultDragEventOptions): Event => Event.genericActionEvent('mouseup', target as Element, options);
export const mouseDown = (target: Element | string, options: EventInit = Event.defaultDragEventOptions): Event => Event.genericActionEvent('mousedown', target as Element, options);
export const mouseOut = (target: Element | string, options: EventInit = Event.defaultDragEventOptions): Event => Event.genericActionEvent('mouseout', target as Element, options);