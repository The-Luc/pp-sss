import Header from './ProcessHeader';

export default {
  components: {
    Header
  },
  props: {
    name: {
      type: String,
      required: true
    },
    headerColor: {
      type: String
    }
  }
};
