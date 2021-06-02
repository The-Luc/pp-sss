import { startCase } from 'lodash';
import { ICON_LOCAL } from '@/common/constants';
import PpButtonGroup from '@/components/ButtonGroup';

export default {
  data() {
    return {
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
      let text = obj.text;
      if (obj.setSelectionStyles && obj.isEditing) {
        text = text.split('');
        for (
          let i = obj.setSelectionStyles().selectionStart;
          i < obj.setSelectionStyles().selectionEnd;
          i++
        ) {
          text[i - 1] === undefined ||
          text[i - 1] === ' ' ||
          text[i - 1] === '\n'
            ? (text[i] = text[i].toUpperCase())
            : (text[i] = text[i].toLowerCase());
        }
        obj.set({
          text: text.join('')
        });
      } else {
        obj.set({
          text: startCase(obj.text.toLowerCase())
        });
      }
      canvas.renderAll();
    }
  }
};
