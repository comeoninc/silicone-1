import { Event, EventInterface, Error, ErrorType, ICustomDragEvent, IEventActionArguments, Helpers } from '../common';
import DataTransferModel from './DataTransferModel';
import * as _is from 'is_js';
const is: Is = _is;

const defaultDragEventOptions = { view: window, bubbles: true, cancelable: true };
const defaultDropOptions = { view: window, bubbles: true, cancelable: true, source: defaultDragEventOptions, target: defaultDragEventOptions };

export interface IDropOptions extends EventInit {
  source: { [key: string]: any };
  target: { [key: string]: any };
}

export function dragStart(target: Element | string, options: EventInit = defaultDragEventOptions): Event {
  if (is.string(target)) target = document.querySelector(target as string);
  Event.validateArguments(target as Element, options);
  const decorator = (event: Event) => {
    event['dataTransfer'] = new DataTransferModel();
    return event;
  }
  return Event.createAndDispatch(target as Element, 'dragstart', options, decorator);
}

export function dragEnter(target: Element | string, options: EventInit = defaultDragEventOptions): Event {
  if (is.string(target)) target = document.querySelector(target as string);
  Event.validateArguments(target as Element, options);
  return Event.createAndDispatch(target as Element, 'dragenter', options);

}

export function dragOver(target: Element | string, options: EventInit = defaultDragEventOptions): Event {
  if (is.string(target)) target = document.querySelector(target as string);
  Event.validateArguments(target as Element, options);
  return Event.createAndDispatch(target as Element, 'dragover', options);

}

export function dragLeave(target: Element | string, options: EventInit = defaultDragEventOptions): Event {
  if (is.string(target)) target = document.querySelector(target as string);
  Event.validateArguments(target as Element, options);
  return Event.createAndDispatch(target as Element, 'dragleave', options);

}

export function drop(source: Element | string, target: Element | string, options: IDropOptions = defaultDropOptions): Array<Event> {
  if (is.string(target)) target = document.querySelector(target as string);
  Event.validateArguments(target as Element, options.target);
  if (is.not.domNode(source))
    Error.fail(`Expected options field 'source' to be a DOM element, instead got ${Helpers.getConstructName(options.source)}`, ErrorType.INVALID_ARGUMENT);
  const dragEndEvt = Event.createAndDispatch(source as Element, 'dragend', options.source)
  const dropEvt = Event.createAndDispatch(target as Element, 'drop', options.target);
  return [dragEndEvt, dropEvt];
}

export function dragAndDrop(source: Element | string, target: Element | string, options: IDropOptions = defaultDropOptions): Array<Event> {
  if (is.string(source)) source = document.querySelector(source as string);
  if (is.string(target)) target = document.querySelector(target as string);
  if (!options.hasOwnProperty('source'))
    Error.fail(`Missing options field 'source', instead got ${Helpers.getConstructName(options.source)}`, ErrorType.INVALID_ARGUMENT);
  if (!options.hasOwnProperty('target'))
    Error.fail(`Missing options field 'target', instead got ${Helpers.getConstructName(options.source)}`, ErrorType.INVALID_ARGUMENT);

  const dragStartEvt = dragStart(source, options.source)
  const dropEvt = drop(source, target, options);

  return [dragStartEvt, ...dropEvt];
}