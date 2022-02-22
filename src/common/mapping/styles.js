import { TEXT_HORIZONTAL_ALIGN, TEXT_VERTICAL_ALIGN } from '@/common/constants';

export const textStyleMapping = style => {
  if (style.text_alignment_horizontal === 'CENTER_HORIZONTAL')
    style.text_alignment_horizontal = 'CENTER';

  if (style.text_alignment_vertical === 'CENTER_VERTICAL')
    style.text_alignment_vertical = 'MIDDLE';

  const BORDER_STYLES_API = {
    SOLID: 'solid',
    DOULBE: 'double',
    DASHED: 'square',
    DOTTED: 'round'
  };

  const TEXT_CASE_OPTS = {
    ALL_UPPER: 'uppercase',
    ALL_LOWER: 'lowercase',
    FIRST_UPPER: 'capitalize'
  };

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

  const shadow = {
    dropShadow: true, // ???
    shadowAngle: style.text_shadow_angle || 270,
    shadowBlur: style.text_shadow_blur || 5,
    shadowColor: style.text_shadow_color || '#00000000',
    shadowOffset: style.text_shadow_offset || 2,
    shadowOpacity: style.text_shadow_opacity || 0.5
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
      color: style.text_color || '#000000',
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
