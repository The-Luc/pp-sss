import { findKey } from 'lodash';
import Color from 'color';
import { TEXT_HORIZONTAL_ALIGN, TEXT_VERTICAL_ALIGN } from '@/common/constants';
import { mapObject, convertRGBToHex } from '../utils';

const BORDER_STYLES_API = {
  SOLID: 'solid',
  DOUBLE: 'double',
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

  const alignment = {
    horizontal:
      TEXT_HORIZONTAL_ALIGN[style.text_alignment_horizontal] || 'left',
    vertical: TEXT_VERTICAL_ALIGN[style.text_alignment_vertical] || 'top'
  };

  const flip = {
    horizontal: style.horizontal_flip || false,
    vertical: style.vertical_flip || false
  };

  const border = {
    showBorder: style.show_border,
    stroke: style.border_color || '#000000',
    strokeDashArray: style.stroke_dash_array || [],
    strokeLineType: BORDER_STYLES_API[style.border_style] || 'solid',
    strokeWidth: style.border_stroke
  };

  const shadowOpacity = style.text_shadow_opacity || 0.5;
  const shadowColor = Color(style.text_shadow_color || '#000000')
    .alpha(shadowOpacity)
    .string();

  const shadow = {
    dropShadow: style.drop_shadow || true,
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
      fontId: style.font_id,
      fontSize: style.font_size,
      isBold: style.text_bold || false,
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

  const { shadow, border, alignment } = style;

  let horiAlign = findKeyByValue(TEXT_HORIZONTAL_ALIGN, alignment.horizontal);
  let vertiAlign = findKeyByValue(TEXT_VERTICAL_ALIGN, alignment.vertical);

  if (horiAlign === 'CENTER') horiAlign = 'CENTER_HORIZONTAL';
  if (vertiAlign === 'MIDDLE') vertiAlign = 'CENTER_VERTICAL';

  const alignmentStyle = {
    text_alignment_horizontal: horiAlign,
    text_alignment_vertical: vertiAlign
  };

  const borderStyle = {
    show_border: border.showBorder,
    border_color: border.stroke,
    stroke_dash_array: border.strokeDashArray,
    border_style: findKeyByValue(BORDER_STYLES_API, border.strokeLineType),
    border_stroke: border.strokeWidth
  };

  const shadowStyle = {
    // drop_shadow: shadow.dropShadow,
    text_shadow_angle: shadow.shadowAngle,
    text_shadow_blur: shadow.shadowBlur,
    text_shadow_color: convertRGBToHex(shadow.shadowColor),
    text_shadow_offset: shadow.shadowOffset,
    text_shadow_opacity: shadow.shadowOpacity
  };

  return {
    ...mapStyle,
    ...alignmentStyle,
    ...borderStyle,
    ...shadowStyle
  };
};

export const imageStyleMapping = imgStyle => {
  const {
    border_color,
    border_style,
    border_stroke,
    stroke_dash_array,
    drop_shadow_blur,
    drop_shadow_angle,
    drop_shadow_color,
    drop_shadow_offset,
    drop_shadow_opacity,
    id
  } = imgStyle;

  const border = {
    showBorder: true,
    stroke: border_color,
    strokeWidth: border_stroke,
    strokeDashArray: stroke_dash_array,
    strokeLineType: border_style
  };

  const shadow = {
    dropShadow: true,
    shadowBlur: drop_shadow_blur,
    shadowOffset: drop_shadow_offset,
    shadowOpacity: drop_shadow_opacity,
    shadowColor: drop_shadow_color,
    shadowAngle: drop_shadow_angle
  };

  return {
    id,
    style: { border, shadow },
    isCustom: true
  };
};

export const imageStyleMappingApi = style => {
  const mapRules = {
    data: {
      stroke: {
        name: 'border_color'
      },
      strokeWidth: {
        name: 'border_stroke'
      },
      strokeDashArray: {
        name: 'stroke_dash_array'
      },
      strokeLineType: {
        name: 'border_style'
      },
      // adding is-show-shadow field to turn on/off shadow

      shadowBlur: {
        name: 'drop_shadow_blur'
      },
      shadowOffset: {
        name: 'drop_shadow_offset'
      },
      shadowOpacity: {
        name: 'drop_shadow_opacity'
      },
      shadowAngle: {
        name: 'drop_shadow_angle'
      },
      shadowColor: {
        name: 'drop_shadow_color',
        parse: convertRGBToHex
      }
    },
    restrict: ['id', 'name', 'dropShadow', 'showBorder', 'strokeDashArray']
  };

  return mapObject(style, mapRules);
};
