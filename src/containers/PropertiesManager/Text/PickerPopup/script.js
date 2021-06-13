import { Mix } from 'vue-color';
import { mapGetters, mapMutations } from 'vuex';

import { GETTERS, MUTATES } from '@/store/modules/app/const';

export default {
  components: {
    ColorPicker: Mix
  },
  computed: {
    ...mapGetters({
      color: GETTERS.COLOR_PICKER_COLOR,
      propsData: GETTERS.COLOR_PICKER_CUSTOM_PROPS,
      presets: GETTERS.COLOR_PICKER_PRESETS
    })
  },
  methods: {
    ...mapMutations({
      setPresets: MUTATES.SET_COLOR_PICKER_PRESETS
    }),
    /**
     * Method will be fired when the color of Color Picker is changed
     *
     * @param {String}  newColor  new color from Color Picker (HEX)
     */
    updateColor(newColor) {
      this.$root.$emit(this.propsData.eventName, newColor.hex8); // eventName: colorChange, borderChange
    },
    /**
     * Method will be fired when new preset is added in the Color Picker
     *
     * @param {String}  newPreset  new preset added in Color Picker (HEX)
     */
    addPreset(newPreset) {
      this.setPresets({ preset: newPreset });
    }
  }
};
