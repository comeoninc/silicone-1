
import { EventFactory, Event, ICustomDragEvent, EventDecorator } from 'common';
import DataTransferModel from './DataTransferModel';

export type Enqueueable = (doneCallback?: () => any) => any;

class DragDropAction {

  private pendingActionsQueue: Array<Enqueueable> = [];
  private lastDragSource: HTMLElement = null;
  private lastDataTransfer = null;

  private queue(fn: Enqueueable) {
    this.pendingActionsQueue.push(fn);

    if (this.pendingActionsQueue.length === 1) {
      this.queueExecuteNext();
    }
  };

  private queueExecuteNext() {
    if (this.pendingActionsQueue.length === 0) return;

    const firstPendingAction = this.pendingActionsQueue[0];

    const doneCallback = () => {
      this.pendingActionsQueue.shift();
      this.queueExecuteNext();
    };

    if (firstPendingAction.length === 0) {
      firstPendingAction.call(this);
      doneCallback();
    } else {
      firstPendingAction.call(this, doneCallback);
    }
  };

  dragStart(targetElement: HTMLElement, eventProperties: any, callback?: EventDecorator) {
    const params = Event.parseParams(targetElement, eventProperties, callback);
    const events = ['mousedown', 'dragstart', 'drag'];
    const dataTransfer = new DataTransfer();

    const _decorator = (callback: EventDecorator) => (event: ICustomDragEvent) => {
      if (DataTransferModel.events.includes(event.type)) {
        event['dataTransfer'] = dataTransfer || new DataTransfer();
      }
      return callback(event);
    }

    this.queue(() => {
      Event.createAndDispatchEvents(params.targetElement, events, 'drag', dataTransfer, params.eventProperties, _decorator(params.callback));
      this.lastDragSource = targetElement;
      this.lastDataTransfer = dataTransfer;
    });


    /**
     * 
     * drag(el).then(() => wait(500)).then(() => drop(el))
     * 
     */
    return this;
  };

  dragEnter(overElement: HTMLElement, eventProperties: any, callback: EventDecorator) {
    const params = Event.parseParams(overElement, eventProperties, callback);
    const events = ['mousemove', 'mouseover', 'dragenter'];
    this.queue(() => Event.createAndDispatchEvents(params.targetElement, events, 'dragenter', this.lastDataTransfer, params.eventProperties, params.callback));
    return this;
  };

  dragOver(overElement, eventProperties, configCallback) {
    const params = Event.parseParams(overElement, eventProperties, configCallback);
    const events = ['mousemove', 'mouseover', 'dragover'];

    this.queue(() => {
      Event.createAndDispatchEvents(params.targetElement, events, 'drag', this.lastDataTransfer, params.eventProperties, params.callback);
    });

    return this;
  };

  dragLeave(overElement, eventProperties: any, callback: EventDecorator) {
    const params = Event.parseParams(overElement, eventProperties, callback);
    const events = ['mousemove', 'mouseover', 'dragleave'];

    this.queue(() => {
      Event.createAndDispatchEvents(params.targetElement, events, 'dragleave', this.lastDataTransfer, params.eventProperties, params.callback);
    });

    return this;
  };

  drop(targetElement, eventProperties: any, callback: EventDecorator) {
    const params = Event.parseParams(targetElement, eventProperties, callback);
    const eventsOnDropTarget = ['mousemove', 'mouseup', 'drop'];
    const eventsOnDragSource = ['dragend'];

    this.queue(() => {
      Event.createAndDispatchEvents(params.targetElement, eventsOnDropTarget, 'drop', this.lastDataTransfer, params.eventProperties, callback);

      if (this.lastDragSource) {
        // trigger dragend event on last drag source element
        Event.createAndDispatchEvents(this.lastDragSource, eventsOnDragSource, 'drop', this.lastDataTransfer, params.eventProperties, callback);
      }
    });

    return this;
  };

  then(callback) {
    // make sure _queue() is given a callback with no arguments
    this.queue(() => { callback.call(this); });
    return this;
  };

  delay(waitingTimeMs) {
    this.queue(doneCallback => {
      window.setTimeout(doneCallback, waitingTimeMs);
    });
    return this;
  };

}

export default DragDropAction;