import PpCombobox from '@/components/Selectors/Combobox';
import { ICON_LOCAL, TEXT_MARGIN } from '@/common/constants';

export default {
  components: {
    PpCombobox
  },
  computed: {
    topMargin() {
      return { name: '', value: '' };
    },
    leftMargin() {
      return { name: '', value: '' };
    },
    rightMargin() {
      return { name: '', value: '' };
    },
    bottomMargin() {
      return { name: '', value: '' };
    }
  },
  data() {
    return {
      textMargin: TEXT_MARGIN,
      appendedIcon: ICON_LOCAL.APPENDED_ICON
    };
  },
  methods: {
    /**
     * Emit top margin value to parent
     * @param {Object}  data top margin value user entered
     */
    onChangeTopMargin(data) {
      this.$emit('change', data.value);
    },
    /**
     * Emit left margin value to parent
     * @param {Object}  data left margin value user entered
     */
    onChangeLeftMargin(data) {
      this.$emit('change', data.value);
    },
    /**
     * Emit right margin value to parent
     * @param {Object}  data right margin value user entered
     */
    onChangeRightMargin(data) {
      this.$emit('change', data.value);
    },
    /**
     * Emit bottom margin value to parent
     * @param {Object}  data bottom margin value user entered
     */
    onChangeBottomMargin(data) {
      this.$emit('change', data.value);
    }
  }
};
