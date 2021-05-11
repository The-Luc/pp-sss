import { SCREEN } from '@/common/constants/book';
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
      screen: SCREEN,
      path: this.$route.path
    };
  },
  watch: {
    $route(to) {
      this.path = to.path;
    }
  },
  methods: {
    onChangeView(newView) {
      this.$router.push(`${newView.toLowerCase()}`);
    }
  }
};
