import DragDropAction from './DragDropAction';

export default {
  dragStart: function (targetElement, eventProperties, configCallback) {
    return new DragDropAction()['dragStart'](targetElement, eventProperties, configCallback);
  },
  dragEnter: function (targetElement, eventProperties, configCallback) {
    return new DragDropAction()['dragEnter'](targetElement, eventProperties, configCallback);
  },
  dragOver: function (targetElement, eventProperties, configCallback) {
    return new DragDropAction()['dragOver'](targetElement, eventProperties, configCallback);
  },
  dragLeave: function (targetElement, eventProperties, configCallback) {
    return new DragDropAction()['dragLeave'](targetElement, eventProperties, configCallback);
  },
  drop: function (targetElement, eventProperties, configCallback) {
    return new DragDropAction()['drop'](targetElement, eventProperties, configCallback);
  }
};