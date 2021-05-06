import { BOOK_VIEW_TYPE } from '@/common/constants/book';
import PpButton from '@/components/Button';
import LineVertical from '../LineVertical';

export default {
  components: {
    PpButton,
    LineVertical
  },
  props: {
    currentView: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      bookViewType: BOOK_VIEW_TYPE
    };
  },
  methods: {
    onChangeView(newView) {
      this.$emit('onChangeView', newView);
    }
  }
};
