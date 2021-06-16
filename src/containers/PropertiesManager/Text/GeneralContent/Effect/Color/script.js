import { mapGetters, mapMutations } from 'vuex';

import { GETTERS, MUTATES } from '@/store/modules/app/const';
import { GETTERS as BOOK_GETTERS } from '@/store/modules/book/const';
import Color from '@/containers/Color';

export default {
  components: {
    Color
  },
  data() {
    return {
      eventName: 'colorChange'
    };
  },
  computed: {
    ...mapGetters({
      isOpenColorPicker: GETTERS.IS_OPEN_COLOR_PICKER,
      selectedId: BOOK_GETTERS.SELECTED_OBJECT_ID,
      selectedColor: BOOK_GETTERS.PROP_OBJECT_BY_ID,
      triggerChange: BOOK_GETTERS.TRIGGER_TEXT_CHANGE,
      colorPickerProps: GETTERS.COLOR_PICKER_CUSTOM_PROPS
    }),
    color() {
      if (this.triggerChange) {
        // just for trigger the change
      }
      let color = '#0B1717';
      if (this.colorPickerProps.tabActive === 'general') {
        color =
          this.selectedColor({ id: this.selectedId, prop: 'color' }) ||
          '#0B1717';
        this.setColorPickerColor({ color: color });
      }

      return color;
    }
  },
  methods: {
    ...mapMutations({
      setColorPickerColor: MUTATES.SET_COLOR_PICKER_COLOR
    })
  }
};
