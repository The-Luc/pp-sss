import { getNewPrintBackground } from '@/common/models';

export const state = {
  book: {
    id: null,
    defaultThemeId: ''
  },
  sections: [],
  sheets: {},
  currentSheetId: '',
  objectIds: [],
  objects: {},
  currentObjectId: '',
  background: getNewPrintBackground(),
  triggerChange: {
    text: true,
    background: true,
    shape: true,
    clipArt: true
  }
};
