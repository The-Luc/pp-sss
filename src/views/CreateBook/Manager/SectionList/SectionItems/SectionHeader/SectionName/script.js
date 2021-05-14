import DragDropControl from '@/components/DragDropControl';

export default {
  components: {
    DragDropControl
  },
  props: {
    sectionId: {
      type: Number,
      require: true
    },
    sectionName: {
      type: String,
      require: true
    },
    sectionColor: {
      type: String,
      require: true
    }
  }
};
