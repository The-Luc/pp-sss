import { cloneDeep } from 'lodash';
import { isEmpty } from '../utils';

export const sectionsWithSheets = ({ sections, sheets }) => {
  return sections.map(s => {
    const section = cloneDeep(s);

    delete section.sheetIds;

    return { ...section, sheets: s.sheetIds.map(id => sheets[id]) };
  });
};

export const setSectionsWithSheets = (state, { sections, sheets }) => {
  state.sections = sections;
  state.sheets = sheets;
};

export const updateSection = (state, { id, status, dueDate, assigneeId }) => {
  const section = Array.isArray(state.sections)
    ? state.sections.find(s => s.id === id)
    : state.sections[id];

  if (!isEmpty(status)) section.status = status;

  if (!isEmpty(dueDate)) section.dueDate = dueDate;

  if (!isEmpty(assigneeId)) section.assigneeId = assigneeId;
};
