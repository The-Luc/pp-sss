import ItemSelect from '../ItemSelect';

export default {
  components: {
    ItemSelect
  },
  props: {
    item: {
      type: Object,
      required: true
    },
    indexItem: {
      type: Number,
      required: true
    },
    isSingleScreen: {
      type: Boolean,
      default: true
    },
    lengthDataSelect: {
      type: Number,
      default: 0
    }
  },
  methods: {
    /**
     * To emit data to parent components to handle config changed
     * @param {Object} val value of selected screen
     */
    onFrameSettingChange(val) {
      this.$emit('frameSettingChange', val);
    },
    /**
     * To emit data to parent components to handle config changed
     * @param {Object} val value of selected frame
     */
    onScreenSettingChange(val) {
      this.$emit('screenSettingChange', val);
    }
  }
};
