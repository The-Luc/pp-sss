import { useBookName } from './composables';

import { ROLE } from '@/common/constants';

export default {
  setup() {
    const { currentUser, generalInfo, updateTitle } = useBookName();

    return { currentUser, generalInfo, updateTitle };
  },
  data() {
    return {
      rootTitle: '',
      title: '',
      isCancel: false
    };
  },
  computed: {
    isEnable() {
      return this.currentUser.role === ROLE.ADMIN;
    }
  },
  watch: {
    generalInfo: {
      deep: true,
      immediate: true,
      handler(info) {
        this.rootTitle = info.title;
        this.title = info.title;
      }
    }
  },
  methods: {
    onCancel() {
      this.title = this.rootTitle;
      this.isCancel = true;
      this.$refs.nameInput.blur();
    },
    onEnter() {
      this.$refs.nameInput.blur();
    },
    async onSubmit() {
      if (!this.title.trim()) {
        this.title = 'Untitled';
      }

      if (this.isCancel || this.title === this.rootTitle) {
        this.isCancel = false;
        return;
      }

      this.updateTitle(this.title.trim());
    }
  }
};
