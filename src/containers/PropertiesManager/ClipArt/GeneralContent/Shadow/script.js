import PpSelect from '@/components/Select';
export default {
  components: {
    PpSelect
  },
  data() {
    return {
      selectedVal: {
        value: 'noShadow'
      }
    };
  },
  props: {
    items: {
      type: Array,
      required: true
    }
  }
};
