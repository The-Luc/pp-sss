import PpButtonGroup from '@/components/Buttons/ButtonGroup';
import { useElementProperties } from '@/hooks';
import { TEXT_HORIZONTAL_ALIGN } from '@/common/constants';

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
      JUSTIFY: TEXT_HORIZONTAL_ALIGN.JUSTIFY,
      LEFT: TEXT_HORIZONTAL_ALIGN.LEFT,
      RIGHT: TEXT_HORIZONTAL_ALIGN.RIGHT,
      CENTER: TEXT_HORIZONTAL_ALIGN.CENTER
    };
  },
  computed: {
    selectedAlignment() {
      return this.getProperty('alignment')?.horizontal || this.LEFT;
    }
  },
  methods: {
    /**
     * Detect click on item on text alignment properties
     * @param  {String} data Receive item information
     */
    onChange(data) {
      const value = isEmpty(data) ? TEXT_HORIZONTAL_ALIGN.LEFT : data;

      this.$root.$emit(EVENT_TYPE.CHANGE_TEXT_PROPERTIES, {
        alignment: { horizontal: value }
      });
    }
  }
};
