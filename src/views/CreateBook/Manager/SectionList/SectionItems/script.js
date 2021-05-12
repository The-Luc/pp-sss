import { mapState } from 'vuex';
import draggable from 'vuedraggable';

import Header from './SectionHeader';
import Details from './SectionDetails';

export default {
  components: {
    Header,
    Details,
    draggable
  },
  computed: {
    ...mapState('book', ['book'])
  },
  methods: {
    onMove({ relatedContext, draggedContext }) {
      const relatedElement = relatedContext.element;
      const draggedElement = draggedContext.element;

      return (
        (!relatedElement || !relatedElement.fixed) && !draggedElement.fixed
      );
    },
    getTotalSheetUntilLastSection: function({ index }) {
      if (index === 0) {
        return 0;
      }

      const totalSheetEachSection = this.book.sections
        .filter((s, ind) => ind < index)
        .map(s => s.sheets.length);
      const total = totalSheetEachSection.reduce((a, v) => {
        return a + v;
      });

      return total;
    },
    getStartSeq: function({ index }) {
      return this.getTotalSheetUntilLastSection({ index }) + 1;
    }
  }
};
