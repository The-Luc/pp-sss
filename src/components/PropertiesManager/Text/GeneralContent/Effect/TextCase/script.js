import { startCase, upperFirst } from 'lodash';
import { mapGetters } from 'vuex';
import { ICON_LOCAL } from '@/common/constants';
import PpButtonGroup from '@/components/ButtonGroup';
import { GETTERS } from '@/store/modules/book/const';

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
  computed: {
    ...mapGetters({
      textProperties: GETTERS.GET_TEXT_PROPERTIES
    })
  },
  mounted() {
    window.printCanvas.on({
      'selection:updated': this.setDataTextProperties,
      'selection:created': this.setDataTextProperties,
      'selection:cleared': this.clearTextCase
    });
  },
  methods: {
    /**
     * Detect click on item on textcase properties
     * @param  {Object} val Receive item information
     */
    onChange(val) {
      this.item = val;
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
          text: text.toUpperCase(),
          textCase: 'uppercase'
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
          text: text.toLowerCase(),
          textCase: 'lowercase'
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
      obj.set({
        textCase: 'capitalize'
      });
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
    /**
     * Set data of text properties modal to active
     */
    setDataTextProperties() {
      switch (this.textProperties.textCase) {
        case 'uppercase':
          this.item = 0;
          break;
        case 'lowercase':
          this.item = 1;
          break;
        case 'capitalize':
          this.item = 2;
          break;
        default:
          this.item = null;
          break;
      }
    },
    /**
     * Clear data of text properties modal
     */
    clearTextCase() {
      this.item = null;
    }
  }
};
