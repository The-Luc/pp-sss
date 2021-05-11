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
  },
  mounted() {
    console.log('status', this.selectedStatus);
  }
};
