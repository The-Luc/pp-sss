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
  mutation($id: ID!) {
    create_template_user(template_id: $id) {
      id
      template {
        id
        theme {
          id
        }
        categories {
          id
        }
        preview_image_url
        data
      }
    }
  }
`;
