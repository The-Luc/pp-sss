import Block from './Block';

export default {
  components: {
    Block
  },
  props: {
    items: {
      type: Array, // item: color (string), text (string)
      required: true
    }
  }
};
