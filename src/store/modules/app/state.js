import { ACTIVE_EDITION } from '@/common/constants';

export const state = {
  activeEdition: ACTIVE_EDITION.NONE,
  modal: {
    isOpen: false,
    data: {
      type: '',
      props: {}
    }
  },
  sectionSelected: '',
  // Object properties
  colorPicker: {
    isOpen: false,
    presets: {
      next: 0,
      max: 9,
      values: []
    }
  },
  propertiesModal: {
    isOpen: false,
    selectedObjectType: '',
    propertiesObjectType: '',
    selectedObjectId: ''
  },

  infoBar: {
    x: 0,
    y: 0,
    w: 0,
    h: 0,
    zoom: 0 // 0 = scale to fit, 0.1 = 10%, 0.33 = 33%
  },

  // Tool icon popover
  selectedToolName: '',
  isPrompt: false,
  hasActiveObjects: false,
  currentObject: null,
  triggerChange: {
    text: true,
    background: true,
    shape: true,
    clipArt: true
  },
  user: { id: null, role: null }
};
