import { mapMutations } from 'vuex';
import { cloneDeep } from 'lodash';

import { useObject } from '@/hooks';
import Properties from '@/components/Properties/BoxProperties';
import TabMenu from '@/components/TabMenu';
import GeneralContent from './GeneralContent';
import ArrangeContent from '@/components/Arrange';

import { MUTATES as APP_MUTATES } from '@/store/modules/app/const';

export default {
  components: {
    Properties,
    TabMenu,
    GeneralContent,
    ArrangeContent
  },
  setup() {
    const {
      getCurrentObject,
      triggerShapeChange,
      selectObjectProp
    } = useObject();
    return {
      getCurrentObject,
      triggerShapeChange,
      selectObjectProp
    };
  },
  computed: {
    currentArrange() {
      if (this.triggerShapeChange) {
        // just for trigger the change
      }

      return this.getCurrentObject;
    },
    valRotate() {
      if (this.triggerShapeChange) {
        // just for trigger the change
      }
      const rotate = this.selectObjectProp('coord');
      return rotate?.rotation || 0;
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
      const data = cloneDeep(object);
      const key = Object.keys(data);
      if (key.includes('rotate')) {
        data.coord = { ...(data?.rotate && { rotate: data.rotate }) };
      }
      this.$root.$emit('printChangeShapeProperties', data);
    }
  }
};
