import { ICON_LOCAL } from '@/common/constants';
import PpButtonGroup from '@/components/ButtonGroup';
import { startCase, upperFirst } from 'lodash';
export default {
  data() {
    return {
      item: null,
      iconUpperCase: ICON_LOCAL.TEXT_UPPERCASE,
      iconLowerCase: ICON_LOCAL.TEXT_LOWERCASE,
      iconCapitalize: ICON_LOCAL.TEXT_CAPITALIZE
    };
  },
  components: {
    PpButtonGroup
  },
  methods: {
    /**
     * Detect click on item on textcase properties
     * @param  {Object} val Receive item information
     */
    onChange(val) {
      switch (val) {
        case 0:
          this.upperCase();
          break;
        case 1:
          this.lowerCase();
          break;
        case 2:
          this.capitalize();
          break;
        default:
          this.defaultCase();
          break;
      }
    },
    /**
     * Set text box selected to uppercase
     */
    upperCase() {
      const canvas = window.printCanvas;
      let obj = canvas.getActiveObject();
      obj.text = obj.text.toUpperCase();
      canvas.renderAll();
    },
    /**
     * Set text box selected to lowercase
     */
    lowerCase() {
      const canvas = window.printCanvas;
      let obj = canvas.getActiveObject();
      obj.text = obj.text.toLowerCase();
      canvas.renderAll();
    },
    /**
     * Set text box selected to capitalize
     */
    capitalize() {
      const canvas = window.printCanvas;
      let obj = canvas.getActiveObject();
      obj.text = startCase(obj.text.toLowerCase());
      canvas.renderAll();
    },
    /**
     * Set text box selected to defaultcase
     */
    defaultCase() {
      const canvas = window.printCanvas;
      let obj = canvas.getActiveObject();
      obj.text = upperFirst(obj.text.toLowerCase());
      canvas.renderAll();
    }
  }
};
