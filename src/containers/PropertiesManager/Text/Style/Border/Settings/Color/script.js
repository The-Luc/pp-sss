import { mapGetters, mapMutations } from 'vuex';

import { GETTERS as BOOK_GETTERS } from '@/store/modules/book/const';
import { GETTERS, MUTATES } from '@/store/modules/app/const';
import Color from '@/containers/Color';

export default {
  components: {
    Color
  },
  data() {
    return {
      eventName: 'borderChange'
    };
  },
  computed: {
    ...mapGetters({
      selectedId: BOOK_GETTERS.SELECTED_OBJECT_ID,
      triggerChange: BOOK_GETTERS.TRIGGER_TEXT_CHANGE,
      selectedColor: BOOK_GETTERS.PROP_OBJECT_BY_ID,
      colorPickerProps: GETTERS.COLOR_PICKER_CUSTOM_PROPS
    }),
    borderColor() {
      if (this.triggerChange) {
        // just for trigger the change
      }
      const isTabStyle = this.colorPickerProps.tabActive === 'style';
      const border = isTabStyle
        ? this.selectedColor({ id: this.selectedId, prop: 'border' })
        : {};
      if (isTabStyle) {
        this.setColorPickerColor({
          color: border?.stroke || '#000000'
        });
      }
      return border?.stroke || '#000000';
    }
  },
  methods: {
    ...mapMutations({
      setColorPickerColor: MUTATES.SET_COLOR_PICKER_COLOR
    })
  }
};
