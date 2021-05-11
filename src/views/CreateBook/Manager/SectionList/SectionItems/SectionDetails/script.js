import { mapState, mapMutations } from 'vuex';
import draggable from 'vuedraggable';

import Sheet from './Sheet';

export default {
  components: {
    draggable,
    Sheet
  },
  props: {
    sectionId: String,
    startSeq: Number
  },
  computed: {
    ...mapState('project', ['project']),
    sheets: {
      get() {
        const section = this.project.sections.filter(
          s => s.id === this.sectionId
        );

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
    ...mapMutations('project', ['updateSection']),
    onMove({ relatedContext, draggedContext }) {
      const relatedElement = relatedContext.element;
      const draggedElement = draggedContext.element;

      return (
        (!relatedElement || !relatedElement.fixed) && !draggedElement.fixed
      );
    }
  }
};
