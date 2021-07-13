import { ICON_LOCAL, THINKNESS_OPTIONS } from '@/common/constants';
import { getValueInput, validateInputOption } from '@/common/utils/input';
import PpCombobox from '@/components/Selectors/Combobox';
import { getSelectedOption } from '@/common/utils';

export default {
  components: {
    PpCombobox
  },
  props: {
    strokeWidth: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      appendedIcon: ICON_LOCAL.APPENDED_ICON,
      items: THINKNESS_OPTIONS,
      componentKey: 0
    };
  },
  computed: {
    selectedThickness() {
      const thicknessValue = this.strokeWidth || 1;
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
