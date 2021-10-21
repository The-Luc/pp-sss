import { getNewBackground } from '@/common/models';

export const editionDefaultState = {
  book: {
    id: null,
    communityId: '',
    defaultThemeId: '',
    isPhotoVisited: false
  },
  sections: [],
  sheets: {},
  currentSheetId: '',
  objectIds: [],
  objects: {},
  currentObjectId: '',
  background: getNewBackground(),
  triggerChange: {
    background: true
  }
};
