import * as Silicone from '../';

export interface IEventParams {
  targetElement: Element;
  eventProperties: any;
  callback: (event: Event) => Event;
}

export interface IEventCategory {
  [type: string]: Array<string>;
}

export interface IEventActionArguments {
  target: Element;
  options?: { [key: string]: any };
}

export type EventTarget = Element | string;
export type EventDecorator = (event: Event) => Event;
export type DecorableEventFunction = (targetElement: Element, eventProperties: any) => Promise<any>;
export type EventInterface =
  | 'AnimationEvent'
  | 'AudioProcessingEvent'
  | 'BeforeInputEvent'
  | 'BeforeUnloadEvent'
  | 'BlobEvent'
  | 'ClipboardEvent'
  | 'CloseEvent'
  | 'CompositionEvent'
  | 'CSSFontFaceLoadEvent'
  | 'CustomEvent'
  | 'DeviceLightEvent'
  | 'DeviceMotionEvent'
  | 'DeviceOrientationEvent'
  | 'DeviceProximityEvent'
  | 'DOMTransactionEvent'
  | 'DragEvent'
  | 'EditingBeforeInputEvent'
  | 'ErrorEvent'
  | 'FetchEvent'
  | 'FocusEvent'
  | 'GamepadEvent'
  | 'HashChangeEvent'
  | 'IDBVersionChangeEvent'
  | 'InputEvent'
  | 'KeyboardEvent'
  | 'MediaStreamEvent'
  | 'MessageEvent'
  | 'MouseEvent'
  | 'MutationEvent'
  | 'OfflineAudioCompletionEvent'
  | 'PageTransitionEvent'
  | 'PointerEvent'
  | 'PopStateEvent'
  | 'ProgressEvent'
  | 'RelatedEvent'
  | 'RTCDataChannelEvent'
  | 'RTCIdentityErrorEvent'
  | 'RTCIdentityEvent'
  | 'RTCPeerConnectionIceEvent'
  | 'SensorEvent'
  | 'StorageEvent'
  | 'SVGEvent'
  | 'SVGZoomEvent'
  | 'TimeEvent'
  | 'TouchEvent'
  | 'TrackEvent'
  | 'TransitionEvent'
  | 'UIEvent'
  | 'UserProximityEvent'
  | 'WebGLContextEvent'
  | 'WheelEvent';

namespace Event {
  export const defaultEventOptions = {
    view: window,
    bubbles: true,
    cancelable: true
  };

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
    const event: Event = new constructor(eventType, {
      ...options,
      ...eventProperties
    });

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
    return Object.keys(Silicone.EventTypes).find($ => Silicone.EventTypes[$].includes(name)) as EventInterface;
  }

  export function validateArguments(target: Element, options: any) {
    if (!Silicone.Helpers.is.domNode(target))
      return Silicone.Error.fail(
        `Expected 'target' argument to be a DOM element, instead got ${Silicone.Helpers.getConstructName(target)}`,
        Silicone.ErrorType.INVALID_ARGUMENT
      );
    if (!Silicone.Helpers.is.dictionary(options))
      return Silicone.Error.fail(
        `Expected 'options' argument to be an object containing event properties, instead got ${Silicone.Helpers.getConstructName(
          options
        )}`,
        Silicone.ErrorType.INVALID_ARGUMENT
      );
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
      Silicone.Error.fail(
        `Failed to dispatch '${event.type}' (${eventInterface}) on <${target.tagName.toLowerCase()}> element`,
        Silicone.ErrorType.EXECUTION_FAILURE
      );
    }
  }

  export function createAndDispatch(
    target: Element,
    eventType: string,
    eventProperties,
    decorator?: EventDecorator
  ): Event {
    let event = create(eventType, eventProperties);
    if (decorator) event = decorator(event);
    dispatch(target, event);
    return event;
  }

  export function genericActionEvent(
    eventType: string,
    target: Element | string,
    options: EventInit = defaultEventOptions
  ): Event {
    if (Silicone.Helpers.is.string(target)) target = document.querySelector(target as string);
    if (!Object.keys(Silicone.EventTypes).some($ => Silicone.EventTypes[$].includes(eventType)))
      Silicone.Error.fail(
        `Invalid event type '${eventType}'. This is most likely a bug on our side, please report it!`,
        Silicone.ErrorType.EXECUTION_FAILURE
      );
    Silicone.Event.validateArguments(target as Element, options);
    return Silicone.Event.createAndDispatch(target as Element, eventType, options);
  }
}

export default Event;
