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

  const {
    text_alignment_vertical,
    text_alignment_horizontal,
    horizontal_flip,
    vertical_flip,
    show_border,
    border_color,
    stroke_dash_array,
    border_style,
    border_stroke,
    text_shadow_opacity,
    text_shadow_color,
    text_shadow_angle,
    text_shadow_offset,
    drop_shadow,
    text_shadow_blur,
    font_id,
    font_size,
    text_bold,
    text_italic,
    text_underline,
    text_letter_spacing,
    text_line_spacing,
    text_case,
    text_color
  } = style;
  const alignment = {
    horizontal: TEXT_HORIZONTAL_ALIGN[text_alignment_horizontal] || 'left',
    vertical: TEXT_VERTICAL_ALIGN[text_alignment_vertical] || 'top'
  };

  const flip = {
    horizontal: Boolean(horizontal_flip),
    vertical: Boolean(vertical_flip)
  };

  const border = {
    showBorder: show_border,
    stroke: border_color || '#000000',
    strokeDashArray: stroke_dash_array,
    strokeLineType: BORDER_STYLES_API[border_style] || 'solid',
    strokeWidth: border_stroke
  };

  const shadowOpacity = Number.isFinite(text_shadow_opacity)
    ? text_shadow_opacity
    : 0.5;

  const shadowColor = Color(text_shadow_color || '#000000')
    .alpha(shadowOpacity)
    .string();

  const shadow = {
    dropShadow: Boolean(drop_shadow),
    shadowAngle: Number.isFinite(text_shadow_angle) ? text_shadow_angle : 270,
    shadowBlur: Number.isFinite(text_shadow_blur) ? text_shadow_blur : 5,
    shadowColor,
    shadowOffset: Number.isFinite(text_shadow_offset) ? text_shadow_offset : 2,
    shadowOpacity
  };

  return {
    name: style.name,
    id: style.id,
    style: {
      fontId: font_id,
      fontSize: font_size,
      isBold: Boolean(text_bold),
      isItalic: Boolean(text_italic),
      isUnderline: Boolean(text_underline),
      color: text_color || '#00000000',
      textCase: TEXT_CASE_OPTS[text_case] || 'none',
      letterSpacing: text_letter_spacing || 0,
      lineSpacing: text_line_spacing || 0,
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
    drop_shadow: shadow.dropShadow,
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
    show_border,
    drop_shadow,
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
    showBorder: show_border,
    stroke: border_color,
    strokeWidth: border_stroke,
    strokeDashArray: stroke_dash_array,
    strokeLineType: border_style
  };
  const shadowOpacity = drop_shadow_opacity;
  const hexOpacity = shadowOpacity
    ? Math.ceil((255 / shadowOpacity) * shadowOpacity).toString(16)
    : '00';

  const shadowColor = `${drop_shadow_color + hexOpacity}`;

  const shadow = {
    dropShadow: drop_shadow,
    shadowBlur: drop_shadow_blur,
    shadowOffset: drop_shadow_offset,
    shadowOpacity,
    shadowColor,
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
      dropShadow: {
        name: 'drop_shadow'
      },
      showBorder: {
        name: 'show_border'
      },
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
    restrict: ['id', 'name', 'strokeDashArray']
  };

  return mapObject(style, mapRules);
};
