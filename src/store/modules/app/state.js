export const state = {
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
    data: {
      tabActive: '',
      eventName: '',
      color: '',
      top: 0,
      left: 0,
      presets: {
        next: 0,
        max: 9,
        values: []
      }
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
  hasActiveObjects: false
};
