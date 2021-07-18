import { useGetters, useMutations } from 'vuex-composition-helpers';

import {
  GETTERS as APP_GETTERS,
  MUTATES as APP_MUTATES
} from '@/store/modules/app/const';

export default {
  setup() {
    const { info } = useGetters({
      info: APP_GETTERS.GENERAL_INFO
    });
    const { setInfo } = useMutations({
      setInfo: APP_MUTATES.SET_GENERAL_INFO
    });

    return {
      info,
      setInfo
    };
  },
  data() {
    return {
      rootTitle: '',
      title: '',
      isCancel: false
    };
  },
  watch: {
    info: {
      deep: true,
      handler(info) {
        this.rootTitle = info.title;
        this.title = info.title;
      }
    }
  },
  mounted() {
    this.title = this.info.title;
    this.rootTitle = this.info.title;
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

      this.setInfo({ ...this.info, title: this.title });
    }
  }
};
