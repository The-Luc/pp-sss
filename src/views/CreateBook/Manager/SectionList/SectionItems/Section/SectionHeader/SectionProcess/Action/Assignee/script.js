import { useAssigneeMenu } from '@/hooks';

import { isEmpty, scrollToElement } from '@/common/utils';

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
    }
  },
  setup() {
    const { getUsers } = useAssigneeMenu();

    return { getUsers };
  },
  data() {
    return {
      users: []
    };
  },
  computed: {
    assigneeIndex() {
      return this.users.findIndex(({ id }) => id === this.assigneeId);
    }
  },
  async mounted() {
    this.users = await this.getUsers();

    this.autoScroll(this.assigneeId);
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
    },
    /**
     * Get user refs by id and handle auto scroll
     *
     * @param {Number}  userId  selected user id
     */
    autoScroll(userId) {
      setTimeout(() => {
        const currentUser = this.$refs[`user${userId}`];

        if (isEmpty(currentUser)) return;

        scrollToElement(currentUser[0]?.$el, { block: 'center' });
      }, 20);
    }
  }
};
