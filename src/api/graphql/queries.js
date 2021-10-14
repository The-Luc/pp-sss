import { gql } from 'graphql-tag';

export const queryFM = gql`
  {
    backgrounds {
      id
      name
    }
  }
`;

const staticQuery = gql`
  {
    Page(page: 1, perPage: 2) {
      pageInfo {
        total
        perPage
        currentPage
        lastPage
        hasNextPage
      }
      users {
        name
      }
    }
  }
`;

const dynamicQuery = gql`
  query Page($page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      pageInfo {
        total
        perPage
        currentPage
        lastPage
        hasNextPage
      }
      users {
        name
      }
    }
  }
`;

// ============ FRAGMENT QUERY =================
const pageInfoFragment = gql`
  fragment totalPage on PageInfo {
    total
  }
`;

const pageInfo = gql`
  {
    Page(page: 1, perPage: 2) {
      pageInfo {
        ...totalPage
        perPage
        currentPage
      }
      users {
        name
      }
    }
  }
  ${pageInfoFragment}
`;

export const analistQuery = {
  sQuery: staticQuery,
  dQuery: dynamicQuery,
  fQuery: pageInfo
};
