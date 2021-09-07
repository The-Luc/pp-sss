import PageTitle from './PageTitle';
import Properties from './Properties';
import TextMargin from './TextMargin';
import DisplayPosition from './DisplayPosition';

import { isEmpty } from '@/common/utils';
import {
  DEFAULT_PAGE_TITLE,
  DEFAULT_MARGIN_PAGE_TITLE
} from '@/common/constants';

export default {
  components: {
    PageTitle,
    Properties,
    TextMargin,
    DisplayPosition
  },
  props: {
    textSettings: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    /**
     * Change text settings for page title or name text
     * @param  {Object} data Receive value information to change
     */
    onChange(data) {
      const isPageTitleOn = data?.isPageTitleOn;

      const textSettings = { ...this.textSettings, ...data };

      if (!isPageTitleOn && !isEmpty(isPageTitleOn)) {
        textSettings.pageTitleFontSettings = DEFAULT_PAGE_TITLE;
        textSettings.pageTitleMargins = DEFAULT_MARGIN_PAGE_TITLE;
      }

      this.$emit('portraitSettingChange', { textSettings });
    },
    /**
     * Change text properties for page title
     * @param  {Object} data Receive value information to change
     */
    onChangePageTitle(data) {
      const textSettings = {
        ...this.textSettings,
        pageTitleFontSettings: {
          ...this.textSettings.pageTitleFontSettings,
          ...data
        }
      };
      this.$emit('portraitSettingChange', { textSettings });
    },
    /**
     * Change text properties for name text
     * @param  {Object} data Receive value information to change
     */
    onChangeNameText(data) {
      const textSettings = {
        ...this.textSettings,
        nameTextFontSettings: {
          ...this.textSettings.nameTextFontSettings,
          ...data
        }
      };
      this.$emit('portraitSettingChange', { textSettings });
    }
  }
};
