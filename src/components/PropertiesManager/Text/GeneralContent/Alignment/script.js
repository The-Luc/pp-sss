import PpButtonGroup from '@/components/ButtonGroup';

export default {
  components: {
    PpButtonGroup
  },
  data() {
    return {
      item: null
    };
  },
  methods: {
    /**
     * Detect click on item on textcase properties
     * @param  {Object} val Receive item information
     */
    onChange(val) {
      switch (val) {
        case 0:
          this.textAlignLeft();
          break;
        case 1:
          this.textAlignCenter();
          break;
        case 2:
          this.textAlignRight();
          break;
        case 3:
          this.textAlignJustify();
          break;
        default:
          this.textAlignLeft();
          break;
      }
    },
    /**
     * Set text box selected text align left
     */
    textAlignLeft() {
      const canvas = window.printCanvas;
      let obj = canvas.getActiveObject();
      obj.set({
        textAlign: 'left'
      });
      canvas.renderAll();
    },
    /**
     * Set text box selected text align center
     */
    textAlignCenter() {
      const canvas = window.printCanvas;
      let obj = canvas.getActiveObject();
      obj.set({
        textAlign: 'center'
      });
      canvas.renderAll();
    },
    /**
     * Set text box selected text align right
     */
    textAlignRight() {
      const canvas = window.printCanvas;
      let obj = canvas.getActiveObject();
      obj.set({
        textAlign: 'right'
      });
      canvas.renderAll();
    },
    /**
     * Set text box selected text align justify
     */
    textAlignJustify() {
      const canvas = window.printCanvas;
      let obj = canvas.getActiveObject();
      obj.set({
        textAlign: 'justify'
      });
      canvas.renderAll();
    }
  }
};
