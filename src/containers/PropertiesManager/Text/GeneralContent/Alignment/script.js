import { mapGetters } from 'vuex';
import PpButtonGroup from '@/components/Buttons/ButtonGroup';
import { GETTERS } from '@/store/modules/book/const';
import { GETTERS as PRINT_GETTERS } from '@/store/modules/print/const';
import { TEXT_HORIZIONTAL_ALIGN } from '@/common/constants';

import { isEmpty } from '@/common/utils';

export default {
  components: {
    PpButtonGroup
  },
  data() {
    return {
      JUSTIFY: TEXT_HORIZIONTAL_ALIGN.JUSTIFY,
      LEFT: TEXT_HORIZIONTAL_ALIGN.LEFT,
      RIGHT: TEXT_HORIZIONTAL_ALIGN.RIGHT,
      CENTER: TEXT_HORIZIONTAL_ALIGN.CENTER
    };
  },
  computed: {
    ...mapGetters({
      selectedAlign: PRINT_GETTERS.SELECT_PROP_CURRENT_OBJECT,
      triggerChange: PRINT_GETTERS.TRIGGER_TEXT_CHANGE
    }),
    selectedAlignment() {
      if (this.triggerChange) {
        // just for trigger the change
      }

      return this.selectedAlign('alignment')?.horiziontal || this.LEFT;
    }
  },
  methods: {
    /**
     * Detect click on item on text alignment properties
     * @param  {String} data Receive item information
     */
    onChange(data) {
      const value = isEmpty(data) ? TEXT_HORIZIONTAL_ALIGN.LEFT : data;

      this.$root.$emit('printChangeTextProperties', {
        alignment: { horiziontal: value }
      });
    }
  }
};
