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
     * @param {Object}  val  the data of select item
     */
    onChange(val) {
      this.$emit('change', val);
    }
  }
};
