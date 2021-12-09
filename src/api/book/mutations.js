import { gql } from 'graphql-tag';

export const updateBookMutation = gql`
  mutation($bookId: ID!, $params: BookInput) {
    update_book(book_id: $bookId, book_params: $params) {
      id
    }
  }
`;

export const setPhotoIsVisitedMutation = gql`
  mutation($id: ID!, $params: BooksUserInput) {
    update_books_user(books_user_id: $id, books_user_params: $params) {
      id
    }
  }
`;
