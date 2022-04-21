import PpSelect from '@/components/Selectors/Select';
import { useText } from '@/views/CreateBook/composables';

export default {
  components: {
    PpSelect
  },
  props: {
    selectedFont: {
      type: Object,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    const { getFonts } = useText();
    return { getFonts };
  },
  data() {
    return {
      fontFamily: []
    };
  },
  created() {
    this.fontFamily = this.getFonts();
  },
  methods: {
    /**
     * Emit to back value to parent
     * @param {Object} data new font family of text box
     */
    onChange(data) {
      this.$emit('change', {
        fontFamily: data.name
      });
    }
  }
};
