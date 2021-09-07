import PpCombobox from '@/components/Selectors/Combobox';
import { getValueInput, validateInputOption } from '@/common/utils';
import {
  ICON_LOCAL,
  TEXT_MARGIN_OPTION,
  MIN_MAX_TEXT_SETTINGS
} from '@/common/constants';

export default {
  components: {
    PpCombobox
  },
  props: {
    label: {
      type: String,
      required: true
    },
    selectedVal: {
      type: Object
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      componentKey: true,
      textMargin: TEXT_MARGIN_OPTION,
      appendedIcon: ICON_LOCAL.APPENDED_ICON
    };
  },
  methods: {
    /**
     * Emit top margin value to parent
     * @param {Object}  data top margin value user entered
     */
    onChangeMargin(data) {
      const isBottomMargin = this.label === 'Bottom Margin';
      const minMargin = isBottomMargin
        ? MIN_MAX_TEXT_SETTINGS.MIN_BOTTOM_MARGIN
        : MIN_MAX_TEXT_SETTINGS.MIN_MARGIN;
      const maxMargin = MIN_MAX_TEXT_SETTINGS.MAX_MARGIN;

      const { isValid, value } = validateInputOption(
        getValueInput(data),
        minMargin,
        maxMargin,
        2
      );

      if (!isValid) {
        this.forceRenderComponent();
        return;
      }

      this.$emit('change', value);
    },
    /**
     * Trigger render component by changing component key
     */
    forceRenderComponent() {
      this.componentKey = !this.componentKey;
    }
  }
};
