import { findKey } from 'lodash';
import Color from 'color';
import { TEXT_HORIZONTAL_ALIGN, TEXT_VERTICAL_ALIGN } from '@/common/constants';
import { mapObject } from '../utils';
import { convertRGBToHex } from '../utils';

const BORDER_STYLES_API = {
  SOLID: 'solid',
  DOULBE: 'double',
  DASHED: 'square',
  DOTTED: 'round'
};

const TEXT_CASE_OPTS = {
  ALL_UPPER: 'upper',
  ALL_LOWER: 'lower',
  FIRST_UPPER: 'capitalize',
  NONE: 'none'
};

const findKeyByValue = (object, value) => {
  return findKey(object, val => val === value);
};

export const textStyleMapping = style => {
  if (style.text_alignment_horizontal === 'CENTER_HORIZONTAL')
    style.text_alignment_horizontal = 'CENTER';

  if (style.text_alignment_vertical === 'CENTER_VERTICAL')
    style.text_alignment_vertical = 'MIDDLE';

  // const alignHorizontal =
  const alignment = {
    horizontal:
      TEXT_HORIZONTAL_ALIGN[style.text_alignment_horizontal] || 'left',
    vertical: TEXT_VERTICAL_ALIGN[style.text_alignment_vertical] || 'top'
  };

  const flip = {
    horizontal: style.horizontal_flip || false, // Boolean
    vertical: style.vertical_flip || false // Boolean
  };

  const strokeWidth = style.border_stroke || 0;
  const showBorder = strokeWidth > 0;
  const border = {
    showBorder,
    stroke: style.border_color || '#000000', // string of hex color
    strokeDashArray: style.stroke_dash_array || [],
    strokeLineType: BORDER_STYLES_API[style.border_style] || 'solid',
    strokeWidth
  };

  const shadowOpacity = style.text_shaw_opacity || 0.5;
  const shadowColor = Color(style.text_shadow_color || '#000000')
    .alpha(shadowOpacity)
    .hex();

  const shadow = {
    dropShadow: true, // ???
    shadowAngle: style.text_shadow_angle || 270,
    shadowBlur: style.text_shadow_blur || 5,
    shadowColor,
    shadowOffset: style.text_shadow_offset || 2,
    shadowOpacity
  };

  return {
    name: style.name,
    id: style.id,
    style: {
      fontId: style.font_id, // check
      fontSize: style.font_size,
      isBold: style.font_weight || false, // check or using text weight
      isItalic: style.text_italic || false,
      isUnderline: style.text_underline || false,
      color: style.text_color || '#00000000',
      textCase: TEXT_CASE_OPTS[style.text_case] || 'none',
      letterSpacing: style.text_letter_spacing || 0,
      lineSpacing: style.text_line_spacing || 0,
      lineHeight: 1.2,
      alignment,
      border,
      flip,
      shadow
    }
  };
};

export const textStyleMappingApi = style => {
  const mapRules = {
    data: {
      fontSize: {
        name: 'font_size'
      },
      isBold: {
        name: 'text_bold'
      },
      isItalic: {
        name: 'text_italic'
      },
      isUnderline: {
        name: 'text_underline'
      },
      color: {
        name: 'text_color'
      },
      textCase: {
        name: 'text_case',
        parse: val => findKeyByValue(TEXT_CASE_OPTS, val)
      },
      letterSpacing: {
        name: 'text_letter_spacing'
      },
      lineSpacing: {
        name: 'text_line_spacing'
      }
    },
    restrict: ['flip', 'shadow', 'alignment', 'border', 'fontFamily']
  };

  const mapStyle = mapObject(style, mapRules);

  const { flip, shadow, border, alignment } = style;

  const flipStyle = {
    horizontal_flip: flip.horizontal,
    vertical_flip: flip.vertical
  };

  let horiAlign = findKeyByValue(TEXT_HORIZONTAL_ALIGN, alignment.horizontal);
  let vertiAlign = findKeyByValue(TEXT_VERTICAL_ALIGN, alignment.vertical);

  if (horiAlign === 'CENTER') horiAlign = 'CENTER_HORIZONTAL';
  if (vertiAlign === 'MIDDLE') vertiAlign = 'CENTER_VERTICAL';

  const alignmentStyle = {
    text_alignment_horizontal: horiAlign,
    text_alignment_vertical: vertiAlign
  };

  const border_stroke = border.showBorder ? border.strokeWidth : 0;
  const borderStyle = {
    border_color: border.stroke,
    // stroke_dash_array: border.strokeDashArray,
    border_style: findKeyByValue(BORDER_STYLES_API, border.strokeLineType),
    border_stroke
  };

  const shadowStyle = {
    text_shadow_angle: shadow.shadowAngle,
    text_shadow_blur: shadow.shadowBlur,
    text_shadow_color: convertRGBToHex(shadow.shadowColor),
    text_shadow_offset: shadow.shadowOffset,
    text_shadow_opacity: shadow.shadowOpacity
  };
  // adding drop shadow to turn on / off this function

  return {
    ...mapStyle,
    // ...flipStyle,
    ...alignmentStyle,
    ...borderStyle,
    ...shadowStyle
  };
};
