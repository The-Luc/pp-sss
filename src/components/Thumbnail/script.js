import IMAGE_LOCAL from '@/common/constants/image';
export default {
  props: {
    numberPage: {
      type: Object,
      default: () => {
        return {
          numberLeft: 'Back Cover',
          numberRight: 'Front Cover'
        };
      }
    },
    sheet: {
      type: Object
    },
    edit: {
      type: Boolean,
      default: true
    },
    link: {
      type: Boolean,
      default: true
    },
    toLink: {
      type: String
    }
  },
  created() {
    this.image =
      this.sheet.printData.thumbnailUrl || IMAGE_LOCAL.BACKGROUND_WHITE;
  },
  computed: {
    isTypeFull() {
      return this.sheet.type === 'full';
    }
  }
};
