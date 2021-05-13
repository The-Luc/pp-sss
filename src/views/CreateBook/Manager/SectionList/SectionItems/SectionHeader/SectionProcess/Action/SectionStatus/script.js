export default {
  props: {
    isOpenStatus: {
      type: Boolean,
      default: false
    },
    statusX: {
      type: Number
    },
    statusY: {
      type: Number
    },
    statusWidth: {
      type: Number
    },
    sectionStatus: {
      type: Number
    }
  },
  data() {
    return {
      status: [
        {
          value: 0,
          label: 'not started'
        },
        {
          value: 1,
          label: 'in process'
        },
        {
          value: 2,
          label: 'completed'
        },
        {
          value: 3,
          label: 'approved'
        }
      ]
    };
  },
  methods: {
    onSelectedStatus(status) {
      this.$emit('onSelectedStatus', status);
    },
    onClickOutSideStatus() {
      this.$emit('onClickOutSideStatus');
    }
  }
};
