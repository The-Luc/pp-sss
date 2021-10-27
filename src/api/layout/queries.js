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
  query($themeId: ID!) {
    theme(id: $themeId) {
      templates {
        ...categories
      }
    }
  }
  ${templateFragment}
`;

export const getLayoutsPreviewQuery = gql`
  query($themeId: ID!) {
    theme(id: $themeId) {
      templates {
        preview_image_url
      }
    }
  }
`;

export const getLayoutsQuery = gql`
  query($themeId: ID!) {
    theme(id: $themeId) {
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
  query($id: ID!) {
    template(id: $id) {
      id
      data
      preview_image_url
      layout
    }
  }
`;
