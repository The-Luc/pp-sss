import PpButtonGroup from '@/components/Buttons/ButtonGroup';

import { useElementProperties } from '@/hooks';
import { TEXT_VERTICAL_ALIGN } from '@/common/constants';
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
      TOP: TEXT_VERTICAL_ALIGN.TOP,
      MIDDLE: TEXT_VERTICAL_ALIGN.MIDDLE,
      BOTTOM: TEXT_VERTICAL_ALIGN.BOTTOM
    };
  },
  computed: {
    selectedAlignment() {
      return this.getProperty('alignment')?.vertical || this.TOP;
    }
  },
  methods: {
    /**
     * Detect click on item on text alignment properties
     * @param  {String} data Receive item information
     */
    onChange(data) {
      const value = isEmpty(data) ? TEXT_VERTICAL_ALIGN.TOP : data;

      this.$root.$emit(EVENT_TYPE.CHANGE_TEXT_PROPERTIES, {
        alignment: { vertical: value }
      });
    }
  }
};
