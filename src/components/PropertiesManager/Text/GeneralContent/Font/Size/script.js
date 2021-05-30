import PpCombobox from '@/components/Combobox';
import { ICON_LOCAL } from '@/common/constants';

export default {
  components: {
    PpCombobox
  },
  props: {
    items: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      appendedIcon: ICON_LOCAL.APPENED_ICON,
      prependedIcon: ICON_LOCAL.PREPENDED_FONT_SIZE,
      selectedVal: {
        value: 'arial'
      }
    };
  },
  methods: {
    /**
     * Set size for object text
     * @param   {Any} val size of text (string or object)
     */
    onChange(val) {
      val = typeof val === 'string' ? { value: val } : val;
      this.selectedVal = {
        value: val.value
      };
      let canvas = window.printCanvas;
      let obj = canvas.getActiveObject();
      if (!obj) return;
      if (obj.getSelectionStyles().length > 0) {
        obj.setSelectionStyles({
          fontSize: val.value
        });
      } else {
        obj.styles = {};
        obj.set({
          fontSize: val.value
        });
      }
      canvas.renderAll();
    }
  }
};
