import { mapGetters, mapMutations } from 'vuex';

import { useClipArtProperties } from '@/hooks';
import Properties from '@/components/Properties/BoxProperties';
import TabMenu from '@/components/TabMenu';
import GeneralContent from './GeneralContent';
import ArrangeContent from '@/components/Arrange';

import { GETTERS as PRINT_GETTERS } from '@/store/modules/print/const';
import { MUTATES as APP_MUTATES } from '@/store/modules/app/const';
import { DEFAULT_CLIP_ART, OBJECT_TYPE } from '@/common/constants';

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
  data() {
    return {
      minPosition: -100,
      maxPosition: 100
    };
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
    },
    position() {
      if (this.triggerChange) {
        // just for trigger the change
      }

      const coord = this.getProperty('coord');

      return {
        x: coord?.x || 0,
        y: coord?.y || 0
      };
    },
    size() {
      if (this.triggerChange) {
        // just for trigger the change
      }
      const size = this.getProperty('size');
      return {
        width: size?.width || 0,
        height: size?.height || 0
      };
    },
    isConstrain() {
      if (this.triggerChange) {
        // just for trigger the change
      }
      return this.getProperty('isConstrain');
    },
    minSize() {
      const objectType = this.currentArrange.type;
      let res = 0;
      switch (objectType) {
        case OBJECT_TYPE.CLIP_ART:
          res = DEFAULT_CLIP_ART.MIN_SIZE;
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
        case OBJECT_TYPE.CLIP_ART:
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
     * Handle update flip for Clip Art
     * @param {String} actionName action name
     */
    changeFlip(actionName) {
      console.log(actionName);
    },
    /**
     * Handle update size, position or rotate for Clip Art
     * @param {Object} object object containing the value of update size, position or rotate
     */
    onChange(object) {
      this.$root.$emit('printChangeClipArtProperties', object);
    },
    /**
     * Handle constrain proportions for Clip Art
     * @param {Boolean} val
     */
    onChangeConstrain(val) {
      this.$root.$emit('printChangeClipArtProperties', {
        isConstrain: val
      });
    }
  }
};
