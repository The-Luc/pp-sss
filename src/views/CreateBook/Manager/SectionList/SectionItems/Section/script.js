import Header from './SectionHeader';
import Details from './SectionDetails';
import DragDropIndicator from '@/components/DragDropIndicator';

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
      const { id, name, color, dueDate, draggable, status } = this.section;

      return {
        id: id,
        name: name,
        color: color,
        dueDate: dueDate,
        draggable: draggable,
        status: status
      };
    }
  }
};
