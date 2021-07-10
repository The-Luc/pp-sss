import InputTitle from './inputTitle';
export default {
  components: {
    InputTitle
  },
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
    disabled: {
      type: Boolean,
      default: false
    },
    isLink: {
      type: Boolean,
      default: false
    }
  }
};
