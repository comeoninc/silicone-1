import EventTypes from './EventTypes';
import Error, { ErrorType } from './Error';
import Helpers from './Helpers';
import * as _is from 'is_js';
const is: Is = _is;

export interface IEventParams {
  targetElement: Element,
  eventProperties: any,
  callback: (event: Event) => Event
};

export interface ICustomDragEvent extends DragEvent {
  dataTransfer: DataTransfer;
}

export interface IEventCategory {
  [type: string]: Array<string>;
}

export interface IEventActionArguments {
  target: Element;
  options?: { [key: string]: any };
}

export type EventDecorator = (event: Event) => Event;
export type DecorableEventFunction = (targetElement: Element, eventProperties: any) => Promise<any>;
export type EventInterface = 'AnimationEvent' | 'AudioProcessingEvent' | 'BeforeInputEvent' | 'BeforeUnloadEvent' | 'BlobEvent' | 'ClipboardEvent' | 'CloseEvent' | 'CompositionEvent' | 'CSSFontFaceLoadEvent' | 'CustomEvent' | 'DeviceLightEvent' | 'DeviceMotionEvent' | 'DeviceOrientationEvent' | 'DeviceProximityEvent' | 'DOMTransactionEvent' | 'DragEvent' | 'EditingBeforeInputEvent' | 'ErrorEvent' | 'FetchEvent' | 'FocusEvent' | 'GamepadEvent' | 'HashChangeEvent' | 'IDBVersionChangeEvent' | 'InputEvent' | 'KeyboardEvent' | 'MediaStreamEvent' | 'MessageEvent' | 'MouseEvent' | 'MutationEvent' | 'OfflineAudioCompletionEvent' | 'PageTransitionEvent' | 'PointerEvent' | 'PopStateEvent' | 'ProgressEvent' | 'RelatedEvent' | 'RTCDataChannelEvent' | 'RTCIdentityErrorEvent' | 'RTCIdentityEvent' | 'RTCPeerConnectionIceEvent' | 'SensorEvent' | 'StorageEvent' | 'SVGEvent' | 'SVGZoomEvent' | 'TimeEvent' | 'TouchEvent' | 'TrackEvent' | 'TransitionEvent' | 'UIEvent' | 'UserProximityEvent' | 'WebGLContextEvent' | 'WheelEvent';

namespace Event {

  /**
   * Creates a new event
   * @private
   * @param eventName A string representing the name of the event
   * @param eventType See "Interfaces based on Event" at https://developer.mozilla.org/en/docs/Web/API/Event
   * @param eventProperties A dictionary of properties that will overwrite any default values
   */
  function createModernEvent(eventType: string, eventInterface: EventInterface, eventProperties = {}): Event {
    // Firefox fix (since FF does not allow us to override dataTransfer)
    if (eventInterface === 'DragEvent') eventInterface = 'CustomEvent';

    const constructor = window[eventInterface];
    const options = { view: window, bubbles: true, cancelable: true };
    const event: Event = new constructor(eventType, { ...options, ...eventProperties });

    return event;
  }

  /**
   * Creates a new event, the legacy way (document.createEvent)
   * @private
   * @param eventName A string representing the name of the event
   * @param eventType See "Interfaces based on Event" at https://developer.mozilla.org/en/docs/Web/API/Event
   * @param eventProperties A dictionary of properties that will overwrite any default values
   */
  function createLegacyEvent(eventName: string, eventType: EventInterface, eventProperties = {}): Event {
    let event;

    switch (eventType) {
      case 'MouseEvent':
        event = document.createEvent('MouseEvent');
        event.initEvent(eventName, true, true);
        break;

      default:
        event = document.createEvent('CustomEvent');
        event.initCustomEvent(eventName, true, true, 0);
    }

    return event;
  }

  /**
   * Returns the interface of the provided event name
   * @private
   * @param name A string representing the name of the event
   */
  function getInterfaceByEventType(name: string): EventInterface {
    return Object.keys(EventTypes).find($ => EventTypes[$].includes(name)) as EventInterface;
  }

  export function validateArguments(target: Element, options: any) {
    if (is.not.domNode(target))
      return Error.fail(`Expected 'target' argument to be a DOM element, instead got ${Helpers.getConstructName(target)}`, ErrorType.INVALID_ARGUMENT);
    if (is.not.json(options))
      return Error.fail(`Expected 'options' argument to be an object containing event properties, instead got ${Helpers.getConstructName(options)}`, ErrorType.INVALID_ARGUMENT);
  }

  export function create(eventType: string, eventProperties: { [key: string]: any }): Event {
    const eventInterface = getInterfaceByEventType(eventType);
    try {
      return createModernEvent(eventType, eventInterface, eventProperties);
    } catch (error) {
      return createLegacyEvent(eventType, eventInterface, eventProperties);
    }
  }

  export function dispatch(target: Element, event: Event) {
    const result = target.dispatchEvent(event);
    if (result === false) {
      const eventInterface = getInterfaceByEventType(event.type);
      Error.fail(`Failed to dispatch '${event.type}' (${eventInterface}) on <${target.tagName.toLowerCase()}> element`, ErrorType.EXECUTION_FAILURE);
    }
  }

  export function createAndDispatch(target: Element, eventType: string, eventProperties, decorator?: EventDecorator): Event {
    let event = create(eventType, eventProperties);
    debugger;
    if (decorator) event = decorator(event);
    dispatch(target, event);
    return event;
  }
};

export default Event;