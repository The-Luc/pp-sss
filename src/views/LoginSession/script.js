import { get } from 'lodash';

import { LOCAL_STORAGE, ROUTE_NAME } from '@/common/constants';

import { resumSessionApi } from '@/api/user';
import { removeItem, setItem } from '@/common/storage';

export default {
  async created() {
    const loginToken = get(this.$router, 'currentRoute.query.token', '');
    setItem(LOCAL_STORAGE.TOKEN, loginToken);

    const { token, bookId, communityUserId } = await resumSessionApi(
      loginToken
    );

    if (!token) {
      removeItem(LOCAL_STORAGE.TOKEN);
      return;
    }

    // save token on localStorage
    this.saveUser({ communityUserId });
    setItem(LOCAL_STORAGE.TOKEN, token);

    this.goToManager(bookId);
  },
  methods: {
    saveUser(user) {
      setItem(LOCAL_STORAGE.COMMUNITY_USER_ID, user.communityUserId);
    },
    goToManager(bookId) {
      this.$router.push({ name: ROUTE_NAME.MANAGER, params: { bookId } });
    }
  }
};
