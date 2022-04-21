import PpSelect from '@/components/Selectors/Select';
import SavedTextStylePopover from './SavedTextStylePopover';

import { isEmpty, toCssStyle } from '@/common/utils';

import { EVENT_TYPE } from '@/common/constants/eventType';
import { useTextStyle } from '@/hooks/style';
import { useElementProperties, useMenuProperties } from '@/hooks';

export default {
  components: {
    PpSelect,
    SavedTextStylePopover
  },
  data() {
    return {
      showSavedStylePopup: false,
      componentKey: true
    };
  },
  setup() {
    const { userTextStyles, textStyles } = useTextStyle();
    const { getProperty } = useElementProperties();
    const { isOpenMenuProperties } = useMenuProperties();

    return {
      userTextStyles,
      textStyles,
      getProperty,
      isOpenMenuProperties
    };
  },
  computed: {
    selectedItem() {
      const selectedId = this.getProperty('styleId') || 'default';
      return this.selectBoxItems.find(item => item.id === selectedId);
    },
    items() {
      const userStyles = this.userTextStyles.map(style => ({
        ...style,
        isCustom: true
      }));
      return [...this.textStyles, ...userStyles];
    },
    selectBoxItems() {
      return this.items.map(item => {
        const { name, id, style, isCustom } = item;
        return {
          name,
          id,
          style,
          isCustom,
          cssStyle: { ...toCssStyle(style), maxWidth: '275px' }
        };
      });
    }
  },
  methods: {
    /**
     * Event fired when user choose an item on list
     *
     * @param {String}  id id of style
     * @param {Object}  style attribute style of style
     */
    onChange({ id, style }) {
      this.onClose();

      if (isEmpty(id) || isEmpty(style)) return;

      this.$root.$emit(EVENT_TYPE.CHANGE_TEXT_PROPERTIES, {
        ...style,
        styleId: id
      });
    },

    /**
     * Fire when click selectbox
     */
    onClick() {
      if (!this.userTextStyles?.length) return;
      this.componentKey = !this.componentKey;
      this.showSavedStylePopup = true;
    },

    /**
     * Handle Close saved style popup
     */
    onClose() {
      this.showSavedStylePopup = false;
    },

    /**
     * Event fired when user click outside component
     */
    onClickOutside() {
      if (!this.showSavedStylePopup) return;
      this.onClose();
    }
  },
  watch: {
    isOpenMenuProperties(val) {
      if (!val) {
        this.onClose();
      }
    }
  }
};
