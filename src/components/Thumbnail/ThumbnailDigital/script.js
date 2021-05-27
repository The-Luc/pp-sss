import { IMAGE_LOCAL } from '@/common/constants';
export default {
  props: {
    orderScreen: {
      type: String,
      default: ''
    },
    sheet: {
      type: Object,
      required: true
    },
    edit: {
      type: Boolean,
      default: true
    },
    toLink: {
      type: String,
      default: ''
    },
    isActive: {
      type: Boolean,
      default: false
    },
    leftNumberPage: {
      type: Boolean,
      default: false
    },
    fontSize: {
      type: String,
      default: '10px'
    }
  },
  created() {
    this.image =
      this.sheet.printData.thumbnailUrl || IMAGE_LOCAL.BACKGROUND_WHITE;
  }
};
