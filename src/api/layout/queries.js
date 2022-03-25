import { gql } from 'graphql-tag';

export const getLayoutsPreviewQuery = gql`
  query getLayoutsPreview($themeId: ID!) {
    theme(id: $themeId) {
      id
      templates {
        id
        preview_image_url
      }
    }
  }
`;

export const getLayoutsQuery = gql`
  query getLayouts($themeId: ID!) {
    theme(id: $themeId) {
      id
      templates {
        id
        data
        preview_image_url
        layout_use
        layout_type
        title
      }
    }
  }
`;

export const getLayoutElementsQuery = gql`
  query getLayoutElements($id: ID!) {
    template(id: $id) {
      id
      data
      preview_image_url
      layout
    }
  }
`;

export const getUserLayoutsQuery = gql`
  query getUserLayouts {
    double_page: user_saved_print_layouts(layout_type: DOUBLE_PAGE) {
      id
      layout_type
      preview_image_url
      title
    }
    single_page: user_saved_print_layouts(layout_type: SINGLE_PAGE) {
      id
      layout_type
      preview_image_url
      title
    }
  }
`;

export const digitalTemplateFragment = gql`
  fragment digitalTemplate on DigitalTemplate {
    id
    title
    digital_transitions {
      id
      duration
      direction
      transition_order
      transition_type
    }
    preview_image_url
    is_supplemental
    digital_frame_templates {
      objects
      play_in_ids
      play_out_ids
      preview_image_url
      id
      background {
        id
        image_url
        name
        thumbnail
        page_type
      }
    }
  }
`;

export const getUserDigitalLayoutsQuery = gql`
  query getUserDigitalTemplate {
    user_saved_digital_layouts {
      ...digitalTemplate
    }
  }
  ${digitalTemplateFragment}
`;
