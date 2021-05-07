import { mapState } from 'vuex';
import draggable from 'vuedraggable';

import Header from './SectionHeader';
import Details from './SectionDetails';

var dragGhost = {};

let oldDraggableIndex = -1;

export default {
  components: {
    Header,
    Details,
    draggable
  },
  data() {
    return {
      drag: false
    };
  },
  computed: {
    ...mapState('project', ['project']),
    dragOptions() {
      return {
        animation: 200,
        group: 'description',
        disabled: false,
        ghostClass: 'ghost'
      };
    }
  },
  methods: {
    setData: function (/*dataTransfer, dragEl*/) {
      // Create the clone (with content)
      // dragGhost = dragEl.cloneNode(true);
      // Stylize it
      // dragGhost.classList.add('custom-drag-ghost');

      //dragGhost.style.width = dragEl.offsetWidth + 'px';
      //dragGhost.style.height = dragEl.offsetHeight + 'px';
      // Place it into the DOM tree
      // document.getElementById('manager-section-list').appendChild(dragGhost);
      // Set the new stylized "drag image" of the dragged element
      // dataTransfer.setDragImage(dragGhost, 0, 0);
      // dragGhost.classList.add('hide');
    },
    onMove(evt) {
      const relatedElement = evt.relatedContext.element;
      const draggedElement = evt.draggedContext.element;

      const isAllow = (!relatedElement || !relatedElement.fixed) && !draggedElement.fixed;

      return isAllow;
    },
    onChoose: function(evt) {
      console.log('choose')
      oldDraggableIndex = evt.oldDraggableIndex;

      dragGhost = evt.item.cloneNode(true);

      dragGhost.classList.add('clone-ghost');

      // evt.item.parentNode.insertBefore(dragGhost, evt.item);
    },
    onChange: function(evt) {
      console.log('change')
      console.log('-------------------------------')
      //console.log(evt)
      //console.log(evt.target)

      if (evt.newDraggableIndex === oldDraggableIndex) {
        if (dragGhost.parentNode !== null) {
          dragGhost.parentNode.removeChild(dragGhost);
        }

        evt.item.classList.remove('indicator');
      }
      else {
        const plusPosition = evt.newDraggableIndex > oldDraggableIndex ? 0 : 1;
        const ghostPosition = oldDraggableIndex + plusPosition;

        evt.item.classList.add('indicator');
        evt.item.parentNode.insertBefore(dragGhost, evt.item.parentNode.children[ghostPosition]);
      }
    },
    onEnd: function(evt) {
      this.drag = false;
      console.log('end')

      if (dragGhost.parentNode !== null) {
        dragGhost.parentNode.removeChild(dragGhost);
      }

      evt.item.classList.remove('indicator');
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
