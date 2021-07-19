import Header from './SectionHeader';
import Details from './SectionDetails';
import DragDropIndicator from '@/components/DragDrops/DragDropIndicator';

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
