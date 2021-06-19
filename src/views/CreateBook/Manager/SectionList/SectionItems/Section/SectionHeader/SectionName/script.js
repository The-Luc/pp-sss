import { mapMutations } from 'vuex';
import DragDropControl from '@/components/DragDrops/DragDropControl';
import { MUTATES as BOOK_MUTATES } from '@/store/modules/book/const';

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
      type: [Number, String],
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
      editSectionName: BOOK_MUTATES.EDIT_SECTION_NAME
    }),
    saveTitle() {
      this.sectionNameCurrent = this.sectionNameCurrent.trim() || 'Untitled';
      this.editSectionName({
        sectionName: this.sectionNameCurrent,
        sectionId: this.sectionId
      });
      const { text, input } = this.$refs;
      text.style.display = 'block';
      input.style.display = 'none';
    },
    keyUpEnter(event) {
      event.target.blur();
    },
    keyUpEsc(event) {
      event.target.blur();
      this.sectionNameCurrent = this.sectionName;
      this.saveTitle();
    },
    click(event) {
      event.stopPropagation();
      const { text, input } = this.$refs;
      const width = text.clientWidth;
      text.style.display = 'none';
      input.style.display = 'block';
      input.style.width = width + 'px';
      input.focus();
    }
  }
};
