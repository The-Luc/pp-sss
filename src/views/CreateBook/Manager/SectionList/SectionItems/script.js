import { mapGetters, mapMutations } from 'vuex';
import draggable from 'vuedraggable';

import { GETTERS, MUTATES } from '@/store/modules/book/const';

import Header from './SectionHeader';
import Details from './SectionDetails';
import DragDropIndicator from '@/components/DragDropIndicator';

let selectedIndex = -1;
let moveToIndex = -1;

export default {
  components: {
    Header,
    Details,
    DragDropIndicator,
    draggable
  },
  setup() {
    return {
      ...mapGetters({
        getSections: GETTERS.SECTIONS
      }),
      ...mapMutations({
        updateSections: MUTATES.UPDATE_SECTIONS,
        updateSectionPosition: MUTATES.UPDATE_SECTION_POSITION
      })
    };
  },
  data() {
    return {
      drag: false
    };
  },
  computed: {
    sections: {
      get() {
        return this.getSections();
      },
      set(newSections) {
        this.updateSections({
          sections: newSections
        });
      }
    }
  },
  methods: {
    onChoose: function(evt) {
      moveToIndex = -1;

      selectedIndex = this.sections[evt.oldIndex].draggable ? evt.oldIndex : -1;
    },
    onMove: function(evt) {
      this.hideAllIndicator();

      if (selectedIndex < 0) {
        return false;
      }

      if (evt.related === null) {
        return false;
      }

      moveToIndex = evt.draggedContext.futureIndex;

      if (moveToIndex === selectedIndex) {
        return false;
      }

      const relateSection = evt.relatedContext.element;

      const isAllowMoveTo = !relateSection || relateSection.draggable;

      if (!isAllowMoveTo) {
        moveToIndex = -1;

        return false;
      }

      if (moveToIndex < selectedIndex) {
        this.$root.$emit('showIndicator', 'section-top-' + relateSection.id);
      } else if (moveToIndex > selectedIndex) {
        this.$root.$emit('showIndicator', 'section-bottom-' + relateSection.id);
      }

      return false;
    },
    onEnd: function() {
      this.hideAllIndicator();

      if (
        selectedIndex < 0 ||
        moveToIndex < 0 ||
        selectedIndex === moveToIndex
      ) {
        return;
      }

      this.updateSectionPosition({
        moveToIndex: moveToIndex,
        selectedIndex: selectedIndex
      });

      selectedIndex = -1;
      moveToIndex = -1;
    },
    hideAllIndicator: function() {
      this.$root.$emit('hideIndicator');
    },
    getTotalSheetUntilLastSection: function(index) {
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
    getStartSeq: function(index) {
      return this.getTotalSheetUntilLastSection(index) + 1;
    },
    getSheetsOfSection: function(sectionId) {
      const section = this.sections.find(s => s.id === sectionId);

      return section.sheets;
    }
  }
};
