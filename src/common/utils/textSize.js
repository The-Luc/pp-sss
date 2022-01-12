import { TEXT_CASE } from '../constants';

const createDummyElement = (text, options) => {
  const element = document.createElement('div');
  const textNode = document.createTextNode(text);

  element.appendChild(textNode);

  element.style.fontFamily = options.font;
  element.style.fontSize = options.fontSize;
  element.style.fontWeight = options.fontWeight;
  element.style.lineHeight = options.lineHeight;
  element.style.position = 'absolute';
  element.style.visibility = 'hidden';
  element.style.left = '-999px';
  element.style.top = '-999px';
  element.style.width = options.width;
  element.style.height = 'auto';
  element.style.wordBreak = options.wordBreak;

  document.body.appendChild(element);

  return element;
};

const destroyElement = element => {
  element.parentNode.removeChild(element);
};

const cache = {};

export default (text, options = {}) => {
  const cacheKey = JSON.stringify({ text: text, options: options });

  if (cache[cacheKey]) {
    return cache[cacheKey];
  }

  options.font = options.font || 'Times';
  options.fontSize = options.fontSize || '16px';
  options.fontWeight = options.fontWeight || 'normal';
  options.lineHeight = options.lineHeight || 'normal';
  options.width = options.width || 'auto';
  options.wordBreak = options.wordBreak || 'normal';

  const element = createDummyElement(text, options);

  const size = {
    width: element.offsetWidth,
    height: element.offsetHeight
  };

  destroyElement(element);

  cache[cacheKey] = size;

  return size;
};

export const measureTextWidth = (canvas, text, options) => {
  const ctx = canvas.getContext('2d');
  ctx.save();

  if (!options.textCase) options.textCase = TEXT_CASE.NONE;

  const textSplit = text.split('\n').map(value => {
    ctx.font = `${options.fontWeight} ${options.fontSize} ${options.fontFamily}`;
    const transformedText = transformTextCase(value, options.textCase);
    const { width } = ctx.measureText(transformedText);
    return width;
  });
  ctx.restore();
  return Math.max(...textSplit);
};

const transformTextCase = (string, textCase = TEXT_CASE.NONE) => {
  const transformOpt = {
    [TEXT_CASE.UPPER]: string => string.toUpperCase(),
    [TEXT_CASE.CAPITALIZE]: string =>
      string.charAt(0).toUpperCase() + string.slice(1),
    [TEXT_CASE.LOWER]: string => string.toLowerCase(),
    [TEXT_CASE.NONE]: string => string
  };
  return transformOpt[textCase](string);
};
