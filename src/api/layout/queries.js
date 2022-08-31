import { gql } from 'graphql-tag';
import { templateMappingDetail } from '../mapping/mutations';

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

export const templateFragment = gql`
  fragment templateDetail on Template {
    id
    preview_image_url
    layout_use
    layout_type
    title
    template_element_mappings {
      ...templateMappingDetail
    }
  }
  ${templateMappingDetail}
`;

export const getLayoutsQuery = gql`
  query getLayouts($themeId: ID!) {
    template_book_pair(id: $themeId) {
      id
      template_book {
        id
        templates {
          ...templateDetail
        }
      }
      spread_template_book {
        id
        templates {
          ...templateDetail
        }
      }
    }
  }
  ${templateFragment}
`;

export const getLayoutsByTypeQuery = gql`
  query getLayoutByType($layoutUse: TemplateLayoutUseType!) {
    template_book_pairs {
      id
      template_book {
        id
        templates(layout_use: $layoutUse) {
          ...templateDetail
        }
      }
      spread_template_book {
        id
        templates(layout_use: $layoutUse) {
          ...templateDetail
        }
      }
    }
  }
  ${templateFragment}
`;

export const getAssortedLayoutQuery = gql`
  query assorted {
    categories {
      id
      name
      templates {
        ...templateDetail
      }
    }
  }
  ${templateFragment}
`;

export const getPrintLayoutByIdQuery = gql`
  query getPrintLayoutById($id: ID!) {
    template(id: $id) {
      ...templateDetail
    }
  }
  ${templateFragment}
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
      ...templateDetail
    }
    single_page: user_saved_print_layouts(layout_type: SINGLE_PAGE) {
      ...templateDetail
    }
  }
  ${templateFragment}
`;

export const digitalTemplateFragment = gql`
  fragment digitalTemplate on DigitalTemplate {
    id
    title
    preview_image_url
    is_supplemental
    layout_use
    layout_type
    digital_frame_templates {
      id
      template_element_mappings {
        id
        print_element_uid
        digital_element_uid
        template {
          id
          title
        }
      }
    }
  }
`;

export const getDigitalTemplateQuery = gql`
  query getDigitalTemplate($themeId: ID!) {
    theme(id: $themeId) {
      id
      digital_templates {
        ...digitalTemplate
      }
    }
  }
  ${digitalTemplateFragment}
`;

export const getDigitalTemplateByTypeQuery = gql`
  query getDigitalTemplateByType($layoutUse: TemplateLayoutUseType) {
    themes {
      id
      digital_templates(layout_use: $layoutUse) {
        ...digitalTemplate
      }
    }
  }
  ${digitalTemplateFragment}
`;

export const getUserDigitalLayoutsQuery = gql`
  query getUserDigitalTemplate {
    user_saved_digital_layouts {
      ...digitalTemplate
    }
  }
  ${digitalTemplateFragment}
`;

/**
 * Get layout elements
 */
export const getDigitalLayoutQuery = gql`
  query getDigitalTemplate($id: ID!) {
    digital_template(id: $id) {
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
      layout_use
      layout_type
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
  }
`;
