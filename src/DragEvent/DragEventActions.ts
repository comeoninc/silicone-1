import * as Silicone from '../';
import DataTransferModel from './DataTransferModel';

export interface IDraggableEventInit extends EventInit {
  dataTransfer?: DataTransferModel;
}

const defaultOptions = Silicone.Event.defaultEventOptions;

const defaultDropOptions = {
  view: window,
  bubbles: true,
  cancelable: true,
  source: defaultOptions,
  target: defaultOptions
};

export function dragEnter(target: Silicone.EventTarget, options: IDraggableEventInit = defaultOptions): Event {
  return Silicone.Event.genericActionEvent('dragenter', target as Element, options);
}

export function dragOver(target: Silicone.EventTarget, options: IDraggableEventInit = defaultOptions): Event {
  return Silicone.Event.genericActionEvent('dragover', target as Element, options);
}

export function dragLeave(target: Silicone.EventTarget, options: IDraggableEventInit = defaultOptions): Event {
  return Silicone.Event.genericActionEvent('dragleave', target as Element, options);
}

export function dragEnd(target: Silicone.EventTarget, options: IDraggableEventInit = defaultOptions) {
  return Silicone.Event.genericActionEvent('dragend', target as Element, options);
}

export function drag(target: Silicone.EventTarget, options: IDraggableEventInit = defaultOptions): Event {
  return Silicone.Event.genericActionEvent('drag', target as Element, options);
}

export function drop(target: Silicone.EventTarget, options: IDraggableEventInit = defaultOptions): Event {
  return Silicone.Event.genericActionEvent('drop', target as Element, options);
}

export function dragStart(target: Silicone.EventTarget, options: EventInit = defaultOptions): Event {
  if (Silicone.Helpers.is.string(target)) target = document.querySelector(target as string);
  Silicone.Event.validateArguments(target as Element, options);
  const decorator = (event: Event) => {
    event['dataTransfer'] = new DataTransferModel();
    return event;
  };
  return Silicone.Event.createAndDispatch(target as Element, 'dragstart', options, decorator);
}

/*export function drop(source: Silicone.EventTarget, target: Silicone.EventTarget, options: IDropOptions = defaultDropOptions): Array<Event> {
  if (is.string(target)) target = document.querySelector(target as string);
  Silicone.Event.validateArguments(target as Element, options.target);
  if (is.not.domNode(source))
    Silicone.Error.fail(`Expected options field 'source' to be a DOM element, instead got ${Silicone.Helpers.getConstructName(options.source)}`, Silicone.ErrorType.INVALID_ARGUMENT);
  const dropEvt = Silicone.Event.createAndDispatch(target as Element, 'drop', options.target);
  const dragEndEvt = dragEnd(source as Element, options.source);
  return [dropEvt, dragEndEvt];
}*/

export function dragAndDrop(
  source: Silicone.EventTarget,
  target: Silicone.EventTarget,
  options: { source: EventInit; target: EventInit } = defaultDropOptions
): Array<Event> {
  if (Silicone.Helpers.is.string(source)) source = document.querySelector(source as string);
  if (Silicone.Helpers.is.string(target)) target = document.querySelector(target as string);

  if (!options.hasOwnProperty('source')) {
    Silicone.Error.fail(
      `Missing options field 'source', instead got ${Silicone.Helpers.getConstructName(options.source)}`,
      Silicone.ErrorType.INVALID_ARGUMENT
    );
  }

  if (!options.hasOwnProperty('target')) {
    Silicone.Error.fail(
      `Missing options field 'target', instead got ${Silicone.Helpers.getConstructName(options.source)}`,
      Silicone.ErrorType.INVALID_ARGUMENT
    );
  }

  const mouseDownEvt = Silicone.mouseDown(source, options.source);
  const dragStartEvt = dragStart(source, options.source);

  const dragEvt = drag(source, {
    ...options.source,
    dataTransfer: dragStartEvt['dataTransfer']
  });

  const mouseMoveEvt = Silicone.mouseMove(source, options.source);
  const mouseUpEvt = Silicone.mouseUp(source, options.source);

  const dropEvt = drop(target, {
    ...options.target,
    dataTransfer: dragStartEvt['dataTransfer']
  });

  const dragEndEvt = dragEnd(source, {
    ...options.source,
    dataTransfer: dragStartEvt['dataTransfer']
  });

  return [mouseDownEvt, dragStartEvt, mouseMoveEvt, mouseUpEvt, dropEvt, dragEndEvt];
}
