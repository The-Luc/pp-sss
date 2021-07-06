import { mapGetters } from 'vuex';

import { BORDER_STYLE } from '@/common/constants';
import Select from '@/components/Selectors/Select';
import { GETTERS as APP_GETTERS } from '@/store/modules/app/const';

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
      onSelectedBorderStyle: APP_GETTERS.SELECT_PROP_CURRENT_OBJECT,
      triggerChange: APP_GETTERS.TRIGGER_TEXT_CHANGE
    }),
    selectedBorderStyle() {
      if (this.triggerChange) {
        // just for trigger the change
      }
      const selectedBorderStyle = this.onSelectedBorderStyle('border');
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
