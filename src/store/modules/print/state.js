import { getNewPrintBackground } from '@/common/models';

export const state = {
  book: {
    id: null,
    sectionId: '',
    sheetId: '',
    defaultThemeId: ''
  },
  sections: {},
  sheets: {},
  currentSheet: {},
  objectIds: [],
  objects: {},
  background: getNewPrintBackground()
};
