import Draggable from 'vuedraggable';
import Sheet from './Sheet';

import { POSITION_FIXED } from '@/common/constants';
import { useActionSection } from '../composables';

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
    },
    dragTarget: {
      type: Object,
      default: () => ({})
    }
  },
  setup() {
    const { moveSheet } = useActionSection();

    return { moveSheet };
  },
  data() {
    return {
      drag: false,
      selectedSheetId: null,
      selectedIndex: -1,
      moveToIndex: -1,
      moveToSectionId: null
    };
  },
  methods: {
    /**
     * Choose sheet event
     *
     * @param {Object}  event event fire when choose a sheet
     */
    onChoose(event) {
      this.moveToIndex = -1;
      this.moveToSectionId = null;

      const { draggable, id } = this.sheets[event.oldIndex];

      this.selectedSheetId = draggable ? id : null;

      this.selectedIndex = draggable ? event.oldIndex : -1;
    },
    /**
     * Drag sheet event
     *
     * @param {Object}  event event fire when drag a sheet
     */
    onMove(event) {
      this.clearDragTarget();

      if (this.selectedIndex < 0) {
        return false;
      }

      if (event.related === null) {
        this.cancelMove();

        return false;
      }

      const relateSheet =
        typeof event.relatedContext.element === 'undefined'
          ? null
          : event.relatedContext.element;

      const relateSectionId = event.relatedContext.component.$el.getAttribute(
        'data-section'
      );

      if (relateSheet === null) {
        this.getMoveToIndex(event, relateSectionId);

        this.$emit('dragSheetTargetChange', {
          position: 'before',
          id: -relateSectionId
        });

        return false;
      }

      const isPosibleToMove =
        relateSheet === null ||
        relateSheet.positionFixed !== POSITION_FIXED.ALL;

      if (!isPosibleToMove) {
        this.cancelMove();

        return false;
      }

      this.getMoveToIndex(event, relateSectionId);

      if (this.isSameElement()) {
        this.cancelMove();

        return false;
      }

      const isInsertAfter = this.isInsertAfter(event.willInsertAfter);

      const isAllowInsertBefore =
        !isInsertAfter && relateSheet.positionFixed !== POSITION_FIXED.FIRST;
      const isAllowInsertAfter =
        isInsertAfter && relateSheet.positionFixed !== POSITION_FIXED.LAST;

      if (!isAllowInsertBefore && !isAllowInsertAfter) {
        this.cancelMove();

        return false;
      }

      if (isAllowInsertBefore || isAllowInsertAfter) {
        this.$emit('dragSheetTargetChange', {
          position: isAllowInsertBefore ? 'before' : 'after',
          id: relateSheet?.id
        });
      }

      return false;
    },
    /**
     * Unchoose sheet event
     */
    onUnchoose() {
      this.clearDragTarget();
    },
    /**
     * End drag (drop) sheet
     */
    onEnd() {
      this.clearDragTarget();

      this.drag = false;

      if (this.selectedIndex < 0 || this.moveToIndex < 0) return;

      this.moveSheet(
        `${this.selectedSheetId}`,
        `${this.moveToSectionId}`,
        `${this.sectionId}`,
        this.moveToIndex,
        this.selectedIndex
      );

      this.selectedIndex = -1;
      this.moveToIndex = -1;

      this.moveToSectionId = null;
      this.selectedSheetId = null;
    },
    getMoveToIndex(event, relateSectionId) {
      this.moveToIndex = event.draggedContext.futureIndex;

      this.moveToSectionId = parseInt(relateSectionId, 10);
    },
    isSameElement() {
      return (
        this.moveToSectionId === this.sectionId &&
        this.moveToIndex === this.selectedIndex
      );
    },
    isInsertAfter(willInsertAfter) {
      if (this.moveToSectionId === this.sectionId) {
        return this.moveToIndex > this.selectedIndex;
      }

      return willInsertAfter;
    },
    /**
     * Clear drag target
     */
    clearDragTarget() {
      this.$emit('dragSheetTargetChange', {});
    },
    getVirtualSheet() {
      return {
        id: -this.sectionId,
        type: 3,
        draggable: false
      };
    },
    cancelMove() {
      this.moveToIndex = -1;
    },
    /**
     * Get drag target type (before / after or nothing)
     *
     * @param   {Number | String} id  sheet id
     * @returns {String}              drag target type
     */
    getDragTargetType({ id }) {
      if (id !== this.dragTarget?.id) return '';

      return this.dragTarget?.position;
    }
  }
};
