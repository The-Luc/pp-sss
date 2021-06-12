import { mapGetters } from 'vuex';

import { ICON_LOCAL, THINKNESS_OPTIONS } from '@/common/constants';
import { getValueInput, validateInputOption } from '@/common/utils/input';
import PpCombobox from '@/components/Combobox';
import { GETTERS } from '@/store/modules/book/const';
import { getSelectedOption } from '@/common/utils';

export default {
  components: {
    PpCombobox
  },
  data() {
    return {
      appendedIcon: ICON_LOCAL.APPENED_ICON,
      items: THINKNESS_OPTIONS,
      componentKey: 0
    };
  },
  computed: {
    ...mapGetters({
      selectedId: GETTERS.SELECTED_OBJECT_ID,
      onSelectedThickNess: GETTERS.PROP_OBJECT_BY_ID,
      triggerChange: GETTERS.TRIGGER_OBJECT_CHANGE
    }),
    selectedThickness() {
      if (this.triggerChange) {
        // just for trigger the change
      }
      const selectedThickness = this.onSelectedThickNess({
        id: this.selectedId,
        prop: 'strokeWidth'
      });
      const thicknessValue =
        selectedThickness || selectedThickness === 0 ? selectedThickness : 1;
      const selected = this.items.find(item => item.value === thicknessValue);

      return getSelectedOption(selected || thicknessValue, 'pt');
    }
  },
  methods: {
    /**
     * Validataion value. if valid then emit data to parent else force render
     * @param {Object|Number} data Thickness value
     */
    onChange(data) {
      const { isValid, value } = validateInputOption(
        getValueInput(data),
        0,
        50,
        0,
        this.items,
        'pt'
      );
      if (!isValid) {
        this.forceRenderComponent();
      } else {
        this.$emit('change', value);
      }
    },
    /**
     * Trigger render component by increase component key
     */
    forceRenderComponent() {
      this.componentKey += 1;
    }
  }
};
