import { cloneDeep } from 'lodash';

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
