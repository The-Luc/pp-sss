import { gql } from 'graphql-tag';

export const pageInfoQuery = gql`
  query pageInfo($id: ID!) {
    page(id: $id) {
      id
      layout
      facing_page {
        id
        layout
      }
    }
  }
`;

export const sheetInfoQuery = gql`
  query sheetInfo($id: ID!) {
    sheet(id: $id) {
      id
      sheet_type
      pages {
        id
        is_cover_page
        page_number
        layout
      }
    }
  }
`;

export const printWorkspaceQuery = gql`
  query digitalWorkspace($id: ID!) {
    sheet(id: $id) {
      id
      workspace
    }
  }
`;

export const digitalWorkspaceQuery = gql`
  query digitalWorkspace($id: ID!) {
    sheet(id: $id) {
      id
      digital_workspace
    }
  }
`;
