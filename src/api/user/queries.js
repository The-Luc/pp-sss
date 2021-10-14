import { gql } from 'graphql-tag';

export const getUserInfo = gql`
query ($id: String) {
	user{id: $id} {
		name
		role
	}
}`;
