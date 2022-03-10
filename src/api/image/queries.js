import { gql } from 'graphql-tag';

export const imageStyleFragment = gql`
  fragment imageStyle on ImageStyle {
    show_border
    drop_shadow
    border_color
    border_style
    border_stroke
    border_type
    border_opacity
    stroke_dash_array
    drop_shadow_blur
    drop_shadow_angle
    drop_shadow_color
    drop_shadow_offset
    drop_shadow_opacity
    id
  }
`;

export const getUserImageStyleQuery = gql`
  query getUserImageStyles {
    user_image_styles {
      ...imageStyle
    }
  }
  ${imageStyleFragment}
`;
