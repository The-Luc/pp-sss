import PpSelect from '@/components/Selectors/Select';
import PpButton from '@/components/Buttons/Button';

import { ROLE, ROUTE_NAME } from '@/common/constants';

import { userService } from '@/api';
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
      setItem('userId', user.id);
      // temporary code, wait to get data from backend
      // setItem('userRole', ROLE[this.selectedUser.role]);
      setItem('userRole', ROLE['ADMIN']);
    },
    async onClickLogin() {
      const { login_user } = await userService.logIn(this.email, this.password);

      if (!login_user) return;

      // save token on localStorage
      setItem('token', login_user.token);
      this.saveUser(login_user.user);

      this.isLoggedIn = true;
    },
    goToManager() {
      const bookId = +this.selectedBookId || 2749;

      this.$router.push({ name: ROUTE_NAME.MANAGER, params: { bookId } });
    }
  }
};
