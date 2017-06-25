import { Event, EventInterface, Error, ErrorType, IEventActionArguments, Helpers } from '../common';
import { mouseUp, mouseMove, mouseDown } from '../MouseEvent/MouseEventActions';
import DataTransferModel from './DataTransferModel';
import * as _is from 'is_js';
const is: Is = _is;

export interface IDraggableEventInit extends EventInit {
  dataTransfer?: DataTransferModel
}

const defaultDropOptions = { view: window, bubbles: true, cancelable: true, source: Event.defaultDragEventOptions, target: Event.defaultDragEventOptions };

export const dragEnter = (target: Element | string, options: IDraggableEventInit = Event.defaultDragEventOptions): Event => Event.genericActionEvent('dragenter', target as Element, options);
export const dragOver = (target: Element | string, options: IDraggableEventInit = Event.defaultDragEventOptions): Event => Event.genericActionEvent('dragover', target as Element, options);
export const dragLeave = (target: Element | string, options: IDraggableEventInit = Event.defaultDragEventOptions): Event => Event.genericActionEvent('dragleave', target as Element, options);
export const dragEnd = (target: Element | string, options: IDraggableEventInit = Event.defaultDragEventOptions) => Event.genericActionEvent('dragend', target as Element, options);
export const drag = (target: Element | string, options: IDraggableEventInit = Event.defaultDragEventOptions): Event => Event.genericActionEvent('drag', target as Element, options);
export const drop = (target: Element | string, options: IDraggableEventInit = Event.defaultDragEventOptions): Event => Event.genericActionEvent('drop', target as Element, options);

export function dragStart(target: Element | string, options: EventInit = Event.defaultDragEventOptions): Event {
  if (is.string(target)) target = document.querySelector(target as string);
  Event.validateArguments(target as Element, options);
  const decorator = (event: Event) => {
    event['dataTransfer'] = new DataTransferModel();
    return event;
  }
  return Event.createAndDispatch(target as Element, 'dragstart', options, decorator);
}

/*export function drop(source: Element | string, target: Element | string, options: IDropOptions = defaultDropOptions): Array<Event> {
  if (is.string(target)) target = document.querySelector(target as string);
  Event.validateArguments(target as Element, options.target);
  if (is.not.domNode(source))
    Error.fail(`Expected options field 'source' to be a DOM element, instead got ${Helpers.getConstructName(options.source)}`, ErrorType.INVALID_ARGUMENT);
  const dropEvt = Event.createAndDispatch(target as Element, 'drop', options.target);
  const dragEndEvt = dragEnd(source as Element, options.source);
  return [dropEvt, dragEndEvt];
}*/

export function dragAndDrop(source: Element | string, target: Element | string, options: { source: EventInit, target: EventInit } = defaultDropOptions): Array<Event> {
  if (is.string(source)) source = document.querySelector(source as string);
  if (is.string(target)) target = document.querySelector(target as string);
  if (!options.hasOwnProperty('source'))
    Error.fail(`Missing options field 'source', instead got ${Helpers.getConstructName(options.source)}`, ErrorType.INVALID_ARGUMENT);
  if (!options.hasOwnProperty('target'))
    Error.fail(`Missing options field 'target', instead got ${Helpers.getConstructName(options.source)}`, ErrorType.INVALID_ARGUMENT);

  const mouseDownEvt = mouseDown(source, options.source);
  const dragStartEvt = dragStart(source, options.source);
  const dragEvt = drag(source, { ...options.source, dataTransfer: dragStartEvt['dataTransfer'] });
  const mouseMoveEvt = mouseMove(source, options.source);
  const mouseUpEvt = mouseUp(source, options.source);
  const dropEvt = drop(target, { ...options.target, dataTransfer: dragStartEvt['dataTransfer'] });
  const dragEndEvt = dragEnd(source, { ...options.source, dataTransfer: dragStartEvt['dataTransfer'] });

  return [mouseDownEvt, dragStartEvt, mouseMoveEvt, mouseUpEvt, dropEvt, dragEndEvt];
}