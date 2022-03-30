import { get } from 'lodash';

import {
  convertAPIColorObjectToHex,
  mapObject,
  parseFromAPIShadow,
  pxToPt,
  isEmpty
} from '@/common/utils';

import { TextAlignment } from '../models/element';

import { DATABASE_DPI, BACKGROUND_PAGE_TYPE } from '../constants';

export const apiBackgroundToModel = background => {
  const mapRules = {
    data: {
      image_url: {
        name: 'imageUrl'
      },
      page_type: {
        name: 'pageType',
        parse: value => {
          const pageType = BACKGROUND_PAGE_TYPE[value]?.id;

          return isEmpty(pageType) ? value : pageType;
        }
      }
    },
    restrict: []
  };

  return mapObject(background, mapRules);
};

export const apiTextToModel = text => {
  const apiColor = get(text, 'text.view.font_color', {});
  const color = convertAPIColorObjectToHex(apiColor);

  const apiShadow = get(text, 'text.view.text_shadow');
  const shadow = parseFromAPIShadow(apiShadow);

  const mapRules = {
    data: {
      properties: {
        data: {
          guid: {
            name: 'id'
          }
        }
      },
      text: {
        data: {
          properties: {
            data: {
              text: {
                name: 'text'
              }
            }
          },
          view: {
            data: {
              text_alignment: {
                name: 'alignment',
                parse: val => new TextAlignment({ horizontal: val })
              },
              font_family: {
                name: 'fontFamily'
              },
              font_size: {
                name: 'fontSize',
                parse: val => Math.floor(pxToPt(val, DATABASE_DPI))
              },
              line_height: {
                name: 'lineHeight',
                parse: val => pxToPt(val, DATABASE_DPI)
              }
            }
          }
        }
      }
    },
    restrict: [
      'line_height',
      'type',
      'red',
      'green',
      'blue',
      'alpha',
      'style',
      'h_shadow',
      'v_shadow'
    ]
  };

  const mapData = mapObject(text, mapRules);
  return { ...mapData, color, shadow };
};
