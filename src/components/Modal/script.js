import Header from './Header';

export default {
  components: {
    Header
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    showIconClose: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: '500'
    }
  },
  data() {
    return {
      dialog: false
    };
  }
};
