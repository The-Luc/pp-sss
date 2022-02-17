import gql from 'graphql-tag';

export const getPresetColorPickerQuery = gql`
  query user_color {
    user_favourite_colors
  }
`;

export const generateBookPdfQuery = gql`
  query generatePdfQuery($bookId: ID!) {
    generate_book_pdf(id: $bookId)
  }
`;
