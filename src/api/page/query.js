import { gql } from 'graphql-tag';

export const getPageAPILayoutQuery = gql`
  query getPageAPILayout($pageId: ID!) {
    page(id: $pageId) {
      id
      layout
    }
  }
`;
