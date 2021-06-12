import { mapGetters } from 'vuex';
import PpButtonGroup from '@/components/ButtonGroup';
import { GETTERS } from '@/store/modules/book/const';
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
      selectedId: GETTERS.SELECTED_OBJECT_ID,
      selectedAlign: GETTERS.PROP_OBJECT_BY_ID,
      triggerChange: GETTERS.TRIGGER_TEXT_CHANGE
    }),
    selectedAlignment() {
      if (this.triggerChange) {
        // just for trigger the change
      }

      return (
        this.selectedAlign({
          id: this.selectedId,
          prop: 'alignment'
        })?.horiziontal || this.LEFT
      );
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
