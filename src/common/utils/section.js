import { ROLE } from '@/common/constants';

/**
 * Get section with accessible data
 *
 * @param   {Object}          section section to get data
 * @param   {String | Number} id      current user's id
 * @param   {Number}          role    current user's role id
 * @returns {Object}                  section with accessible data
 */
export const getSectionWithAccessible = (section, { id, role }) => {
  const isAdmin = role === ROLE.ADMIN;
  const isAssigned = id === section.assigneeId;

  return {
    ...section,
    isAccessible: isAdmin || isAssigned
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
export const getSectionsWithAccessible = (sections, { id, role }) => {
  return sections.map(s => getSectionWithAccessible(s, { id, role }));
};
