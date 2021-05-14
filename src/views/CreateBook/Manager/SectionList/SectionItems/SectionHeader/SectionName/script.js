import DragDropControl from '@/components/DragDropControl';

export default {
  components: {
    DragDropControl
  },
  data() {
    return {
      sectionNameCurrent: this.sectionName
    };
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
  },
  methods: {
    saveTitle(event) {
      event.target.blur();
      this.sectionNameCurrent = this.sectionNameCurrent || 'Untitled';
    },
    keyUpEsc(event) {
      event.target.blur();
      this.sectionNameCurrent = this.sectionName;
    }
  }
};
