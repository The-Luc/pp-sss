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
