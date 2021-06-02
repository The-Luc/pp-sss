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
     * Get string text capitalize
     * @param   {Number} startText Selected first position of text in array after split
     * @param   {Number} endText Selected end position of text in array after split
     * @param   {Array} text Text in array after split
     * @returns {String}
     */
    capitalizeText(startText, endText, textArray) {
      for (let i = startText; i < endText; i++) {
        textArray[i] =
          textArray[i - 1] === undefined ||
          textArray[i - 1] === ' ' ||
          textArray[i - 1] === '\n'
            ? textArray[i].toUpperCase()
            : textArray[i].toLowerCase();
      }
      return textArray.join('');
    },
    /**
     * Set text box selected to uppercase
     */
    upperCase() {
      const canvas = window.printCanvas;
      let obj = canvas.getActiveObject();
      let text = obj.text;
      let textArray = text.split('') || [];
      if (obj.setSelectionStyles && obj.isEditing) {
        for (
          let i = obj.setSelectionStyles().selectionStart;
          i < obj.setSelectionStyles().selectionEnd;
          i++
        ) {
          textArray[i] = textArray[i].toUpperCase();
        }
        obj.set({
          text: textArray.join('')
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
      let textArray = text.split('') || [];
      if (obj.setSelectionStyles && obj.isEditing) {
        for (
          let i = obj.setSelectionStyles().selectionStart;
          i < obj.setSelectionStyles().selectionEnd;
          i++
        ) {
          textArray[i] = textArray[i].toLowerCase();
        }
        obj.set({
          text: textArray.join('')
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
      let textArray = text.split('') || [];
      if (obj.setSelectionStyles && obj.isEditing) {
        obj.set({
          text: this.capitalizeText(
            obj.setSelectionStyles().selectionStart,
            obj.setSelectionStyles().selectionEnd,
            textArray
          )
        });
      } else {
        obj.set({
          text: this.capitalizeText(0, obj.text.length, textArray)
        });
      }
      canvas.renderAll();
    }
  }
};
