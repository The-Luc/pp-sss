import PpButtonGroup from '@/components/ButtonGroup';

import { mapGetters } from 'vuex';

import { TEXT_VERTICAL_ALIGN } from '@/common/constants';
import { GETTERS } from '@/store/modules/book/const';

import { isEmpty } from '@/common/utils';

export default {
  components: {
    PpButtonGroup
  },
  data() {
    return {
      TOP: TEXT_VERTICAL_ALIGN.TOP,
      MIDDLE: TEXT_VERTICAL_ALIGN.MIDDLE,
      BOTTOM: TEXT_VERTICAL_ALIGN.BOTTOM
    };
  },
  computed: {
    ...mapGetters({
      selectedId: GETTERS.SELECTED_OBJECT_ID,
      selectedAlign: GETTERS.PROP_OBJECT_BY_ID,
      triggerChange: GETTERS.TRIGGER_OBJECT_CHANGE
    }),
    selectedAlignment() {
      if (this.triggerChange) {
        // just for trigger the change
      }

      return (
        this.selectedAlign({
          id: this.selectedId,
          prop: 'alignment'
        })?.vertical || this.TOP
      );
    }
  },
  methods: {
    /**
     * Detect click on item on text alignment properties
     * @param  {String} data Receive item information
     */
    onChange(data) {
      const value = isEmpty(data) ? TEXT_VERTICAL_ALIGN.TOP : data;

      this.$root.$emit('printChangeTextProperties', {
        alignment: { vertical: value }
      });
    }
  }
};
