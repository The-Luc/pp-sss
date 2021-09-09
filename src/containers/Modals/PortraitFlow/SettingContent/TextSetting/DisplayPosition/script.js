import PpCombobox from '@/components/Selectors/Combobox';

import {
  ICON_LOCAL,
  TEXT_DISPLAY,
  TEXT_POSITION,
  NAME_GAP,
  NAME_WIDTH
} from '@/common/constants';

export default {
  components: {
    PpCombobox
  },
  data() {
    return {
      textPosition: TEXT_POSITION,
      textDisplay: TEXT_DISPLAY,
      nameGap: NAME_GAP,
      nameWidth: NAME_WIDTH,
      appendedIcon: ICON_LOCAL.APPENDED_ICON
    };
  },
  computed: {
    displayVal() {
      return { name: '', value: '' };
    },
    positionVal() {
      return { name: '', value: '' };
    },
    gapVal() {
      return { name: '', value: '' };
    },
    widthVal() {
      return { name: '', value: '' };
    }
  },
  methods: {
    /**
     * Emit text display value to parent
     * @param {Object}  data text display value user selected
     */
    onChangeDisplay(data) {
      this.$emit('change', { textDislay: data.value });
    },
    /**
     * Emit text position value to parent
     * @param {Object}  data text position value user selected
     */
    onChangePosition(data) {
      this.$emit('change', { textPosition: data.value });
    },
    /**
     * Emit name width value to parent
     * @param {Object}  data name width value user selected
     */
    onChangeWidth(data) {
      this.$emit('change', { nameWidth: data.value });
    },
    /**
     * Emit name gap value to parent
     * @param {Object}  data  name gap value user selected
     */
    onChangeGap(data) {
      this.$emit('change', { nameGap: data.value });
    }
  }
};
