export default {
  props: {
    isOpen: {
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
    /**
     * Fire when user click to select a status
     *
     * @param {Number}  status  selected status
     */
    onSelected(status) {
      this.$emit('change', { status });
    },
    /**
     * Fire when user click outside of status modal
     */
    onClickOutside() {
      this.$emit('clickOutside');
    }
  }
};
