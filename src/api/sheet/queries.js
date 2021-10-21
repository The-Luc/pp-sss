import { gql } from 'graphql-tag';

export const pageInfoQuery = gql`
  query($id: ID!) {
    page(id: $id) {
      layout
    }
  }
`;

export const sheetInfoQuery = gql`
  query($id: ID!) {
    sheet(id: $id) {
      pages {
        is_cover_page
        page_number
        layout
      }
    }
  }
`;
