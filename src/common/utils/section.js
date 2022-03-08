import { ROLE } from '@/common/constants';

/**
 * Get section with accessible data
 *
 * @param   {Object}          section section to get data
 * @param   {String | Number} id      current user's id
 * @param   {Number}          role    current user's role id
 * @returns {Object}                  section with accessible data
 */
export const getSectionWithAccessible = (section, user) => {
  const isAdmin = user.role === ROLE.ADMIN;
  const isAssigned = user.assigneeId === section.assigneeId;

  return {
    ...section,
    isAccessible: isAdmin || isAssigned,
    isAdmin
  };
};

/**
 * Get sections with accessible data
 *
 * @param   {Array}           sections  sections to get data
 * @param   {String | Number} id        current user's id
 * @param   {Number}          role      current user's role id
 * @returns {Array}                     sections with accessible data
 */
export const getSectionsWithAccessible = (sections, user) => {
  return sections.map(s => getSectionWithAccessible(s, user));
};
