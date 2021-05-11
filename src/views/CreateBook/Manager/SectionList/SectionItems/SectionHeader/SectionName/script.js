import DragControl from '@/components/DragControl';

export default {
  components: {
    DragControl
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
