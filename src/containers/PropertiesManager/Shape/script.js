import { mapGetters, mapMutations } from 'vuex';

import Properties from '@/components/Properties';
import TabMenu from '@/components/TabMenu';
import GeneralContent from './GeneralContent';
import ArrangeContent from '@/components/Arrange';

import { MUTATES, GETTERS } from '@/store/modules/app/const';

export default {
  components: {
    Properties,
    TabMenu,
    GeneralContent,
    ArrangeContent
  },
  computed: {
    ...mapGetters({
      isOpenColorPicker: GETTERS.IS_OPEN_COLOR_PICKER
    })
  },
  methods: {
    ...mapMutations({
      setColorPicker: MUTATES.SET_COLOR_PICKER_COLOR
    }),
    /**
     * Close color picker (if opening) when change tab
     */
    onChangeTabMenu(data) {
      this.setColorPicker({
        tabActive: data
      });
    },
    changeRotate(val) {
      console.log(val);
    }
  }
};
