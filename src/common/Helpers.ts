namespace Helpers {
  export function getConstructName(val: any): string {
    if (val && val.constructor) return val.constructor.name;
    if (val === null) return 'null';
    return typeof val;
  }

  export function sleep(time: number): Promise<{}> {
    return new Promise(resolve => setTimeout(resolve, time));
  }

  export const is = {
    object: (subject: any): boolean => Object(subject) === subject,
    domNode: (subject: any): boolean => is.object(subject) && subject.nodeType > 0,
    string: (subject: any): boolean => typeof subject === 'string',
    dictionary: (subject: any): boolean => toString.call(subject) === '[object Object]'
  };
}

export default Helpers;
