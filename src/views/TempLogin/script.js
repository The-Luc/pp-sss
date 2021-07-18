import PpSelect from '@/components/Selectors/Select';

import { ROLE, COVER_TYPE } from '@/common/constants';

import { users } from '@/mock/users';

export default {
  components: {
    PpSelect
  },
  data() {
    return {
      users,
      covers: Object.keys(COVER_TYPE).map((k, index) => ({
        name: COVER_TYPE[k],
        value: index
      })),
      maxPage: 140
    };
  },
  methods: {
    onChangeUser(data) {
      window.sessionStorage.setItem('userId', data.value);
      window.sessionStorage.setItem('userRole', ROLE[data.role]);
    },
    onChangeCover(data) {
      window.sessionStorage.setItem('bookCoverType', data);
    },
    onCancel() {
      this.$refs.maxPageInput.blur();
    },
    onEnter() {
      this.$refs.maxPageInput.blur();
    },
    onSubmit() {
      if (!this.maxPage.trim()) return;

      window.sessionStorage.setItem('bookMaxPage', this.maxPage);
    }
  }
};
