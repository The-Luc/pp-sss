import PpButton from '@/components/Buttons/Button';
import LineVertical from '../LineVertical';

import { ROUTE_NAME, SCREEN } from '@/common/constants';

export default {
  components: {
    PpButton,
    LineVertical
  },
  props: {
    bookId: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      screen: SCREEN,
      routeName: ROUTE_NAME,
      path: this.$route.path
    };
  },
  watch: {
    $route(to) {
      this.path = to.path;
    }
  },
  methods: {
    /**
     * Event fire when view is changes
     *
     * @param {String}  newView   new view name
     * @param {String}  routeName route name
     */
    onChangeView(newView, routeName) {
      if (this.$route.name !== routeName) {
        this.$router.push(`/book/${this.bookId}${newView.toLowerCase()}`);
      }
    }
  }
};
