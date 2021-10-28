import { gql } from 'graphql-tag';

export const pageInfoQuery = gql`
  query pageInfo($id: ID!) {
    page(id: $id) {
      id
      layout
    }
  }
`;

export const sheetInfoQuery = gql`
  query sheetInfo($id: ID!) {
    sheet(id: $id) {
      id
      pages {
        id
        is_cover_page
        page_number
        layout
      }
    }
  }
`;
