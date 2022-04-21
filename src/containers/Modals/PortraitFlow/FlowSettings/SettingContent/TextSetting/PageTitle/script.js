import InputTitle from '@/components/Properties/Features/InputTitle';
import PpCombobox from '@/components/Selectors/Combobox';
import PpSelect from '@/components/Selectors/Select';

import {
  ICON_LOCAL,
  STATUS_PAGE_TITLE,
  DEFAULT_VALUE_PAGE_TITLE
} from '@/common/constants';
import { isEmpty } from '@/common/utils';

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
      componentKey: true,
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
      const pageTitle = isEmpty(title) ? DEFAULT_VALUE_PAGE_TITLE : title;
      this.$emit('change', { pageTitle });

      this.componentKey = !this.componentKey;
    },
    /**
     * Emit status page title value to parent
     * @param {Object}  data text status page title value user selected
     */
    onChangeStatus(data) {
      this.$emit('change', {
        isPageTitleOn: data.value,
        pageTitle: DEFAULT_VALUE_PAGE_TITLE
      });
    }
  }
};
