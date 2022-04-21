import { useActionSection } from '../../../composables';

import { ICON_LOCAL } from '@/common/constants';

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
  setup() {
    const { moveSheetToSpecificSection } = useActionSection();

    return { moveSheetToSpecificSection };
  },
  created() {
    this.arrowDown = ICON_LOCAL.ARROW_DOWN;
  },
  methods: {
    onChangeStatus() {
      this.$emit('onChangeStatus');
    },
    onMoveSheet(id) {
      this.moveSheetToSpecificSection(this.sheetId, id, this.sectionId);
    }
  }
};
