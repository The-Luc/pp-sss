import PpButtonGroup from '@/components/Buttons/ButtonGroup';

import { mapGetters } from 'vuex';

import { TEXT_VERTICAL_ALIGN } from '@/common/constants';
import { GETTERS as APP_GETTERS } from '@/store/modules/app/const';

import { isEmpty } from '@/common/utils';
import { EVENT_TYPE } from '@/common/constants/eventType';

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
      selectedAlign: APP_GETTERS.SELECT_PROP_CURRENT_OBJECT,
      triggerChange: APP_GETTERS.TRIGGER_TEXT_CHANGE
    }),
    selectedAlignment() {
      if (this.triggerChange) {
        // just for trigger the change
      }

      return this.selectedAlign('alignment')?.vertical || this.TOP;
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
