import gql from 'graphql-tag';
import { digitalSheetFragment } from '../frame/queries';

export const getPlaybackDataQuery = gql`
  query bookTransition($bookId: ID!) {
    book(id: $bookId) {
      id
      book_sections {
        id
        section_order
        sheets {
          ...SheetInfo
        }
      }
    }
  }
  ${digitalSheetFragment}
`;
