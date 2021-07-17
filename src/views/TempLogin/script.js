import PpSelect from '@/components/Selectors/Select';

import { ROLE } from '@/common/constants';

import { users } from '@/mock/users';

export default {
  components: {
    PpSelect
  },
  data() {
    return {
      users
    };
  },
  methods: {
    onChange(data) {
      window.sessionStorage.setItem('userId', data.value);
      window.sessionStorage.setItem('userRole', ROLE[data.role]);
    }
  }
};
