import DragDropControl from '@/components/DragDropControl';
import DragDropIndicator from '@/components/DragDropIndicatorVertical';

export default {
  components: {
    DragDropControl,
    DragDropIndicator
  },
  props: {
    sequence: {
      type: Number,
      require: true
    },
    sheetId: {
      type: Number
    },
    sheetType: {
      type: String
    },
    draggable: {
      type: Boolean
    }
  },
  methods: {
    showDragControl: function(evt) {
      //const sectionHeader = evt.target.closest('.section-header');

      if (evt.target.getAttribute('data-draggable') !== 'true') {
        return;
      }

      this.$root.$emit('showDragControl', 'sheet' + this.sheetId);
    },
    hideDragControl: function() {
      this.$root.$emit('hideDragControl');
    }
  }
};
