import Draggable from 'vuedraggable';
import Section from './Section';

import { useSectionItems } from '@/views/CreateBook/Manager/composables';

import { ROLE } from '@/common/constants';

export default {
  components: {
    Section,
    Draggable
  },
  setup() {
    const { currentUser, sections, moveSection } = useSectionItems();

    return { currentUser, sections, moveSection };
  },
  data() {
    return {
      drag: false,
      selectedIndex: -1,
      moveToIndex: -1,
      dragTargetBeforeId: null,
      dragTargetAfterId: null,
      dragSheetTarget: {}
    };
  },
  computed: {
    isEnable() {
      return this.currentUser?.role === ROLE.ADMIN;
    }
  },
  methods: {
    /**
     * Choose section event
     *
     * @param {Object}  event event fire when choose a section
     */
    onChoose(event) {
      this.moveToIndex = -1;

      this.selectedIndex = this.sections[event.oldIndex].draggable
        ? event.oldIndex
        : -1;
    },
    /**
     * Drag section event
     *
     * @param {Object}  event event fire when drag a section
     */
    onMove(event) {
      this.clearDragTarget();

      if (this.selectedIndex < 0) {
        return false;
      }

      if (event.related === null) {
        return false;
      }

      this.moveToIndex = event.draggedContext.futureIndex;

      if (this.moveToIndex === this.selectedIndex) {
        this.moveToIndex = -1;

        return false;
      }

      const relateSection = event.relatedContext.element;

      const isAllowMoveTo = !relateSection || relateSection.draggable;

      if (!isAllowMoveTo) {
        this.moveToIndex = -1;

        return false;
      }

      if (this.moveToIndex < this.selectedIndex) {
        this.dragTargetBeforeId = relateSection?.id;
      } else if (this.moveToIndex > this.selectedIndex) {
        this.dragTargetAfterId = relateSection?.id;
      }

      return false;
    },
    /**
     * Unchoose section event
     */
    onUnchoose() {
      this.clearDragTarget();
    },
    /**
     * End drag (drop) section
     */
    onEnd() {
      this.clearDragTarget();

      if (this.selectedIndex < 0 || this.moveToIndex < 0) {
        return;
      }

      this.moveSection({
        moveToIndex: this.moveToIndex,
        selectedIndex: this.selectedIndex
      });

      this.selectedIndex = -1;
      this.moveToIndex = -1;
    },
    /**
     * Clear drag target
     */
    clearDragTarget() {
      this.dragTargetBeforeId = null;
      this.dragTargetAfterId = null;
    },
    /**
     * Get total sheet from first section to current section
     *
     * @returns {Number}  total sheet
     */
    getTotalSheetUntilLastSection(index) {
      if (index === 0 || this.sections.length == 0) {
        return 0;
      }

      const totalSheetEachSection = this.sections
        .filter((s, ind) => ind < index)
        .map(s => s.sheetIds.length);

      return totalSheetEachSection.reduce((a, v) => {
        return a + v;
      });
    },
    /**
     * Get the first sequence of sheet in section, continue from previous section
     *
     * @returns {Number}  the sequence
     */
    getStartSeq(index) {
      return this.getTotalSheetUntilLastSection(index) + 1;
    },
    /**
     * Get drag target type (before / after or nothing)
     *
     * @param   {Number | String} id  section id
     * @returns {String}              drag target type
     */
    getDragTargetType({ id }) {
      if (this.dragTargetBeforeId === id) return 'before';

      return this.dragTargetAfterId === id ? 'after' : '';
    },
    /**
     * Fire when dragging shet target change
     *
     * @param {String | Number} id        target sheet id
     * @param {String}          position  target location (before or after)
     */
    onDragSheetTargetChange({ id, position }) {
      this.dragSheetTarget = { id, position };
    }
  }
};
