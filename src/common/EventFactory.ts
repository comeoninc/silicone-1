import { Event } from 'common';

class EventFactory {
  static createEvent(eventName, eventProperties) {
    let eventType = 'CustomEvent';

    if (eventName.match(/^mouse/)) {
      eventType = 'MouseEvent';
    }

    return Event.createEvent(eventName, eventType, eventProperties);
  }
};

export default EventFactory;