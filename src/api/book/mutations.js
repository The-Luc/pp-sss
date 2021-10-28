import { gql } from 'graphql-tag';

export const updateBookMutation = gql`
  mutation($bookId: ID!, $params: BookInput) {
    update_book(book_id: $bookId, book_params: $params) {
      id
    }
  }
`;
