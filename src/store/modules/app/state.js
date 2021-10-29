import { getDefaultDisabledItems } from '@/common/utils';

import { EDITION } from '@/common/constants';

export const state = {
  activeEdition: EDITION.NONE,
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
    selectedObjectType: '',
    propertiesObjectType: '',
    selectedObjectId: ''
  },

  infoBar: {
    x: 0,
    y: 0,
    zoom: 0 // 0 = scale to fit, 0.1 = 10%, 0.33 = 33%
  },

  // Tool icon popover
  selectedToolName: '',
  isPrompt: false,
  hasActiveObjects: false,
  currentObject: null,
  generalInfo: {
    bookId: '',
    title: '',
    totalSheets: 0,
    totalPages: 0,
    totalScreens: 0
  },
  user: { id: null, role: null },
  savedTextStyles: [],
  savedImageStyles: [],
  savingStatus: '',
  isMediaSidebarOpen: false,
  disabledToolbarItems: getDefaultDisabledItems(),
  isLoading: false
};
