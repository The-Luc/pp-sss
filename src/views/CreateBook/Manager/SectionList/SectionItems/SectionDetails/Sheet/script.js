import DragDropIndicator from '@/components/DragDropIndicatorVertical';

export default {
  components: {
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
    }
  }
};
