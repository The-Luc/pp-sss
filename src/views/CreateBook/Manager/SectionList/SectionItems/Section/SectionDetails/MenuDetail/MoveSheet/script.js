import { mapMutations } from 'vuex';

import { ICON_LOCAL } from '@/common/constants';
import { MUTATES as BOOK_MUTATES } from '@/store/modules/book/const';

export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    value: {
      type: String,
      default: ''
    },
    isShow: {
      type: Boolean,
      default: false
    },
    sections: {
      type: Array
    },
    sheetId: {
      type: [Number, String],
      default: ''
    },
    sectionId: {
      type: [Number, String],
      default: ''
    }
  },
  methods: {
    ...mapMutations({
      moveSheet: BOOK_MUTATES.MOVE_TO_OTHER_SECTION
    }),
    onChangeStatus() {
      this.$emit('onChangeStatus');
    },
    onMoveSheet(id) {
      this.moveSheet({
        sheetId: this.sheetId,
        currentSectionId: this.sectionId,
        sectionId: id
      });
    }
  },
  created() {
    this.arrowDown = ICON_LOCAL.ARROW_DOWN;
  }
};
