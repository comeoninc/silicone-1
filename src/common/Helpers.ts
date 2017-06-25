namespace Helpers {

  export function getConstructName(val: any): string {
    if (val && val.constructor) return val.constructor.name;
    if (val === null) return 'null';
    return typeof val;
  }

}

export default Helpers;
