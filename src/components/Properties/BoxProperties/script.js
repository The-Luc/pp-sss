import Header from './Header';

export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    width: {
      type: Number,
      default: 320
    }
  },
  components: {
    Header
  }
};
