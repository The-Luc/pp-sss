import { mapGetters } from 'vuex';

import PpSelect from '@/components/Select';
import { GETTERS } from '@/store/modules/book/const';
import { GETTERS as PRINT_GETTERS } from '@/store/modules/print/const';

export default {
  components: {
    PpSelect
  },
  props: {
    items: {
      type: Array,
      required: true
    }
  },
  data() {
    const fonts = this.items.map(item => ({ name: item, value: item }));

    return {
      fonts
    };
  },
  computed: {
    ...mapGetters({
      selectedFontFamily: PRINT_GETTERS.SELECT_PROP_CURRENT_OBJECT,
      triggerChange: PRINT_GETTERS.TRIGGER_TEXT_CHANGE
    }),
    selectedFont() {
      if (this.triggerChange) {
        // just for trigger the change
      }

      const selectedFont = this.selectedFontFamily('fontFamily') || 'Arial';

      const selected = this.items.find(
        font => font.toLowerCase() === selectedFont.toLowerCase()
      );

      return { name: selected, value: selected };
    }
  },
  methods: {
    /**
     * Change font family of text box selected
     * @param {Object} data new font family of text box
     */
    onChange(data) {
      this.$root.$emit('printChangeTextProperties', { fontFamily: data.value });
    }
  }
};
