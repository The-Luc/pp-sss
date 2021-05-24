import Block from './Block';

export default {
  components: {
    Block
  },
  props: {
    items: {
      type: Array, // each: color (string), text (string) , dataAttributes (array)
      required: true
    },
    customClass: {
      type: String
    }
  }
};
