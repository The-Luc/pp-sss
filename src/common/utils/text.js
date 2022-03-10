import WebFont from 'webfontloader';
import { TEXT_CASE } from '../constants';
import { isEmpty } from '@/common/utils';
import { mapObject } from './util';

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
    [TEXT_CASE.UPPER]: str => str.toUpperCase(),
    [TEXT_CASE.CAPITALIZE]: str => str.charAt(0).toUpperCase() + str.slice(1),
    [TEXT_CASE.LOWER]: str => str.toLowerCase(),
    [TEXT_CASE.NONE]: str => str
  };
  return transformOpt[textCase](string);
};

export const loadFonts = fonts => {
  return new Promise((resolve, reject) => {
    const unavailableFonts = fonts.filter(
      font => !document.fonts.check(`72px ${font}`)
    );

    if (isEmpty(unavailableFonts)) {
      resolve();
      return;
    }

    WebFont.load({
      google: {
        families: unavailableFonts
      },
      active: resolve,
      inactive: reject,
      timeout: 10 * 1000 // 10 sec
    });
  });
};

/**
 * Get css style of item base on its style
 *
 * @param   {Object} style  style of item
 * @returns {Object}        css style of item
 */
export const getCssTextStyle = cssStyle => {
  if (isEmpty(cssStyle)) return {};

  const mapRules = {
    data: {
      fontSize: {
        name: 'fontSize',
        parse: value => {
          const fontSize = parseInt(value, 10) / 3;

          const calFontSize =
            fontSize > 50 ? 50 : fontSize < 16 ? 16 : fontSize;

          return `${calFontSize}px`;
        }
      }
    },
    restrict: []
  };

  return mapObject(cssStyle, mapRules);
};
