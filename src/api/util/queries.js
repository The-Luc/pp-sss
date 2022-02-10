import gql from 'graphql-tag';

export const getPresetColorPickerQuery = gql`
  query user_color {
    user_favourite_colors
  }
`;
