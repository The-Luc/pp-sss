import { getNewBackground } from '@/common/models';

export const state = {
  book: {
    id: null,
    defaultThemeId: null
  },
  sections: [],
  sheets: {},
  currentSheetId: '',
  currentFrameId: '',
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
    clipArt: true,
    applyLayout: true,
    transition: true
  }
};
