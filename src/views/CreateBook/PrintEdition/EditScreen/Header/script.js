import { SCREEN } from '@/common/constants/book';
import PpButton from '@/components/Button';
export default {
  components: {
    PpButton
  },
  props: {
    nameEditor: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      screen: SCREEN
    };
  },
  methods: {
    onChangeView(newView) {
      this.$router.push(`${newView.toLowerCase()}`);
    }
  }
};
