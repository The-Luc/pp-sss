import PpSelect from '@/components/Selectors/SelectMultiLevel';

export default {
  components: {
    PpSelect
  },
  props: {
    items: {
      type: Array,
      required: true
    },
    selectedVal: {
      type: Object,
      default: () => ({ name: '', value: '' })
    }
  },
  methods: {
    /**
     * Event fire when choose an item
     *
     * @param {Object}  data  the data of select item
     */
    onChange(data) {
      this.$emit('change', data);
    }
  }
};
