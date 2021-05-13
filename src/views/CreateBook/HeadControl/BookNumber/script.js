import { BOOK_NUMBER_TYPE, BOOK_VIEW_TYPE } from '@/common/constants/book';
import Number from './Number';
import LineVertical from '../LineVertical';
import { mapGetters } from 'vuex';

export default {
  components: {
    Number,
    LineVertical
  },
  props: {
    currentView: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      bookNumberType: BOOK_NUMBER_TYPE,
      bookViewType: BOOK_VIEW_TYPE
    };
  },
  computed: {
    ...mapGetters('book', ['getTotalInfo'])
  }
};
