import PpButtonGroup from '@/components/ButtonGroup';
import { mapGetters } from 'vuex';
import { GETTERS } from '@/store/modules/book/const';

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
      selectedId: GETTERS.SELECTED_OBJECT_ID,
      selectedStyle: GETTERS.PROP_OBJECT_BY_ID,
      triggerChange: GETTERS.TRIGGER_OBJECT_CHANGE
    }),
    selectedStyles() {
      if (this.triggerChange) {
        // just for trigger the change
      }

      const isBold =
        this.selectedStyle({ id: this.selectedId, prop: 'isBold' }) || false;

      const isItalic =
        this.selectedStyle({ id: this.selectedId, prop: 'isItalic' }) || false;

      const isUnderline =
        this.selectedStyle({ id: this.selectedId, prop: 'isUnderline' }) ||
        false;

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

      this.$root.$emit('printChangeTextProperties', {
        isBold,
        isItalic,
        isUnderline
      });
    }
  }
};
