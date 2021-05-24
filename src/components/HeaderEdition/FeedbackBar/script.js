import { mapGetters } from 'vuex';

import PropertiesManager from '@/components/PropertiesManager';
import { GETTERS } from '@/store/modules/app/const';

export default {
  components: {
    PropertiesManager
  },
  computed: {
    ...mapGetters({
      isOpenMenuProperties: GETTERS.IS_OPEN_MENU_PROPERTIES
    })
  }
};
