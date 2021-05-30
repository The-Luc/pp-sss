import { mapGetters, mapMutations } from 'vuex';

import { GETTERS, MUTATES } from '@/store/modules/app/const';
import {
  GETTERS as PRINT_GETTERS,
  MUTATES as PRINT_MUTATES
} from '@/store/modules/print/const';

export default {
  data() {
    return {
      currentColor: '#0B1717'
    };
  },
  mounted() {
    this.$root.$on('colorChange', color => {
      this.currentColor = color;

      this.$root.$emit('textStyleChange', { fill: color });
    });

    const { color } = this.getTextStyle();

    this.currentColor = color || '#0B1717';
  },
  computed: {
    ...mapGetters({
      isOpenColorPicker: GETTERS.IS_OPEN_COLOR_PICKER
    })
  },
  methods: {
    ...mapGetters({
      getTextStyle: PRINT_GETTERS.TEXT_STYLE
    }),
    ...mapMutations({
      toggleColorPicker: MUTATES.TOGGLE_COLOR_PICKER,
      setTextStyle: PRINT_MUTATES.SET_TEXT_STYLE
    }),
    /**
     * Triggers mutation to toggle color picker popover
     */
    onOpenColorPicker() {
      this.toggleColorPicker({
        isOpen: !this.isOpenColorPicker,
        data: {
          color: this.currentColor
        }
      });
    }
  }
};
