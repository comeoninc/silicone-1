import { EventFactory } from 'common';

export interface IEventParams {
  targetElement: HTMLElement,
  eventProperties: any,
  callback: (event: Event) => Event
};

export interface ICustomDragEvent extends DragEvent {
  dataTransfer: DataTransfer;
}

export interface IEventCategory {
  [type: string]: Array<string>;
}

export type EventDecorator = (event: Event) => Event;
export type EventType = 'AnimationEvent' | 'AudioProcessingEvent' | 'BeforeInputEvent' | 'BeforeUnloadEvent' | 'BlobEvent' | 'ClipboardEvent' | 'CloseEvent' | 'CompositionEvent' | 'CSSFontFaceLoadEvent' | 'CustomEvent' | 'DeviceLightEvent' | 'DeviceMotionEvent' | 'DeviceOrientationEvent' | 'DeviceProximityEvent' | 'DOMTransactionEvent' | 'DragEvent' | 'EditingBeforeInputEvent' | 'ErrorEvent' | 'FetchEvent' | 'FocusEvent' | 'GamepadEvent' | 'HashChangeEvent' | 'IDBVersionChangeEvent' | 'InputEvent' | 'KeyboardEvent' | 'MediaStreamEvent' | 'MessageEvent' | 'MouseEvent' | 'MutationEvent' | 'OfflineAudioCompletionEvent' | 'PageTransitionEvent' | 'PointerEvent' | 'PopStateEvent' | 'ProgressEvent' | 'RelatedEvent' | 'RTCDataChannelEvent' | 'RTCIdentityErrorEvent' | 'RTCIdentityEvent' | 'RTCPeerConnectionIceEvent' | 'SensorEvent' | 'StorageEvent' | 'SVGEvent' | 'SVGZoomEvent' | 'TimeEvent' | 'TouchEvent' | 'TrackEvent' | 'TransitionEvent' | 'UIEvent' | 'UserProximityEvent' | 'WebGLContextEvent' | 'WheelEvent';

namespace Event {

  export const categories: IEventCategory = {
    AnimationEvent: [],
    AudioProcessingEvent: [],
    BeforeInputEvent: [],
    BeforeUnloadEvent: [],
    BlobEvent: [],
    ClipboardEvent: [],
    CloseEvent: [],
    CompositionEvent: [],
    CSSFontFaceLoadEvent: [],
    CustomEvent: [],
    DeviceLightEvent: [],
    DeviceMotionEvent: [],
    DeviceOrientationEvent: [],
    DeviceProximityEvent: [],
    DOMTransactionEvent: [],
    DragEvent: [],
    EditingBeforeInputEvent: [],
    ErrorEvent: [],
    FetchEvent: [],
    FocusEvent: [],
    GamepadEvent: [],
    HashChangeEvent: [],
    IDBVersionChangeEvent: [],
    InputEvent: [],
    KeyboardEvent: [
      'keydown',
      'keyup',
      'keypress'
    ],
    MediaStreamEvent: [],
    MessageEvent: [],
    MouseEvent: [
      'click',
      'mousedown',
      'mouseup',
      'mouseover',
      'mousemove',
      'mouseout'
    ],
    MutationEvent: [],
    OfflineAudioCompletionEvent: [],
    PageTransitionEvent: [],
    PointerEvent: [],
    PopStateEvent: [],
    ProgressEvent: [],
    RelatedEvent: [],
    RTCDataChannelEvent: [],
    RTCIdentityErrorEvent: [],
    RTCIdentityEvent: [],
    RTCPeerConnectionIceEvent: [],
    SensorEvent: [],
    StorageEvent: [],
    SVGEvent: [],
    SVGZoomEvent: [],
    TimeEvent: [],
    TouchEvent: [],
    TrackEvent: [],
    TransitionEvent: [],
    UIEvent: [],
    UserProximityEvent: [],
    WebGLContextEvent: [],
    WheelEvent: [],
  }

  /**
   * Validates arguments a returns it's equivalent event parameters object.
   * @param targetElement A reference to a DOM element
   * @param eventProperties A dictionary containing properties
   * @param callback The event callback
   */
  export function parseParams(targetElement, eventProperties = {}, callback: (event: Event) => Event): IEventParams {
    if (typeof eventProperties === 'function') {
      callback = eventProperties;
      eventProperties = null;
    }

    if (!targetElement || typeof targetElement !== 'object') {
      throw new Error('Expected first parameter to be a targetElement. Instead got: ' + targetElement);
    }

    return { targetElement, eventProperties, callback };
  }


  /**
   * Creates an event and dispatches it to the specified target element
   * @param targetElement A reference to a DOM element
   * @param eventName A string representing the name of the event
   * @param eventProperties A dictionary of properties that will overwrite any default values
   * @param decorateEvent An event modifier that will mutate the event before execution
   */
  export function createAndDispatchEvents(targetElement: HTMLElement, eventName: string, eventProperties, decorateEvent: (event: Event) => Event) {
    const event = EventFactory.createEvent(eventName, eventProperties);
    targetElement.dispatchEvent(decorateEvent(event));
  }

  /**
   * Creates a new event
   * @param eventName A string representing the name of the event
   * @param eventType See "Interfaces based on Event" at https://developer.mozilla.org/en/docs/Web/API/Event
   * @param eventProperties A dictionary of properties that will overwrite any default values
   */
  export function createModernEvent(eventName: string, eventType: EventType, eventProperties = {}): Event {
    if (eventType === 'DragEvent') { eventType = 'CustomEvent'; }  // Firefox fix (since FF does not allow us to override dataTransfer)

    const constructor = window[eventType];
    const options = { view: window, bubbles: true, cancelable: true };
    const event: Event = new constructor(eventName, { ...options, ...eventProperties });

    return { ...event, ...eventProperties };
  }

  /**
   * Creates a new event the legacy way (document.createEvent)
   * @param eventName A string representing the name of the event
   * @param eventType See "Interfaces based on Event" at https://developer.mozilla.org/en/docs/Web/API/Event
   * @param eventProperties A dictionary of properties that will overwrite any default values
   */
  export function createLegacyEvent(eventName: string, eventType: EventType, eventProperties = {}): Event {
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

    return { ...event, ...eventProperties };
  }

  /**
   * Returns the type of the provided event name
   * @param name A string representing the name of the event
   */
  export function getTypeOfEventName(name: string): EventType {
    return Object.keys(categories).find($ => categories[$].includes(name)) as EventType;
  }

  /**
   * Creates an event
   * @param eventName A string representing the name of the event
   * @param eventType See "Interfaces based on Event" at https://developer.mozilla.org/en/docs/Web/API/Event
   * @param eventProperties A dictionary of properties that will overwrite any default values
   */
  export function createEvent(eventName, eventType, eventProperties): Event {
    try {
      return createModernEvent(eventName, eventType, eventProperties);
    } catch (error) {
      return createLegacyEvent(eventName, eventType, eventProperties);
    }
  }

};

export default Event;