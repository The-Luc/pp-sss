import { gql } from 'graphql-tag';

export const getFontsQuery = gql`
  query getFonts {
    fonts {
      id
      name
    }
  }
`;

export const textStyleFragment = gql`
  fragment textStyle on TextStyle {
    id
    name
    border_color
    border_style
    border_stroke
    horizontal_flip
    vertical_flip
    stroke_dash_array
    text_bold
    text_case
    text_color
    text_italic
    text_letter_spacing
    text_line_spacing
    text_alignment_vertical
    text_alignment_horizontal
    text_shadow_blur
    text_shadow_angle
    text_shadow_opacity
    text_shadow_offset
    text_shadow_color
    text_underline
    text_weight
    font_size
    font_id
  }
`;

export const getTextStyleQuery = gql`
  query getTextStyle {
    text_styles {
      ...textStyle
    }
  }
  ${textStyleFragment}
`;

export const getUserTextStyleQuery = gql`
  query getUserTextStyles {
    user_text_styles {
      ...textStyle
    }
  }
  ${textStyleFragment}
`;
