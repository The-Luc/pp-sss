import { gql } from 'graphql-tag';

export const themeOptionsQuery = gql`
  query themeOptions {
    themes {
      id
      name
    }
  }
`;
