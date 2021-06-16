import { mapGetters, mapMutations } from 'vuex';

import { GETTERS, MUTATES } from '@/store/modules/app/const';

export default {
  props: {
    eventName: {
      type: String,
      required: true
    },
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
    this.$root.$on('colorChange', color => {
      this.$root.$emit('printChangeTextProperties', { color });
    });
    this.$root.$on('borderChange', color => {
      this.$root.$emit('printChangeTextProperties', {
        border: {
          stroke: color
        }
      });
    });
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
    }
  }
};
