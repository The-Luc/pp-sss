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
    status: {
      type: Number
    }
  },
  data() {
    return {
      statusList: [
        {
          value: 0,
          label: 'Not Started'
        },
        {
          value: 1,
          label: 'In Process'
        },
        {
          value: 2,
          label: 'Completed'
        },
        {
          value: 3,
          label: 'Approved'
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
