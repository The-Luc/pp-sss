import { mapState, mapMutations } from 'vuex';
import draggable from 'vuedraggable';

export default {
  components: {
    draggable
  },
  props: {
    sectionId: String,
    startSeq: Number
  },
  computed: {
    ...mapState('book', ['book']),
    sheets: {
      get() {
        const section = this.book.sections.filter(s => s.id === this.sectionId);

        return section == null || section.length == 0 ? [] : section[0].sheets;
      },
      set(newSheets) {
        this.updateSection({
          sectionId: this.sectionId,
          sheets: newSheets
        });
      }
    }
  },
  methods: {
    ...mapMutations('book', ['updateSection']),
    onMove({ relatedContext, draggedContext }) {
      const relatedElement = relatedContext.element;
      const draggedElement = draggedContext.element;

      return (
        (!relatedElement || !relatedElement.fixed) && !draggedElement.fixed
      );
    }
  }
};
