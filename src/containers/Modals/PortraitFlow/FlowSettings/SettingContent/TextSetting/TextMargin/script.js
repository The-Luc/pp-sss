import PpCombobox from '@/components/Selectors/Combobox';
import BoxMargin from './BoxMargin';
import { TEXT_MARGIN_OPTION } from '@/common/constants';
import { getSelectedOption } from '@/common/utils';

export default {
  components: {
    PpCombobox,
    BoxMargin
  },
  props: {
    textSettings: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    disabled() {
      return !this.textSettings.isPageTitleOn;
    },
    topMargin() {
      const { top } = this.textSettings.pageTitleMargins;

      const selected = TEXT_MARGIN_OPTION.find(item => item.value === top);
      const value = selected || top;

      return this.disabled
        ? getSelectedOption('')
        : getSelectedOption(value, '', `${value}"`);
    },
    leftMargin() {
      const { left } = this.textSettings.pageTitleMargins;

      const selected = TEXT_MARGIN_OPTION.find(item => item.value === left);
      const value = selected || left;

      return this.disabled
        ? getSelectedOption('')
        : getSelectedOption(value, '', `${value}"`);
    },
    rightMargin() {
      const { right } = this.textSettings.pageTitleMargins;

      const selected = TEXT_MARGIN_OPTION.find(item => item.value === right);
      const value = selected || right;

      return this.disabled
        ? getSelectedOption('')
        : getSelectedOption(value, '', `${value}"`);
    },
    bottomMargin() {
      const { bottom } = this.textSettings.pageTitleMargins;

      const selected = TEXT_MARGIN_OPTION.find(item => item.value === bottom);
      const value = selected || bottom;

      return this.disabled
        ? getSelectedOption('')
        : getSelectedOption(value, '', `${value}"`);
    }
  },
  methods: {
    /**
     * Emit top margin value to parent
     * @param {Object}  top top margin value user entered
     */
    onChangeTopMargin(top) {
      this.$emit('change', {
        pageTitleMargins: { ...this.textSettings.pageTitleMargins, top }
      });
    },
    /**
     * Emit left margin value to parent
     * @param {Object}  left left margin value user entered
     */
    onChangeLeftMargin(left) {
      this.$emit('change', {
        pageTitleMargins: { ...this.textSettings.pageTitleMargins, left }
      });
    },
    /**
     * Emit right margin value to parent
     * @param {Object}  right right margin value user entered
     */
    onChangeRightMargin(right) {
      this.$emit('change', {
        pageTitleMargins: { ...this.textSettings.pageTitleMargins, right }
      });
    },
    /**
     * Emit bottom margin value to parent
     * @param {Object}  bottom bottom margin value user entered
     */
    onChangeBottomMargin(bottom) {
      this.$emit('change', {
        pageTitleMargins: { ...this.textSettings.pageTitleMargins, bottom }
      });
    }
  }
};
