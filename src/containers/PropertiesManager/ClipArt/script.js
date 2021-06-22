import { mapGetters, mapMutations } from 'vuex';

import { useClipArtProperties } from '@/hooks';
import Properties from '@/components/Properties/BoxProperties';
import TabMenu from '@/components/TabMenu';
import GeneralContent from './GeneralContent';
import ArrangeContent from '@/components/Arrange';

import { GETTERS as PRINT_GETTERS } from '@/store/modules/print/const';
import { MUTATES as APP_MUTATES } from '@/store/modules/app/const';

export default {
  setup() {
    const { triggerChange, getProperty } = useClipArtProperties();
    return {
      triggerChange,
      getProperty
    };
  },
  components: {
    Properties,
    TabMenu,
    GeneralContent,
    ArrangeContent
  },
  computed: {
    ...mapGetters({
      currentObject: PRINT_GETTERS.CURRENT_OBJECT
    }),
    currentArrange() {
      if (this.triggerChange) {
        // just for trigger the change
      }
      return this.currentObject;
    },
    rotateValue() {
      if (this.triggerChange) {
        // just for trigger the change
      }
      const coord = this.getProperty('coord');
      return coord?.rotation || 0;
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
      this.$root.$emit('printChangeClipArtProperties', object);
    }
  }
};
