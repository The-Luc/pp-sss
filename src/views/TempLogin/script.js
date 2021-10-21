import PpSelect from '@/components/Selectors/Select';
import PpButton from '@/components/Buttons/Button';

import { LOCAL_STORAGE, ROUTE_NAME } from '@/common/constants';

import { userService } from '@/api/user';
import { setItem } from '@/common/storage';

export default {
  components: {
    PpSelect,
    PpButton
  },
  data() {
    const rules = [value => !!value || 'Required.'];

    return {
      rules,
      isLoggedIn: false,
      selectedBookId: null,
      email: '',
      password: ''
    };
  },
  computed: {
    isDisabledLogin() {
      return !(this.email && this.password);
    }
  },
  methods: {
    saveUser(user) {
      setItem(LOCAL_STORAGE.COMMUNITY_USER_ID, user.communityUserId);
    },
    async onClickLogin() {
      const user = await userService.logIn(this.email, this.password);

      if (!user) return;

      // save token on localStorage
      setItem(LOCAL_STORAGE.TOKEN, user.token);
      this.saveUser(user);

      this.isLoggedIn = true;
    },
    goToManager() {
      const bookId = +this.selectedBookId || 2749;

      this.$router.push({ name: ROUTE_NAME.MANAGER, params: { bookId } });
    }
  }
};
