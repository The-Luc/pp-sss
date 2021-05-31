import PpButtonGroup from '@/components/ButtonGroup';
import { mapGetters } from 'vuex';
import { GETTERS } from '@/store/modules/book/const';
import { findIndex } from '@/mock/users';

export default {
  data() {
    return {
      item: [],
      obj: {}
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
  methods: {
    onChange(val) {},
    /**
     * Set style for object text
     * @param   {Object} object object text to set
     * @param   {String} styleName name property to set
     * @param   {String} value value of property to set
     */
    setStyle(object, styleName, value) {
      if (object.setSelectionStyles && object.isEditing) {
        var styles = {};
        styles[styleName] = value;
        object.setSelectionStyles(styles);
      } else {
        object.styles = {};
        object[styleName] = value;
      }
    },
    /**
     * Get style for object text
     * @param   {Object} object object text to set
     * @param   {String} styleName name property to set
     * @returns {Object}
     */
    getStyle(object, styleName) {
      return object.getSelectionStyles && object.isEditing
        ? object.getSelectionStyles()[0][styleName]
        : object[styleName];
    },
    /**
     * Check text box selected is bold
     */
    isBold() {
      const canvas = window.printCanvas;
      let obj = canvas.getActiveObject();
      const isBold = this.getStyle(obj, 'fontWeight') === 'bold';
      this.setStyle(obj, 'fontWeight', isBold ? '' : 'bold');
      canvas.renderAll();
    },
    /**
     * Check text box selected is italic
     */
    isItalic() {
      const canvas = window.printCanvas;
      let obj = canvas.getActiveObject();
      const isItalic = this.getStyle(obj, 'fontStyle') === 'italic';
      this.setStyle(obj, 'fontStyle', isItalic ? '' : 'italic');
      canvas.renderAll();
    },
    /**
     * Check text box selected is under line
     */
    isUnderLine() {
      const canvas = window.printCanvas;
      let obj = canvas.getActiveObject();
      const isUnder = this.getStyle(obj, 'underline') === true;
      if (obj.setSelectionStyles && obj.isEditing) {
        obj.setSelectionStyles({
          underline: !isUnder
        });
      } else {
        obj.styles = {};
        obj.set({
          underline: !isUnder
        });
      }
      canvas.renderAll();
    },
    /**
     * Set data of text properties modal
     */
    setDataTextProperties() {
      if (this.textProperties.bold) {
        this.item.push(0);
      } else {
        this.item = this.item.filter(item => item !== 0);
      }
      if (this.textProperties.fontStyle) {
        this.item.push(1);
      } else {
        this.item = this.item.filter(item => item !== 1);
      }
      if (this.textProperties.underLine) {
        this.item.push(2);
      } else {
        this.item = this.item.filter(item => item !== 2);
      }
    },
    /**
     * Clear data of text properties modal
     */
    clearDataTextProperties() {
      this.item = [];
    }
  },
  mounted() {
    window.printCanvas.on({
      'selection:updated': this.setDataTextProperties,
      'selection:created': this.setDataTextProperties,
      'selection:cleared': this.clearDataTextProperties
    });
  }
};
