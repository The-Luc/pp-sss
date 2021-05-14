import { mapState } from 'vuex';
import draggable from 'vuedraggable';

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
  data() {
    return {
      drag: false
    };
  },
  computed: {
    ...mapState('book', ['book'])
  },
  methods: {
    onChoose: function(evt) {
      moveToIndex = -1;

      selectedIndex = this.book.sections[evt.oldIndex].draggable
        ? evt.oldIndex
        : -1;
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

      const selectedSection = this.book.sections[selectedIndex];

      const _items = Object.assign([], this.book.sections);

      if (moveToIndex < selectedIndex) {
        _items.splice(selectedIndex, 1);
        _items.splice(moveToIndex, 0, selectedSection);
      } else if (moveToIndex > selectedIndex) {
        _items.splice(moveToIndex + 1, 0, selectedSection);
        _items.splice(selectedIndex, 1);
      }

      this.book.sections = _items;

      selectedIndex = -1;
      moveToIndex = -1;
    },
    hideAllIndicator: function() {
      this.$root.$emit('hideIndicator');
    },
    getTotalSheetUntilLastSection: function(index) {
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
    getStartSeq: function(index) {
      return this.getTotalSheetUntilLastSection(index) + 1;
    }
  }
};
