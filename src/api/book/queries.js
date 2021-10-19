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
    community_id
    book_sections {
      ...sectionDetail
    }
  }
  ${sectionFragment}
`;

// book_sections / sheets: thumbnail_url
export const digitalMainQuery = gql`
  query($bookId: ID!) {
    book(id: $bookId) {
      book_sections {
        due_date
        status
      }
      ...bookDetail
    }
  }
  ${bookFragment}
`;

// book: theme_id, is_photo_visited
// book / book_sections / sheets: theme_id, layout_Id, is_visited, media, thumbnail_url
export const digitalEditorQuery = gql`
  query($bookId: ID!) {
    book(id: $bookId) {
      ...bookDetail
    }
  }
  ${bookFragment}
`;

// book_sections / sheets: thumbnail_url, link
export const printMainQuery = gql`
  query($bookId: ID!) {
    book(id: $bookId) {
      book_sections {
        due_date
        status
      }
      ...bookDetail
    }
  }
  ${bookFragment}
`;

// book: theme_id, is_photo_visited, page_info
// book / book_sections / sheets: theme_id, layout_Id, is_visited, media, spread_info, thumbnail_url, link
export const printEditorQuery = gql`
  query($bookId: ID!) {
    book(id: $bookId) {
      number_max_pages
      yearbook_spec {
        cover_option
      }
      ...bookDetail
    }
  }
  ${bookFragment}
`;

// book: theme_id, is_photo_visited, page_info
// book or book / yearbook_spec: delivery_date, release_date, sale_date
// book / book_sections / sheets: theme_id, layout_Id, is_visited, media, spread_info, thumbnail_url, link
export const managerQuery = gql`
  query($bookId: ID!) {
    book(id: $bookId) {
      created_at
      number_max_pages
      yearbook_spec {
        cover_option
        delivery_option
        copies_sold
        fundraising_earned
        estimated_quantity_high
        estimated_quantity_low
        delivery_date
      }
      book_sections {
        draggable
        due_date
        status
        sheets {
          draggable
          fixed_position
        }
      }
      ...bookDetail
    }
  }
  ${bookFragment}
`;
