import * as Silicone from '../';

export interface ITypeOptions extends EventInit {
  typeSpeed: number;
}

const defaultOptions = {
  typeSpeed: 100
};

export function type(
  target: Silicone.EventTarget,
  text: string,
  options: ITypeOptions = defaultOptions
): Promise<Event[]> {
  if (Silicone.Helpers.is.string(target)) target = document.querySelector(target as string);
  const letters = text.split('');

  const typeLetter = (letter: string, delay: number): Promise<Event> => {
    return new Promise(async resolve => {
      await Silicone.Helpers.sleep(delay);
      (target as HTMLInputElement).value += letter;
      resolve(Silicone.input(target));
    });
  };

  const iterable = letters.map(($, $$) => typeLetter($, options.typeSpeed * $$));

  return Promise.all(iterable);
}
