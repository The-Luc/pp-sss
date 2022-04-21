import { getNewBackground } from '@/common/models';

export const editionDefaultState = {
  book: {
    id: null,
    communityId: '',
    bookUserId: null,
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
