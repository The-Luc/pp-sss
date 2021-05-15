import { ICON_LOCAL } from '@/common/constants';
import { mapMutations } from 'vuex';

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
      type: Number
    },
    sectionId: {
      type: Number
    }
  },
  methods: {
    ...mapMutations('book', ['moveSheet']),
    onChangeStatus() {
      this.$emit('onChangeStatus');
    },
    onMoveSheet(id) {
      this.moveSheet({
        sheetId: this.sheetId,
        sectionId: this.sectionId,
        currentSectionId: id
      });
    }
  },
  created() {
    this.arrowDown = ICON_LOCAL.ARROW_DOWN;
  }
};
