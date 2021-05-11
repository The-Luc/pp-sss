import { mapState } from 'vuex';
import draggable from 'vuedraggable';

import Header from './SectionHeader';
import Details from './SectionDetails';
import Indicator from './SectionIndicator';

let selectedIndex = -1;
let moveToIndex = -1;

export default {
  components: {
    Header,
    Details,
    Indicator,
    draggable
  },
  data() {
    return {
      drag: false
    };
  },
  computed: {
    ...mapState('project', ['project'])
  },
  methods: {
    onChoose: function(evt) {
      moveToIndex = -1;

      selectedIndex = this.project.sections[evt.oldIndex].fixed
        ? -1
        : evt.oldIndex;
    },
    onMove: function(evt) {
      this.clearAllIndicator();

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

      const isAllowMoveTo = !relateSection || !relateSection.fixed;

      if (!isAllowMoveTo) {
        moveToIndex = -1;

        return false;
      }

      if (moveToIndex < selectedIndex) {
        evt.related.classList.add('move-to-top');
      } else if (moveToIndex > selectedIndex) {
        evt.related.classList.add('move-to-bottom');
      }

      return false;
    },
    onEnd: function() {
      this.clearAllIndicator();

      if (
        selectedIndex < 0 ||
        moveToIndex < 0 ||
        selectedIndex === moveToIndex
      ) {
        return;
      }

      const selectedSection = this.project.sections[selectedIndex];

      const _items = Object.assign([], this.project.sections);

      if (moveToIndex < selectedIndex) {
        _items.splice(selectedIndex, 1);
        _items.splice(moveToIndex, 0, selectedSection);
      } else if (moveToIndex > selectedIndex) {
        _items.splice(moveToIndex + 1, 0, selectedSection);
        _items.splice(selectedIndex, 1);
      }

      this.project.sections = _items;

      selectedIndex = -1;
      moveToIndex = -1;
    },
    clearAllIndicator: function() {
      const moveToElements = document.querySelectorAll(
        '.move-to-top, .move-to-bottom'
      );

      moveToElements.forEach(e => {
        e.classList.remove('move-to-top');
        e.classList.remove('move-to-bottom');
      });
    },
    getTotalSheetUntilLastSection: function(index) {
      if (index === 0) {
        return 0;
      }

      const totalSheetEachSection = this.project.sections
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
