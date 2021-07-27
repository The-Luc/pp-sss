import { Mix } from 'vue-color';
import { mapGetters, mapMutations } from 'vuex';
import { GETTERS, MUTATES } from '@/store/modules/app/const';

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
  data() {
    return {
      currentColor: ''
    };
  },
  watch: {
    color() {
      this.refreshColorFromState();
    }
  },
  computed: {
    ...mapGetters({
      presets: GETTERS.COLOR_PICKER_PRESETS
    }),
    containerStyle() {
      return {
        top: this.top + 'px',
        left: this.left + 'px'
      };
    }
  },
  mounted() {
    this.refreshColorFromState();
  },
  methods: {
    ...mapMutations({
      setPresets: MUTATES.SET_COLOR_PICKER_PRESETS
    }),
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
    addPreset(preset) {
      this.setPresets({ preset });
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
