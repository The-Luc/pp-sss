import Header from './Header';

export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    width: {
      type: Number,
      default: 370
    }
  },
  components: {
    Header
  }
};
