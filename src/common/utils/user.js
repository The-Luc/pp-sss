import { ROLE } from '../constants';

/**
 * To check whether the user is admin or not
 *
 * @param {Object} user
 * @returns Boolean whether the user is admin or not
 */
export const isAdmin = user => {
  return user?.role === ROLE.ADMIN;
};
