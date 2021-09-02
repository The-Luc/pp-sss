import InputTitle from '@/components/InputTitle';
import PpCombobox from '@/components/Selectors/Combobox';

import { ICON_LOCAL, STATUS_PAGE_TITLE } from '@/common/constants';

export default {
  components: {
    InputTitle,
    PpCombobox
  },
  data() {
    return {
      statusPageTitle: STATUS_PAGE_TITLE,
      appendedIcon: ICON_LOCAL.APPENDED_ICON
    };
  },
  computed: {
    pageTitle() {
      return 'Untitle';
    },
    statusPageTitleVal() {
      return { name: '', value: '' };
    }
  },
  methods: {
    /**
     * Emit page title value to parent
     * @param {String}  title page title value user entered
     */
    onChangeTitle(title) {
      this.$emit('change', title);
    },
    /**
     * Emit status page title value to parent
     * @param {Object}  data text status page title value user selected
     */
    onChangeStatus(data) {
      this.$emit('change', data.value);
    }
  }
};
