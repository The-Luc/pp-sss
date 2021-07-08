import PpButtonGroup from '@/components/Buttons/ButtonGroup';

import { mapGetters } from 'vuex';

import { ICON_LOCAL, TEXT_CASE } from '@/common/constants';
import { GETTERS as APP_GETTERS } from '@/store/modules/app/const';

import { isEmpty } from '@/common/utils';
import { EVENT_TYPE } from '@/common/constants/eventType';

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
      selectedTextCase: APP_GETTERS.SELECT_PROP_CURRENT_OBJECT,
      triggerChange: APP_GETTERS.TRIGGER_TEXT_CHANGE
    }),
    selectedCase() {
      if (this.triggerChange) {
        // just for trigger the change
      }

      return this.selectedTextCase('textCase') || null;
    }
  },
  methods: {
    /**
     * Detect click on item on text case properties
     * @param  {String} data Receive item information
     */
    onChange(data) {
      const value = isEmpty(data) ? TEXT_CASE.NONE : data;

      this.$root.$emit(EVENT_TYPE.CHANGE_TEXT_PROPERTIES, {
        textCase: value
      });
    }
  }
};
