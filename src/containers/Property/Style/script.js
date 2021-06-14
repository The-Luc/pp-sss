import { mapGetters } from 'vuex';

import { BORDER_STYLE } from '@/common/constants';
import Select from '@/components/Select';
import { GETTERS } from '@/store/modules/book/const';

export default {
  components: {
    Select
  },
  data() {
    return {
      options: BORDER_STYLE
    };
  },
  computed: {
    ...mapGetters({
      selectedId: GETTERS.SELECTED_OBJECT_ID,
      onSelectedBorderStyle: GETTERS.PROP_OBJECT_BY_ID,
      triggerChange: GETTERS.TRIGGER_TEXT_CHANGE
    }),
    selectedBorderStyle() {
      if (this.triggerChange) {
        // just for trigger the change
      }
      const selectedBorderStyle = this.onSelectedBorderStyle({
        id: this.selectedId,
        prop: 'border'
      });
      const borderStyleValue = selectedBorderStyle?.strokeLineCap
        ? selectedBorderStyle?.strokeLineCap
        : 'solid';
      const selected = this.options.find(
        item => item.value === borderStyleValue
      );
      return selected;
    }
  },
  methods: {
    /**
     * Emit border value to parent
     * @param   {Object}  val Border object selected
     */
    onChange(val) {
      this.$emit('change', val);
    }
  }
};
