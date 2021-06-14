import { mapGetters, mapMutations } from 'vuex';

import Properties from '@/components/Properties';
import TabMenu from '@/components/TabMenu';
import GeneralContent from './GeneralContent';
import StyleContent from './Style';
import ArrangeContent from './Arrange';
import PickerPopup from './PickerPopup';

import { MUTATES, GETTERS } from '@/store/modules/app/const';

export default {
  components: {
    Properties,
    GeneralContent,
    StyleContent,
    ArrangeContent,
    TabMenu,
    PickerPopup
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
    }
  }
};
