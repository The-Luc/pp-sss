import { gql } from 'graphql-tag';

const sheetFragment = gql`
  fragment sheetDetail on Sheet {
    id
    sheet_type
  }
`;

const sectionFragment = gql`
  fragment sectionDetail on BookSection {
    id
    name
    color
    assigned_user {
      id
    }
    sheets {
      ...sheetDetail
    }
  }
  ${sheetFragment}
`;

const bookFragment = gql`
  fragment bookDetail on Book {
    title
    total_pages
    book_sections {
      ...sectionDetail
    }
  }
  ${sectionFragment}
`;

export const digitalMainQuery = gql`
  query digitalMain($bookId: ID!) {
    book(id: $bookId) {
      id
      book_sections {
        id
        due_date
        status
        sheets {
          id
          digital_frames {
            id
            preview_image_url
          }
        }
      }
      ...bookDetail
    }
  }
  ${bookFragment}
`;

// book: theme_id, is_photo_visited
// book / book_sections / sheets: theme_id, layout_Id, is_visited, media
export const digitalEditorQuery = gql`
  query digitalEditor($bookId: ID!) {
    book(id: $bookId) {
      id
      community_id
      book_sections {
        id
        sheets {
          id
          digital_frames {
            id
            preview_image_url
          }
        }
      }
      ...bookDetail
    }
  }
  ${bookFragment}
`;

// book_sections / sheets: link
export const printMainQuery = gql`
  query printMain($bookId: ID!) {
    book(id: $bookId) {
      id
      book_sections {
        id
        due_date
        status
        sheets {
          id
          pages {
            id
            preview_image_url
          }
        }
      }
      ...bookDetail
    }
  }
  ${bookFragment}
`;

// book: theme_id, is_photo_visited, page_info
// book / book_sections / sheets: theme_id, layout_Id, is_visited, media, spread_info, link
export const printEditorQuery = gql`
  query printEditor($bookId: ID!) {
    book(id: $bookId) {
      id
      community_id
      number_max_pages
      yearbook_spec {
        id
        cover_option
      }
      book_sections {
        id
        sheets {
          id
          pages {
            id
            preview_image_url
          }
        }
      }
      ...bookDetail
    }
  }
  ${bookFragment}
`;

export const managerQuery = gql`
  query($bookId: ID!) {
    book(id: $bookId) {
      id
      created_at
      number_max_pages
      yearbook_spec {
        id
        cover_option
        delivery_option
        copies_sold
        fundraising_earned
        estimated_quantity_high
        estimated_quantity_low
        delivery_date
        phase_one_start_date
      }
      book_sections {
        id
        draggable
        due_date
        status
        sheets {
          id
          draggable
          fixed_position
        }
      }
      ...bookDetail
    }
  }
  ${bookFragment}
`;
