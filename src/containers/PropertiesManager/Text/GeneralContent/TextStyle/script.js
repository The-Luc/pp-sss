import { mapGetters } from 'vuex';

import PpSelect from '@/components/Selectors/Select';
import SavedStylePopover from '@/components/SavedStylePopover';

import { isEmpty, toCssStyle } from '@/common/utils';

import { GETTERS as APP_GETTERS } from '@/store/modules/app/const';
import { EVENT_TYPE } from '@/common/constants/eventType';
import { useStyle, useTextStyle } from '@/hooks/style';

export default {
  components: {
    PpSelect,
    SavedStylePopover
  },
  data() {
    const items = [
      {
        name: 'Default',
        value: 'default',
        style: {
          fontFamily: 'Arial',
          fontSize: 60,
          isBold: false,
          isItalic: false,
          isUnderline: false,
          color: '#000000'
        }
      },
      {
        name: 'Cover Headline',
        value: 'coverHeadline',
        style: {
          fontFamily: 'Time News Roman',
          fontSize: 90,
          isBold: true,
          isItalic: true,
          isUnderline: false,
          color: '#00FF00'
        }
      },
      {
        name: 'Page Headline',
        value: 'pageHeadline',
        style: {
          fontFamily: 'Arial',
          fontSize: 35,
          isBold: false,
          isItalic: false,
          isUnderline: true,
          color: '#FF0000'
        }
      }
    ];

    const selectBoxItems = items.map(item => {
      const { name, value, style } = item;

      return {
        name,
        value,
        style,
        cssStyle: toCssStyle(style)
      };
    });

    return {
      items,
      selectBoxItems,
      showSavedStylePopup: false,
      componentKey: true
    };
  },
  setup() {
    const { savedTextStyles, getSavedTextStyles } = useTextStyle();
    return { savedTextStyles, getSavedTextStyles };
  },
  computed: {
    ...mapGetters({
      selectedStyleId: APP_GETTERS.SELECT_PROP_CURRENT_OBJECT,
      triggerChange: APP_GETTERS.TRIGGER_TEXT_CHANGE,
      isOpenMenuProperties: APP_GETTERS.IS_OPEN_MENU_PROPERTIES
    }),
    selectedItem() {
      const selectedId = this.selectedStyleId('styleId') || 'default';
      return this.selectBoxItems.find(item => item.value === selectedId);
    }
  },
  methods: {
    /**
     * Event fired when user choose an item on list
     *
     * @param {String}  value id of style
     * @param {Object}  style attribute style of style
     */
    onChange({ value, style }) {
      this.onClose();

      if (isEmpty(value) || isEmpty(style)) return;

      this.$root.$emit(EVENT_TYPE.CHANGE_TEXT_PROPERTIES, style);

      this.$root.$emit(EVENT_TYPE.CHANGE_TEXT_PROPERTIES, { styleId: value });
    },

    /**
     * Fire when click selectbox
     */
    onClick() {
      if (!this.savedTextStyles?.length) return;
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
    savedTextStyles(val) {
      this.selectBoxItems = [...this.items, ...val].map(item => ({
        ...item,
        cssStyle: toCssStyle(item.style)
      }));
    },
    isOpenMenuProperties(val) {
      if (!val) {
        this.onClose();
      }
    }
  },
  created() {
    this.getSavedTextStyles();
  }
};
