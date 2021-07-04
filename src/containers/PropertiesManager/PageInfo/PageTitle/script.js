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
    titleValue: {
      type: String,
      required: true
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
