import PpButtonGroup from '@/components/Buttons/ButtonGroup';

import { ICON_LOCAL, TEXT_CASE } from '@/common/constants';
import { isEmpty } from '@/common/utils';

export default {
  components: {
    PpButtonGroup
  },
  props: {
    selectedCase: {
      type: String,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      iconUpperCase: ICON_LOCAL.TEXT_UPPERCASE,
      iconLowerCase: ICON_LOCAL.TEXT_LOWERCASE,
      iconCapitalize: ICON_LOCAL.TEXT_CAPITALIZE,
      UPPER: TEXT_CASE.UPPER,
      LOWER: TEXT_CASE.LOWER,
      CAPITALIZE: TEXT_CASE.CAPITALIZE
    };
  },
  methods: {
    /**
     * Emit to back value to parent
     * @param {String} data value to change
     */
    onChange(data) {
      const value = isEmpty(data) ? TEXT_CASE.NONE : data;
      this.$emit('change', {
        textCase: value
      });
    }
  }
};
