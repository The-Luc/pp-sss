import PpButtonGroup from '@/components/ButtonGroup';

import { mapGetters } from 'vuex';

import { ICON_LOCAL, TEXT_CASE } from '@/common/constants';
import { GETTERS } from '@/store/modules/book/const';

import { isEmpty } from '@/common/utils';

export default {
  components: {
    PpButtonGroup
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
  computed: {
    ...mapGetters({
      selectedId: GETTERS.SELECTED_OBJECT_ID,
      selectedTextCase: GETTERS.PROP_OBJECT_BY_ID,
      triggerChange: GETTERS.TRIGGER_TEXT_CHANGE
    }),
    selectedCase() {
      if (this.triggerChange) {
        // just for trigger the change
      }

      return (
        this.selectedTextCase({
          id: this.selectedId,
          prop: 'textCase'
        }) || null
      );
    }
  },
  methods: {
    /**
     * Detect click on item on text case properties
     * @param  {String} data Receive item information
     */
    onChange(data) {
      const value = isEmpty(data) ? TEXT_CASE.NONE : data;

      this.$root.$emit('printChangeTextProperties', {
        textCase: value
      });
    }
  }
};
