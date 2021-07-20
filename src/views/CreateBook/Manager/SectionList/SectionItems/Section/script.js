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
    }
  }
};
