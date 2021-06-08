import { mapGetters, mapMutations } from 'vuex';

import { MUTATES } from '@/store/modules/app/const';
// import { GETTERS as PROP_GETTERS } from '@/store/modules/property/const';

export default {
  computed: {
    // ...mapGetters({
    //   textStyle: PROP_GETTERS.TEXT_STYLE
    // }),
    color() {
      const color = this.textStyle.color || '#0B1717';
      this.setColorPickerColor({ color: color });
      return color;
    }
  },
  methods: {
    ...mapMutations({
      setColorPickerColor: MUTATES.SET_COLOR_PICKER_COLOR
    })
  }
};
