import { gql } from 'graphql-tag';

export const getPageLayoutQuery = gql`
  query getPageAPILayout($pageId: ID!) {
    page(id: $pageId) {
      id
      layout
    }
  }
`;

export const getSheetIdOfPageQuery = gql`
  query getSheetIdOfPage($pageId: ID!) {
    page(id: $pageId) {
      id
      sheets {
        id
        pages {
          id
        }
        sheet_type
      }
    }
  }
`;
