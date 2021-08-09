import PpButtonGroup from '@/components/Buttons/ButtonGroup';

import { useElementProperties } from '@/hooks';
import { ICON_LOCAL, TEXT_CASE } from '@/common/constants';

import { isEmpty } from '@/common/utils';
import { EVENT_TYPE } from '@/common/constants/eventType';

export default {
  components: {
    PpButtonGroup
  },
  setup() {
    const { getProperty } = useElementProperties();

    return {
      getProperty
    };
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
    selectedCase() {
      return this.getProperty('textCase') || null;
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
