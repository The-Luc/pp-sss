import IMAGE_LOCAL from '@/common/constants/image';
export default {
  props: {
    sheet: Object,
    edit: {
      type: Boolean,
      default: true
    },
    link: {
      type: Boolean,
      default: true
    }
  },
  created() {
    this.blank = IMAGE_LOCAL.BACKGROUND_WHITE;
  },
  computed: {
    isTypeFull() {
      return this.sheet.type === 'full';
    }
  }
};
