import { gql } from 'graphql-tag';

const templateFragment = gql`
  fragment categories on Template {
    categories {
      id
      name
    }
  }
`;

export const getLayoutTypeQuery = gql`
  query getLayoutType($themeId: ID!) {
    theme(id: $themeId) {
      id
      templates {
        id
        ...categories
      }
    }
  }
  ${templateFragment}
`;

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
        ...categories
      }
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
      id
      layout_type
      preview_image_url
    }
    single_page: user_saved_print_layouts(layout_type: SINGLE_PAGE) {
      id
      layout_type
      preview_image_url
    }
  }
`;
