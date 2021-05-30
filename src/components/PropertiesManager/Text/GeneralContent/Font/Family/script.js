import PpSelect from '@/components/Select';
import { mapGetters } from 'vuex';
import { GETTERS } from '@/store/modules/book/const';
export default {
  components: {
    PpSelect
  },
  data() {
    return {
      selectedVal: {
        value: 'arial'
      }
    };
  },
  props: {
    items: {
      type: Array,
      required: true
    }
  },
  computed: {
    ...mapGetters({
      textProperties: GETTERS.GET_TEXT_PROPERTIES
    })
  },
  methods: {
    /**
     * Change font family of text box selected
     * @param   {Object} data new font family of text box
     */
    changeFontFamily(data) {
      this.selectedVal = {
        value: data.value
      };
      let canvas = window.printCanvas;
      let obj = canvas.getActiveObject();
      if (!obj) return;
      if (obj.getSelectionStyles().length > 0) {
        obj.setSelectionStyles({
          fontFamily: data.value
        });
      } else {
        obj.styles = {};
        obj.set({
          fontFamily: data.value
        });
      }
      canvas.renderAll();
    },
    /**
     * Set data of text properties modal
     */
    setDataFontFamily() {
      this.selectedVal = {
        value: this.textProperties.fontFamily
      };
    },
    /**
     * Clear data of text properties modal
     */
    clearDataFontFamily() {
      setTimeout(() => {
        this.selectedVal = {
          value: 'arial'
        };
      }, 100);
    }
  },
  mounted() {
    window.printCanvas.on({
      'selection:updated': this.setDataFontFamily,
      'selection:created': this.setDataFontFamily,
      'selection:cleared': this.clearDataFontFamily
    });
  }
};
