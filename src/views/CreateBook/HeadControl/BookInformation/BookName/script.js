import { useBookName } from '@/hooks/header';

import { ROLE } from '@/common/constants';

export default {
  setup() {
    const { currentUser, generalInfo, setInfo } = useBookName();

    return { currentUser, generalInfo, setInfo };
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
      handler(info) {
        this.rootTitle = info.title;
        this.title = info.title;
      }
    }
  },
  mounted() {
    this.title = this.generalInfo.title;
    this.rootTitle = this.generalInfo.title;
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

      this.setInfo({ ...this.generalInfo, title: this.title });
    }
  }
};
