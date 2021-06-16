import { mapGetters, mapMutations } from 'vuex';

import { GETTERS as BOOK_GETTERS } from '@/store/modules/book/const';
import { MUTATES } from '@/store/modules/app/const';
import Color from '@/containers/Color';

export default {
  components: {
    Color
  },
  props: {
    color: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      eventName: 'textShadowColorChange'
    };
  },
  computed: {
    ...mapGetters({
      selectedId: BOOK_GETTERS.SELECTED_OBJECT_ID
    })
  },
  methods: {
    ...mapMutations({
      toggleColorPicker: MUTATES.TOGGLE_COLOR_PICKER,
      setColorPickerColor: MUTATES.SET_COLOR_PICKER_COLOR
    }),
    onColorChanged(color) {
      this.$emit('change', color);
    }
  },
  mounted() {
    this.$root.$on(this.eventName, this.onColorChanged);
  },
  beforeDestroy() {
    this.$root.$off(this.eventName, this.onColorChanged);
  }
};
