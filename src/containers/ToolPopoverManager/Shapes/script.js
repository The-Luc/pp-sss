import ShapeToolPopover from '@/components/ToolPopover/Shape';

import { usePopoverCreationTool } from '@/hooks';

import { cloneDeep } from 'lodash';
import { isEmpty } from '@/common/utils';

import { SHAPES } from '@/common/constants/shapes';
import { EVENT_TYPE } from '@/common/constants';

export default {
  components: {
    ShapeToolPopover
  },
  data() {
    return {
      chosenShapes: [],
      noShapeLength: 12
    };
  },
  setup() {
    const { setToolNameSelected } = usePopoverCreationTool();
    return {
      setToolNameSelected
    };
  },
  computed: {
    selectedShapes() {
      return this.chosenShapes;
    },
    shapes() {
      return SHAPES;
    }
  },
  mounted() {
    this.initData();
  },
  methods: {
    /**
     * Set up inital data to render in view
     */
    initData() {
      this.chosenShapes = [];
    },
    onSelectShape(shape) {
      const index = this.chosenShapes.findIndex(s => s.id === shape.id);

      if (index >= 0) {
        this.chosenShapes.splice(index, 1);
      } else {
        this.chosenShapes.push(shape);
      }
    },
    /**
     * Trigger hooks to set tool name is empty and then close popover when click Cancel button
     */
    onClose() {
      this.setToolNameSelected('');
    },
    /**
     * Trigger mutation to add shapes
     */
    applyChosenShapes() {
      if (isEmpty(this.chosenShapes)) return;

      this.$root.$emit(EVENT_TYPE.ADD_SHAPES, cloneDeep(this.chosenShapes));

      this.onClose();
    }
  }
};
