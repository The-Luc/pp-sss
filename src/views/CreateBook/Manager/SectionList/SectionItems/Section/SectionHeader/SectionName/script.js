import { mapMutations } from 'vuex';
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
  },
  methods: {
    ...mapMutations({
      editSectionName: 'book/editSectionName'
    }),
    saveTitle() {
      this.sectionNameCurrent = this.sectionNameCurrent || 'Untitled';
      this.editSectionName({
        sectionName: this.sectionNameCurrent,
        sectionId: this.sectionId
      });
    },
    keyUpEnter(event) {
      event.target.blur();
    },
    keyUpEsc(event) {
      event.target.blur();
      this.sectionNameCurrent = this.sectionName;
      this.saveTitle();
    }
  }
};
