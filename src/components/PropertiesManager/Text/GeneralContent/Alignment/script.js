import { mapGetters } from 'vuex';
import PpButtonGroup from '@/components/ButtonGroup';
import { GETTERS } from '@/store/modules/book/const';
import { TEXT_ALIGN } from '@/common/constants/textAlign';

export default {
  components: {
    PpButtonGroup
  },
  data() {
    return {
      item: null
    };
  },
  mounted() {
    window.printCanvas.on({
      'selection:updated': this.setDataTextProperties,
      'selection:created': this.setDataTextProperties,
      'selection:cleared': this.clearDataTextProperties
    });
  },
  computed: {
    ...mapGetters({
      textProperties: GETTERS.GET_TEXT_PROPERTIES
    })
  },
  methods: {
    /**
     * Detect click on item on textcase properties
     * @param  {Number} val Receive item information
     */
    onChange(val) {
      this.item = val;
      this.setTextAlign(TEXT_ALIGN[val]);
    },
    /**
     * Set text box selected text align
     * @param  {String} position position of text align
     */
    setTextAlign(position) {
      const canvas = window.printCanvas;
      let obj = canvas.getActiveObject();
      obj.set({
        textAlign: position
      });
      canvas.renderAll();
    },
    setDataTextProperties() {
      switch (this.textProperties.textAlign) {
        case TEXT_ALIGN[0]:
          this.item = 0;
          break;
        case TEXT_ALIGN[1]:
          this.item = 1;
          break;
        case TEXT_ALIGN[2]:
          this.item = 2;
          break;
        case TEXT_ALIGN[3]:
        default:
          this.item = null;
          break;
      }
    }
  }
};
