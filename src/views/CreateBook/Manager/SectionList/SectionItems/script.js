import { mapGetters, mapMutations } from 'vuex';
import draggable from 'vuedraggable';

import { GETTERS, MUTATES } from '@/store/modules/book/const';
import { useSections } from './composables';

import Header from './SectionHeader';
import Details from './SectionDetails';

export default {
  components: {
    Header,
    Details,
    draggable
  },
  setup() {
    return {
      ...mapGetters({
        getSections: GETTERS.SECTIONS
      }),
      ...mapMutations({
        updateSections: MUTATES.UPDATE_SECTIONS
      })
    };
  },
  mounted: function() {
    const { sections } = useSections();

    this.updateSections({
      sections: sections
    });
  },
  computed: {
    sections: {
      get() {
        const getSection = this.getSections();

        return getSection();
      },
      set(newSections) {
        this.updateSections({
          sections: newSections
        });
      }
    }
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
      if (index === 0 || this.sections.length == 0) {
        return 0;
      }

      const totalSheetEachSection = this.sections
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
