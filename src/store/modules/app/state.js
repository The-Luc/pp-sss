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
      color: '',
      customClass: '',
      presets: {
        next: 0,
        max: 9,
        values: []
      }
    }
  },
  isOpenProperties: false,
  selectedObjectType: '',

  // Tool icon popover
  selectedToolName: '',
  isPrompt: false
};
