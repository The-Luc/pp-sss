import { gql } from 'graphql-tag';

export const getFontsQuery = gql`
  query getFonts {
    fonts {
      id
      name
    }
  }
`;
