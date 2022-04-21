import { gql } from 'graphql-tag';

export const updatePageMutation = gql`
  mutation updatePage($pageId: ID!, $params: PageInput!) {
    update_page(page_id: $pageId, page_params: $params) {
      id
      is_visited
      layout
      page_number
      preview_image_url
      show_page_number
      title
    }
  }
`;
