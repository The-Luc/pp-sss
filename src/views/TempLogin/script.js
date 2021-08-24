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
    const covers = Object.keys(COVER_TYPE).map((k, index) => ({
      name: COVER_TYPE[k],
      value: index
    }));

    return {
      users,
      covers,
      maxPage: 140,
      selectedUser: users[1],
      selectedCover: covers[0]
    };
  },
  methods: {
    saveUser() {
      window.sessionStorage.setItem('userId', this.selectedUser.value);
      window.sessionStorage.setItem('userRole', ROLE[this.selectedUser.role]);
    },
    saveCover() {
      window.data.book.coverOption = this.selectedCover.name;
    },
    onCancel() {
      this.$refs.maxPageInput.blur();
    },
    onEnter() {
      this.$refs.maxPageInput.blur();
    },
    onSubmit() {
      if (!String(this.maxPage).trim()) return;

      window.data.book.numberMaxPages = parseInt(this.maxPage);
    },
    goToManager() {
      this.saveUser();
      this.saveCover();

      this.$router.push({ name: ROUTE_NAME.MANAGER, params: { bookId: 1719 } });
    }
  }
};
