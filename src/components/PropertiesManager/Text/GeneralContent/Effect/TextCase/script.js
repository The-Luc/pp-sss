import { ICON_LOCAL } from '@/common/constants';
import PpButtonGroup from '@/components/ButtonGroup';
import { startCase, upperFirst } from 'lodash';
export default {
  data() {
    return {
      item: [],
      iconUpperCase: ICON_LOCAL.TEXT_UPPERCASE,
      iconLowerCase: ICON_LOCAL.TEXT_LOWERCASE,
      iconCapitalize: ICON_LOCAL.TEXT_CAPITALIZE
    };
  },
  components: {
    PpButtonGroup
  },
  mounted() {
    this.item[0] = 3;
    window.printCanvas.on({
      'selection:cleared': this.clearTextCase
    });
  },
  methods: {
    /**
     * Detect click on item on textcase properties
     * @param  {Object} val Receive item information
     */
    onChange(val) {
      this.item[0] = val;
      console.log(this.item);
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
      let text = obj.text;
      if (obj.setSelectionStyles && obj.isEditing) {
        text = text.split('');
        console.log(text);
        for (
          let i = obj.setSelectionStyles().selectionStart;
          i < obj.setSelectionStyles().selectionEnd;
          i++
        ) {
          text[i] = text[i].toUpperCase();
        }
        obj.set({
          text: text.join('')
        });
      } else {
        obj.set({
          text: text.toUpperCase()
        });
      }
      canvas.renderAll();
    },
    /**
     * Set text box selected to lowercase
     */
    lowerCase() {
      const canvas = window.printCanvas;
      let obj = canvas.getActiveObject();
      let text = obj.text;
      if (obj.setSelectionStyles && obj.isEditing) {
        text = text.split('');
        console.log(text);
        for (
          let i = obj.setSelectionStyles().selectionStart;
          i < obj.setSelectionStyles().selectionEnd;
          i++
        ) {
          text[i] = text[i].toLowerCase();
        }
        obj.set({
          text: text.join('')
        });
      } else {
        obj.set({
          text: text.toLowerCase()
        });
      }
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
    },
    clearTextCase() {
      // console.log(this.item);
      // // this.item = null;
      // console.log(1);
    }
  }
};
