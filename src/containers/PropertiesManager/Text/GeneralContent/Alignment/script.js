import { mapGetters } from 'vuex';
import PpButtonGroup from '@/components/Buttons/ButtonGroup';
import { GETTERS as APP_GETTERS } from '@/store/modules/app/const';
import { TEXT_HORIZONTAL_ALIGN } from '@/common/constants';

import { isEmpty } from '@/common/utils';
import { EVENT_TYPE } from '@/common/constants/eventType';

export default {
  components: {
    PpButtonGroup
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
    ...mapGetters({
      selectedAlign: APP_GETTERS.SELECT_PROP_CURRENT_OBJECT,
      triggerChange: APP_GETTERS.TRIGGER_TEXT_CHANGE
    }),
    selectedAlignment() {
      if (this.triggerChange) {
        // just for trigger the change
      }

      return this.selectedAlign('alignment')?.horizontal || this.LEFT;
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
