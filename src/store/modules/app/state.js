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
  textStyles: [],
  userTextStyles: [],
  userImageStyles: [],
  fonts: [],
  savingStatus: '',
  isMediaSidebarOpen: false,
  disabledToolbarItems: getDefaultDisabledItems(),
  loadingScreen: {
    isLoading: false,
    isFreeze: false
  },
  showNotification: {
    isShow: false,
    type: '',
    title: '',
    text: ''
  },
  uploadToken: {
    token: null,
    expiredAt: null,
    url: ''
  }
};
