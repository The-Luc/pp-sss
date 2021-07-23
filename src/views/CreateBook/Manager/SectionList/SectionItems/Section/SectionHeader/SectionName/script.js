import DragDropControl from '@/components/DragDrops/DragDropControl';

import { useSectionName } from '@/hooks';

export default {
  components: {
    DragDropControl
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
    },
    isEnable: {
      type: Boolean,
      default: false
    },
    isDragControlDisplayed: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    const { changeName } = useSectionName();

    return { changeName };
  },
  data() {
    return {
      sectionNameCurrent: this.sectionName,
      isEditMode: false
    };
  },
  methods: {
    saveTitle() {
      this.sectionNameCurrent = this.sectionNameCurrent.trim() || 'Untitled';

      this.changeName({
        sectionName: this.sectionNameCurrent,
        sectionId: this.sectionId
      });

      this.isEditMode = false;
    },
    keyUpEnter(event) {
      event.target.blur();
    },
    keyUpEsc(event) {
      event.target.blur();
      this.sectionNameCurrent = this.sectionName;
      this.saveTitle();
    },
    /**
     * Focus to name input control
     *
     * @param {Object}  event event fire when click on section name
     */
    click(event) {
      event.stopPropagation();

      const { text, input } = this.$refs;

      // 2 is border width (left + right)
      input.style.width = text.clientWidth + 2 + 'px';

      this.isEditMode = true;

      setTimeout(() => input.focus(), 20);
    }
  }
};
