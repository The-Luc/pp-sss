import Draggable from 'vuedraggable';
import { mapMutations } from 'vuex';

import { MUTATES } from '@/store/modules/book/const';

import Sheet from './Sheet';

let selectedIndex = -1;
let moveToIndex = -1;
let moveToSectionId = null;

export default {
  components: {
    Draggable,
    Sheet
  },
  props: {
    sectionId: {
      type: [Number, String],
      require: true
    },
    startSequence: {
      type: Number,
      require: true
    },
    sheets: {
      type: Array,
      require: true
    }
  },
  setup() {
    return {
      ...mapMutations({
        updateSheetPosition: MUTATES.UPDATE_SHEET_POSITION
      })
    };
  },
  data() {
    return {
      drag: false
    };
  },
  methods: {
    onChoose: function(evt) {
      moveToIndex = -1;
      moveToSectionId = null;

      selectedIndex = this.sheets[evt.oldIndex].draggable ? evt.oldIndex : -1;
    },
    onMove: function(evt) {
      this.hideAllIndicator();

      if (selectedIndex < 0) {
        return false;
      }

      if (evt.related === null) {
        this.cancelMove();

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
        this.cancelMove();

        return false;
      }

      this.getMoveToIndex(evt, relateSectionId);

      if (this.isSameElement()) {
        this.cancelMove();

        return false;
      }

      const isInsertAfter = this.isInsertAfter(evt.willInsertAfter);

      const isAllowInsertBefore =
        !isInsertAfter && relateSheet.positionFixed !== 'first';
      const isAllowInsertAfter =
        isInsertAfter && relateSheet.positionFixed !== 'last';

      if (!isAllowInsertBefore && !isAllowInsertAfter) {
        this.cancelMove();

        return false;
      }

      if (isAllowInsertBefore) {
        this.$root.$emit('showIndicator', 'sheet-left-' + relateSheet.id);

        return false;
      }

      if (isAllowInsertAfter) {
        this.$root.$emit('showIndicator', 'sheet-right-' + relateSheet.id);

        return false;
      }

      return false;
    },
    onEnd: function() {
      this.hideAllIndicator();

      if (selectedIndex < 0 || moveToIndex < 0) {
        this.drag = false;

        return;
      }

      this.updateSheetPosition({
        moveToSectionId: moveToSectionId,
        moveToIndex: moveToIndex,
        selectedSectionId: this.sectionId,
        selectedIndex: selectedIndex
      });

      selectedIndex = -1;
      moveToIndex = -1;

      moveToSectionId = null;

      this.drag = false;
    },
    getMoveToIndex: function(evt, relateSectionId) {
      moveToIndex = evt.draggedContext.futureIndex;

      moveToSectionId = parseInt(relateSectionId, 10);
    },
    isSameElement: function() {
      return (
        moveToSectionId === this.sectionId && moveToIndex === selectedIndex
      );
    },
    isInsertAfter: function(willInsertAfter) {
      if (moveToSectionId === this.sectionId) {
        return moveToIndex > selectedIndex;
      }

      return willInsertAfter;
    },
    hideAllIndicator: function() {
      this.$root.$emit('hideIndicator');
    },
    getVirtualSheet: function() {
      return {
        id: -this.sectionId,
        type: 3,
        draggable: false
      };
    },
    cancelMove: function() {
      moveToIndex = -1;
    }
  }
};
