import TextFieldProperty from '@/components/TextFieldProperty';
export default {
  components: {
    TextFieldProperty
  },
  props: {
    valueX: {
      type: Number,
      required: true
    },
    valueY: {
      type: Number,
      required: true
    }
  }
};
