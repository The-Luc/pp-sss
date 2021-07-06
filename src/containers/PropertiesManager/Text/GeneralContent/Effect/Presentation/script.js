import PpButtonGroup from '@/components/Buttons/ButtonGroup';
import { mapGetters } from 'vuex';
import { GETTERS as APP_GETTERS } from '@/store/modules/app/const';
import { EVENT_TYPE } from '@/common/constants/eventType';

export default {
  data() {
    return {
      BOLD: 'bold',
      ITALIC: 'italic',
      UNDERLINE: 'underline'
    };
  },
  components: {
    PpButtonGroup
  },
  computed: {
    ...mapGetters({
      selectedStyle: APP_GETTERS.SELECT_PROP_CURRENT_OBJECT,
      triggerChange: APP_GETTERS.TRIGGER_TEXT_CHANGE
    }),
    selectedStyles() {
      if (this.triggerChange) {
        // just for trigger the change
      }

      const isBold = this.selectedStyle('isBold') || false;

      const isItalic = this.selectedStyle('isItalic') || false;

      const isUnderline = this.selectedStyle('isUnderline') || false;

      const selected = [
        isBold ? this.BOLD : '',
        isItalic ? this.ITALIC : '',
        isUnderline ? this.UNDERLINE : ''
      ];

      return selected.filter(s => s !== '');
    }
  },
  methods: {
    onChange(data) {
      const isBold = data.indexOf(this.BOLD) >= 0;
      const isItalic = data.indexOf(this.ITALIC) >= 0;
      const isUnderline = data.indexOf(this.UNDERLINE) >= 0;

      this.$root.$emit(EVENT_TYPE.CHANGE_TEXT_PROPERTIES, {
        isBold,
        isItalic,
        isUnderline
      });
    }
  }
};
