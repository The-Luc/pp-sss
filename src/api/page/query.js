import { gql } from 'graphql-tag';

export const getPageLayoutQuery = gql`
  query getPageAPILayout($pageId: ID!) {
    page(id: $pageId) {
      id
      layout
    }
  }
`;
