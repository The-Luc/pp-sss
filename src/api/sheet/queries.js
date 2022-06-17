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
      sheet_type
      pages {
        id
        is_cover_page
        show_page_number
        page_number
        layout
      }
      book {
        id
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

export const getSheetPreviewInfoQuery = gql`
  query getSheetPreviewInfo($id: ID!) {
    sheet(id: $id) {
      id
      digital_frames {
        id
        preview_image_url
        frame_order
      }
    }
  }
`;
