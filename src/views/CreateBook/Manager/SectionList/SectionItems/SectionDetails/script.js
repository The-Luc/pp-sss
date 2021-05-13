import { mapGetters, mapMutations } from 'vuex';
import draggable from 'vuedraggable';

import { GETTERS, MUTATES } from '@/store/modules/book/const';
import { useSheets } from './composables';

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
  setup() {
    return {
      ...mapGetters({
        getSectionIndex: GETTERS.SECTION_INDEX,
        getSheets: GETTERS.SHEETS,
        getListOfSheetBySectionIndex: GETTERS.SHEETS_BY_SECTION_INDEX
      }),
      ...mapMutations({
        updateSheets: MUTATES.UPDATE_SHEETS
      })
    };
  },
  mounted: function() {
    const { sheets } = useSheets(this.sectionId);

    this.updateSheets({
      sectionId: this.sectionId,
      sheets: sheets
    });
  },
  data() {
    return {
      drag: false
    };
  },
  computed: {
    sheets: {
      get() {
        const getSheets = this.getSheets();

        return getSheets(this.sectionId);
      },
      set(newSheets) {
        this.updateSheets({
          sectionId: this.sectionId,
          sheets: newSheets
        });
      }
    }
  },
  methods: {
    getIndexOfSectionById: function(sectionId) {
      const getSectionIndex = this.getSectionIndex();

      return getSectionIndex(sectionId);
    },
    getSheetsBySectionIndex: function(sectionId) {
      const getListOfSheetBySectionIndex = this.getListOfSheetBySectionIndex();

      return getListOfSheetBySectionIndex(sectionId);
    },
    onChoose: function(evt) {
      moveToIndex = -1;
      moveToSectionIndex = -1;

      selectedIndex = this.sheets[evt.oldIndex].draggable ? evt.oldIndex : -1;

      selectedSectionIndex = this.getIndexOfSectionById(this.sectionId);
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

        this.getSheetsBySectionIndex(moveToSectionIndex).splice(
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

      moveToSectionIndex = this.getIndexOfSectionById(relateSectionId);
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
