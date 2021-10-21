import { gql } from 'graphql-tag';

export const themeOptionsQuery = gql`
  {
    themes {
      id
      name
    }
  }
`;
