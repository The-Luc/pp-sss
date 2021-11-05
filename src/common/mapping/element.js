import {
  convertAPIColorObjectToHex,
  mapObject,
  parseFromAPIShadow,
  pxToPt
} from '@/common/utils';
import { get } from 'lodash';
import { DATABASE_DPI } from '../constants';
import { TextAlignment } from '../models/element';

export const textMappingFromAPI = text => {
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
                parse: val => pxToPt(val, DATABASE_DPI)
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
      'font_family',
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
