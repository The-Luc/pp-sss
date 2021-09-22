import { autoScroll } from '@/common/utils';

export default {
  props: {
    isOpen: {
      type: Boolean,
      default: false
    },
    assigneeX: {
      type: Number,
      required: true
    },
    assigneeY: {
      type: Number,
      required: true
    },
    assigneeWidth: {
      type: Number,
      required: true
    },
    assigneeId: {
      type: [Number, String],
      default: ''
    },
    users: {
      type: Array,
      required: true
    }
  },
  computed: {
    assigneeIndex() {
      return this.users.findIndex(({ id }) => id === this.assigneeId);
    }
  },
  async mounted() {
    autoScroll(this.$refs, `user${this.assigneeId}`);
  },
  methods: {
    /**
     * Fire when user click to select a community member to assign
     *
     * @param {Object}  user  selected community member
     */
    onSelected(user) {
      this.$emit('change', user);
    },
    /**
     * Fire when user click outside of assignee modal
     */
    onClickOutside() {
      this.$emit('clickOutside');
    }
  }
};
