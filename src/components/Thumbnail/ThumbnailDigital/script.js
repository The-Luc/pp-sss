import IMAGE_LOCAL from '@/common/constants/image';
import { LINK_STATUS, SHEET_TYPES } from '@/common/constants';
export default {
  props: {
    numberPage: {
      type: Object,
      default: {}
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
      required: true
    },
    isActive: {
      type: Boolean,
      default: false
    }
  },
  created() {
    this.image =
      this.sheet.printData.thumbnailUrl || IMAGE_LOCAL.BACKGROUND_WHITE;
    this.LINK_STATUS = LINK_STATUS;
    this.SHEET_TYPES = SHEET_TYPES;
  }
};
