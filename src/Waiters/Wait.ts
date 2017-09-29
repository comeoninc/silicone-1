export enum Scope {
  SOME = 'some',
  EVERY = 'every',
  SINGLE = 'single'
}

export interface IAttributes {
  [key: string]: string
}

export type Resolver = (elementArray: Element[], arrayMethod: Scope.SOME | Scope.EVERY) => boolean

export const waitFor = (selector: string, scope: Scope = Scope.SINGLE) => {
  const elementsPromiseFactory = (resolver: Resolver) => new Promise(resolve => {
    const interval = setInterval(() => {
      const method = scope === Scope.SINGLE ? 'querySelector' : 'querySelectorAll';
      const elements = document[method](selector);
      const elementArray = elements instanceof NodeList ? Array.from(elements) : [elements];
      const arrayMethod = scope === Scope.SINGLE ? Scope.EVERY : scope;
      if (elementArray.length > 0) {
        if (resolver(elementArray, arrayMethod)) {
          clearInterval(interval);
          resolve(elements);
        }
      }
    });
  });

  return {
    toExist: async () => {
      const resolver: Resolver = (elements, method) => true;
      await elementsPromiseFactory(resolver);
      return;
    },
    toHaveAttributes: async (attributes: IAttributes) => {
      const resolver: Resolver = (elements, method) => elements[method](element => {
        return Object.keys(attributes).every(key => {
          return element.attributes[key] === attributes[key]
        });
      });
      await elementsPromiseFactory(resolver);
      return;
    },
    toContainText: async (text: string) => {
      const resolver: Resolver = (elements, method) => elements[method](element => element.innerHTML.includes(text));
      await elementsPromiseFactory(resolver);
      return;
    }
  };
};
