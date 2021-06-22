import { mapGetters, mapMutations } from 'vuex';
import { cloneDeep } from 'lodash';

import { useObject } from '@/hooks';
import Properties from '@/components/Properties/BoxProperties';
import TabMenu from '@/components/TabMenu';
import GeneralContent from './GeneralContent';
import ArrangeContent from '@/components/Arrange';

import { GETTERS as PRINT_GETTERS } from '@/store/modules/print/const';
import { MUTATES as APP_MUTATES } from '@/store/modules/app/const';
import { DEFAULT_SHAPE, OBJECT_TYPE } from '@/common/constants';

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
    ...mapGetters({
      getObjectById: PRINT_GETTERS.CURRENT_OBJECT
    }),
    currentArrange() {
      if (this.triggerShapeChange) {
        // just for trigger the change
      }
      return this.getObjectById;
    },
    rotateValue() {
      if (this.triggerShapeChange) {
        // just for trigger the change
      }
      const coord = this.selectObjectProp('coord');
      return coord?.rotation || 0;
    },
    sizeWidth() {
      if (this.triggerChange) {
        // just for trigger the change
      }
      const size = this.selectObjectProp('size');
      return size?.width || 0;
    },
    sizeHeight() {
      if (this.triggerChange) {
        // just for trigger the change
      }
      const size = this.selectObjectProp('size');
      return size?.height || 0;
    },
    isConstrain() {
      if (this.triggerChange) {
        // just for trigger the change
      }
      return this.selectObjectProp('isConstrain');
    },
    minSize() {
      const objectType = this.currentArrange.type;
      let res = 0;
      switch (objectType) {
        case OBJECT_TYPE.SHAPE:
          res = DEFAULT_SHAPE.MIN_SIZE;
          break;
        default:
          break;
      }
      return res;
    },
    maxSize() {
      const objectType = this.currentArrange.type;
      let res = 0;
      switch (objectType) {
        case OBJECT_TYPE.SHAPE:
          res = 60;
          break;
        default:
          break;
      }
      return res;
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
      const data = cloneDeep(object);
      const key = Object.keys(data);
      if (key.includes('size')) {
        data.size = {
          ...(data?.size?.width && { width: data.size.width }),
          ...(data?.size?.height && { height: data.size.height })
        };
      }
      if (key.includes('rotate')) {
        data.coord = { ...{ rotate: data.rotate } };
      }
      this.$root.$emit('printChangeShapeProperties', data);
    },
    onChangeConstrain(val) {
      this.$root.$emit('printChangeShapeProperties', {
        isConstrain: val
      });
    }
  }
};
