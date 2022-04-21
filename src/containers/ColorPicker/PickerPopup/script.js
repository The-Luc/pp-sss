import { Mix } from 'vue-color';
import { useColorPicker } from '@/views/CreateBook/composables';
import { MAX_COLOR_PICKER_PRESET } from '@/common/constants';

export default {
  components: {
    ColorPicker: Mix
  },
  props: {
    top: {
      type: Number,
      default: 0
    },
    left: {
      type: Number,
      default: 0
    },
    color: {
      type: String,
      default: ''
    },
    height: {
      type: Number,
      default: 0
    }
  },
  setup() {
    const { updateColorPicker, getPresets } = useColorPicker();

    return { updateColorPicker, getPresets };
  },
  data() {
    return {
      currentColor: '',
      presets: []
    };
  },
  watch: {
    color() {
      this.refreshColorFromState();
    }
  },
  computed: {
    containerStyle() {
      return {
        top: this.top + 'px',
        left: this.left + 'px'
      };
    }
  },
  async mounted() {
    this.refreshColorFromState();
    this.presets = await this.getPresets();
  },
  methods: {
    refreshColorFromState() {
      this.currentColor = this.color;
    },
    /**
     * Method will be fired when the color of Color Picker is changed
     *
     * @param {String}  hex8  new color from Color Picker (HEX)
     */
    updateColor({ hex8 }) {
      this.currentColor = hex8;
      this.$emit('change', hex8);
    },
    /**
     * Method will be fired when new preset is added in the Color Picker
     *
     * @param {String}  preset  new preset added in Color Picker (HEX)
     */
    async addPreset(preset) {
      this.presets = [preset, ...this.presets].slice(
        0,
        MAX_COLOR_PICKER_PRESET
      );
      this.updateColorPicker(preset);
    },
    /**
     * Trigger mutation close color picker when click outside
     *
     */
    onClosePicker() {
      this.$emit('close');
    }
  }
};
