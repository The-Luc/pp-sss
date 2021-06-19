import { mapGetters, mapMutations } from 'vuex';

import Properties from '@/components/Properties';
import TabMenu from '@/components/TabMenu';
import GeneralContent from './GeneralContent';
import ArrangeContent from '@/components/Arrange';

import {
  MUTATES as APP_MUTATES,
  GETTERS as APP_GETTERS
} from '@/store/modules/app/const';
import { GETTERS } from '@/store/modules/book/const';
import { GETTERS as PRINT_GETTERS } from '@/store/modules/print/const';

export default {
  components: {
    Properties,
    TabMenu,
    GeneralContent,
    ArrangeContent
  },
  computed: {
    ...mapGetters({
      isOpenColorPicker: APP_GETTERS.IS_OPEN_COLOR_PICKER,
      getObjectById: PRINT_GETTERS.CURRENT_OBJECT,
      triggerChange: PRINT_GETTERS.TRIGGER_SHAPE_CHANGE
    }),
    currentArrange() {
      if (this.triggerChange) {
        // just for trigger the change
      }

      return this.getObjectById;
    }
  },
  methods: {
    ...mapMutations({
      setColorPicker: APP_MUTATES.SET_COLOR_PICKER_COLOR
    }),
    /**
     * Close color picker (if opening) when change tab
     */
    onChangeTabMenu(data) {
      this.setColorPicker({
        tabActive: data
      });
    },
    /**
     * Handle update z-index for Shape
     * @param {String} actionName action name
     */
    changeZIndex(actionName) {
      console.log(actionName);
    },
    /**
     * Handle update flip for Shape
     * @param {String} actionName action name
     */
    changeFlip(actionName) {
      console.log(actionName);
    },
    /**
     * Handle update size, position or rotate for Shape
     * @param {Object} object object containing the value of update size, position or rotate
     */
    onChange(object) {
      console.log(object);
    }
  }
};
