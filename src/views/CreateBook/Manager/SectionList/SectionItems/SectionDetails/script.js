import { mapState, mapMutations } from 'vuex';
import draggable from 'vuedraggable';

import Sheet from './Sheet';

let selectedIndex = -1;
let moveToIndex = -1;
let selectedSectionIndex = -1;
let moveToSectionIndex = -1;

export default {
  components: {
    draggable,
    Sheet
  },
  props: {
    sectionId: String,
    startSeq: Number
  },
  data() {
    return {
      drag: false
    };
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
    onChoose: function(evt) {
      moveToIndex = -1;
      moveToSectionIndex = -1;

      selectedIndex = this.sheets[evt.oldIndex].draggable ? evt.oldIndex : -1;

      selectedSectionIndex = this.book.sections.findIndex(
        s => s.id === this.sectionId
      );
    },
    onMove: function(evt) {
      this.hideAllIndicator();

      if (selectedIndex < 0) {
        return false;
      }

      if (evt.related === null) {
        return false;
      }

      const relateSheet =
        typeof evt.relatedContext.element === 'undefined'
          ? null
          : evt.relatedContext.element;
      const relateSectionId = evt.relatedContext.component.$el.getAttribute(
        'data-section'
      );

      if (relateSheet === null) {
        this.getMoveToIndex(evt, relateSectionId);

        this.$root.$emit('showIndicator', 'sheet-left-' + -relateSectionId);

        return false;
      }

      const isPosibleToMove =
        relateSheet === null || relateSheet.positionFixed !== 'all';

      if (!isPosibleToMove) {
        moveToIndex = -1;

        return false;
      }

      this.getMoveToIndex(evt, relateSectionId);

      if (this.isSameElement()) {
        return false;
      }

      const isInsertAfter = this.isInsertAfter(evt.willInsertAfter);

      if (!isInsertAfter && relateSheet.positionFixed !== 'first') {
        this.$root.$emit('showIndicator', 'sheet-left-' + relateSheet.id);
      } else if (isInsertAfter && relateSheet.positionFixed !== 'last') {
        this.$root.$emit('showIndicator', 'sheet-right-' + relateSheet.id);
      }

      return false;
    },
    onEnd: function() {
      this.hideAllIndicator();

      if (selectedIndex < 0 || moveToIndex < 0 || this.isSameElement()) {
        this.drag = false;

        return;
      }

      const selectedSheet = this.sheets[selectedIndex];

      if (moveToSectionIndex !== selectedSectionIndex) {
        this.sheets.splice(selectedIndex, 1);

        this.book.sections[moveToSectionIndex].sheets.splice(
          moveToIndex,
          0,
          selectedSheet
        );

        this.endDragDropProcess();
      }

      const _items = Object.assign([], this.sheets);

      if (moveToIndex < selectedIndex) {
        _items.splice(selectedIndex, 1);
        _items.splice(moveToIndex, 0, selectedSheet);
      } else if (moveToIndex > selectedIndex) {
        _items.splice(moveToIndex + 1, 0, selectedSheet);
        _items.splice(selectedIndex, 1);
      }

      this.sheets = _items;

      this.endDragDropProcess();
    },
    getMoveToIndex: function(evt, relateSectionId) {
      moveToIndex = evt.draggedContext.futureIndex;

      moveToSectionIndex = this.book.sections.findIndex(
        s => s.id === relateSectionId
      );
    },
    isSameElement: function() {
      return (
        moveToSectionIndex === selectedSectionIndex &&
        moveToIndex === selectedIndex
      );
    },
    isInsertAfter: function(willInsertAfter) {
      if (moveToSectionIndex === selectedSectionIndex) {
        return moveToIndex > selectedIndex;
      }

      return willInsertAfter;
    },
    endDragDropProcess: function() {
      selectedIndex = -1;
      moveToIndex = -1;

      selectedSectionIndex = -1;
      moveToSectionIndex = -1;

      this.drag = false;
    },
    hideAllIndicator: function() {
      this.$root.$emit('hideIndicator');
    }
  }
};
