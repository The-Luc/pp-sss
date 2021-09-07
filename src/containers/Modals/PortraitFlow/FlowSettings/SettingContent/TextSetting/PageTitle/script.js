import InputTitle from '@/components/InputTitle';
import PpCombobox from '@/components/Selectors/Combobox';
import PpSelect from '@/components/Selectors/Select';

import { ICON_LOCAL, STATUS_PAGE_TITLE } from '@/common/constants';

export default {
  components: {
    InputTitle,
    PpCombobox,
    PpSelect
  },
  props: {
    textSettings: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      statusPageTitle: STATUS_PAGE_TITLE,
      appendedIcon: ICON_LOCAL.APPENDED_ICON
    };
  },
  computed: {
    isPageTitleOn() {
      return this.textSettings?.isPageTitleOn;
    },
    pageTitle() {
      return this.textSettings?.pageTitle;
    },
    statusPageTitleVal() {
      return this.statusPageTitle.find(
        ({ value }) => value === this.isPageTitleOn
      );
    }
  },
  methods: {
    /**
     * Emit page title value to parent
     * @param {String}  title page title value user entered
     */
    onChangeTitle(title) {
      this.$emit('change', { pageTitle: title });
    },
    /**
     * Emit status page title value to parent
     * @param {Object}  data text status page title value user selected
     */
    onChangeStatus(data) {
      this.$emit('change', { isPageTitleOn: data.value });
    }
  }
};
