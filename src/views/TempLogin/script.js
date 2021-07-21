import PpSelect from '@/components/Selectors/Select';
import PpButton from '@/components/Buttons/Button';

import { ROLE, COVER_TYPE, ROUTE_NAME } from '@/common/constants';

import { users } from '@/mock/users';

export default {
  components: {
    PpSelect,
    PpButton
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
      window.sessionStorage.setItem('bookCoverType', data.name);
    },
    onCancel() {
      this.$refs.maxPageInput.blur();
    },
    onEnter() {
      this.$refs.maxPageInput.blur();
    },
    onSubmit() {
      if (!String(this.maxPage).trim()) return;

      window.sessionStorage.setItem('bookMaxPage', this.maxPage);
    },
    goToManager() {
      this.$router.push({ name: ROUTE_NAME.MANAGER, params: { bookId: 1719 } });
    }
  }
};
