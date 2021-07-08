import { getNewBackground } from '@/common/models';

export const state = {
  book: {
    id: null,
    defaultThemeId: null
  },
  sections: [],
  sheets: {},
  currentSheetId: '',
  currentFrameId: 0,
  objectIds: [],
  objects: {},
  frameIds: [],
  frames: {},
  currentObjectId: '',
  background: getNewBackground(),
  triggerChange: {
    text: true,
    background: true,
    shape: true,
    clipArt: true
  }
};
