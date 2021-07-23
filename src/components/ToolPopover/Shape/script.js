import PpToolPopover from '@/components/ToolPopover';
import Item from './Item';

export default {
  components: {
    PpToolPopover,
    Item
  },
  props: {
    noShapeLength: {
      type: Number,
      default: 12
    },
    shapes: {
      type: Array,
      required: true
    },
    selectedShapes: {
      type: Array,
      required: []
    }
  },
  methods: {
    /**
     * Emit change event to parent component
     * @param {Number} shape - the current shapes type to emit via event payload
     */
    onSelectShape(shape) {
      this.$emit('onSelectShape', shape);
    },
    /**
     * Emit change event to parent component
     */
    onClose() {
      this.$emit('onClose');
    },
    /**
     * Emit change event to parent component
     */
    applyChosenShapes() {
      this.$emit('applyChosenShapes');
    }
  }
};
