import { gql } from 'graphql-tag';

export const loginUserMutation = gql`
  mutation($email: String!, $password: String!) {
    login_user(email: $email, password: $password) {
      token
      communities_users {
        id
        admin
      }
    }
  }
`;

export const saveFavoritesMutation = gql`
  mutation saveFavoriteLayout($id: ID!) {
    create_template_user(template_id: $id) {
      id
      template {
        id
        categories {
          id
        }
        title
        preview_image_url
        data
        layout_type
      }
    }
  }
`;

export const deleteFavoritesMutation = gql`
  mutation DeleteTemplateUser($id: ID!) {
    delete_template_user(template_id: $id) {
      id
      template {
        id
        categories {
          id
        }
        title
        preview_image_url
        data
        layout_type
      }
    }
  }
`;
