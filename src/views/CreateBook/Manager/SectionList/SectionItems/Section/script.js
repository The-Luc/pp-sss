import Header from './SectionHeader';
import Details from './SectionDetails';
import DragDropIndicator from '@/components/DragDrops/DragDropIndicator';

import { isEmpty } from '@/common/utils';

export default {
  components: {
    Header,
    Details,
    DragDropIndicator
  },
  props: {
    startSequence: {
      type: Number,
      require: true
    },
    section: {
      type: Object,
      require: true
    },
    isEnable: {
      type: Boolean,
      default: false
    },
    dragTargetType: {
      type: String
    },
    dragSheetTarget: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    dragTargetCssClass() {
      return isEmpty(this.dragTargetType)
        ? ''
        : `drag-target-${this.dragTargetType}`;
    }
  },
  methods: {
    getSection: function() {
      const {
        id,
        name,
        color,
        dueDate,
        draggable,
        status,
        assigneeId
      } = this.section;

      return { id, name, color, dueDate, draggable, status, assigneeId };
    },
    /**
     * Fire when dragging shet target change
     *
     * @param {String | Number} id        target sheet id
     * @param {String}          position  target location (before or after)
     */
    onDragSheetTargetChange({ id, position }) {
      this.$emit('dragSheetTargetChange', { id, position });
    }
  }
};
