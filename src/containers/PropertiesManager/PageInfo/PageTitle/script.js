export default {
  props: {
    titleName: {
      type: String,
      default: 'Project title:'
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
      default: false
    },
    isLink: {
      type: Boolean,
      default: false
    }
  }
};
