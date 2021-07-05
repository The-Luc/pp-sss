export default {
  props: {
    titleNameLeft: {
      type: String,
      default: 'Project title:'
    },
    titleNameRight: {
      type: String,
      default: 'Right hand page title:'
    },
    titleValueLeft: {
      type: String,
      default: ''
    },
    titleValueRight: {
      type: String,
      default: ''
    },
    isDisable: {
      type: Boolean,
      required: true
    },
    isLink: {
      type: Boolean,
      default: false
    }
  }
};
