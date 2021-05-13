import { BOOK_NUMBER_TYPE } from '@/common/constants/book';

export default {
  props: {
    total: {
      type: Number,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    isActive: Boolean
  },
  computed: {
    numberText() {
      let res = '';
      switch (this.type) {
        case BOOK_NUMBER_TYPE.SCREENS:
          res = `${this.total} Screens`;
          break;
        case BOOK_NUMBER_TYPE.SHEETS:
          res = `${this.total} Sheets`;
          break;
        default:
          res = `${this.total} Pages`;
          break;
      }
      return res;
    }
  }
};
