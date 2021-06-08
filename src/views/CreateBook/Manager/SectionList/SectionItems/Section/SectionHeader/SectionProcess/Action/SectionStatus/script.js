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
          name: 'Not Started'
        },
        {
          value: 1,
          name: 'In Process'
        },
        {
          value: 2,
          name: 'Completed'
        },
        {
          value: 3,
          name: 'Approved'
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
