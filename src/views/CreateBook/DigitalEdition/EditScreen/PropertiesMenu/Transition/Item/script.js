import TheHeader from './TheHeader';

import TheDetail from './TheDetail';

export default {
  components: {
    TheHeader,
    TheDetail
  },
  props: {
    firstFrame: {
      type: String,
      required: true
    },
    secondFrame: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      isExpand: true
    };
  },
  methods: {
    /**
     * Toggle expand detail
     */
    onToggleExpand() {
      this.isExpand = !this.isExpand;
    }
  }
};
