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
    objectIdsForShowFirstTab: []
  },

  // Tool icon popover
  selectedToolName: '',
  isPrompt: false,
  hasActiveObjects: false
};
