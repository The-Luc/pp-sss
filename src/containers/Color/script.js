import { mapGetters, mapMutations } from 'vuex';
import { uniqueId } from 'lodash';

import { GETTERS, MUTATES } from '@/store/modules/app/const';

export default {
  props: {
    color: {
      type: String,
      required: true
    },
    label: {
      type: String,
      default: 'Color'
    }
  },
  mounted() {
    this.$root.$on(this.eventName, color => {
      this.$emit('change', color);
    });
  },
  data() {
    return {
      eventName: `color-${uniqueId()}`
    };
  },
  computed: {
    ...mapGetters({
      isOpenColorPicker: GETTERS.IS_OPEN_COLOR_PICKER
    })
  },
  methods: {
    ...mapMutations({
      toggleColorPicker: MUTATES.TOGGLE_COLOR_PICKER,
      setColorPickerColor: MUTATES.SET_COLOR_PICKER_COLOR
    }),
    /**
     * Triggers mutation to toggle color picker popover
     */
    onOpenColorPicker() {
      const { top, left } = this.$refs.boxColor.getBoundingClientRect();
      if (!this.isOpenColorPicker) {
        this.toggleColorPicker({
          isOpen: !this.isOpenColorPicker,
          data: {
            eventName: this.eventName,
            color: this.color,
            top,
            left
          }
        });
      }
    },
    /**
     * Emit event to start pick color
     */
    onOpenEyeDropper() {
      this.$root.$emit('printStartPickColor', this.eventName);
    }
  }
};
