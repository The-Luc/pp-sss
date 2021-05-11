import DragDropControl from '@/components/DragDropControl';

export default {
  components: {
    DragDropControl
  },
  props: {
    sectionId: {
      type: String
    },
    sectionName: {
      type: String
    },
    sectionColor: {
      type: String
    }
  }
};
