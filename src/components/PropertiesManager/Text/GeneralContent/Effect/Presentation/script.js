import PpButtonGroup from '@/components/ButtonGroup';
import { mapGetters } from 'vuex';
import { GETTERS } from '@/store/modules/book/const';

export default {
  data() {
    return {
      item: []
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
      this.setStyle(obj, 'fontWeight', isBold ? 'normal' : 'bold');
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
    underLine() {
      const canvas = window.printCanvas;
      let obj = canvas.getActiveObject();
      const under = this.getStyle(obj, 'textDecoration') === 'underline';
      this.setStyle(obj, 'textDecoration', under ? '' : 'underline');
      console.log(obj);
      canvas.renderAll();
    },
    /**
     * Set data of text properties modal
     */
    setDataTextProperties() {
      if (
        this.textProperties.bold &&
        this.textProperties.fontStyle &&
        this.textProperties.underLine
      ) {
        // if (!this.item.includes(1)) {
        this.item.push(0, 1, 2);
      } else {
        this.item.pop();
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
