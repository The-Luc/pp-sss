import { mapGetters, mapMutations } from 'vuex';

import { useObject } from '@/hooks';
import Properties from '@/components/Properties/BoxProperties';
import TabMenu from '@/components/TabMenu';
import GeneralContent from './GeneralContent';
import StyleContent from './Style';
import ArrangeContent from '@/components/Arrange';

import { MUTATES } from '@/store/modules/app/const';
import { GETTERS as PRINT_GETTERS } from '@/store/modules/print/const';
import { DEFAULT_TEXT } from '@/common/constants';

export default {
  components: {
    Properties,
    GeneralContent,
    StyleContent,
    ArrangeContent,
    TabMenu
  },
  setup() {
    const { triggerChange, selectObjectProp } = useObject();
    return {
      triggerChange,
      selectObjectProp
    };
  },
  computed: {
    ...mapGetters({
      currentObject: PRINT_GETTERS.CURRENT_OBJECT
    }),
    rotateValue() {
      if (this.triggerChange) {
        // just for trigger the change
      }
      const coord = this.selectObjectProp('coord');
      return coord?.rotation || 0;
    },
    disabled() {
      if (this.triggerChange) {
        // just for trigger the change
      }
      const activeObj = window.printCanvas.getActiveObject();
      return !!activeObj.isEditing;
    },
    position() {
      if (this.triggerChange) {
        // just for trigger the change
      }

      const coord = this.selectObjectProp('coord');

      return {
        x: coord?.x || 0,
        y: coord?.y || 0
      };
    },
    minPosition() {
      return DEFAULT_TEXT.MIN_POSITION;
    },
    maxPosition() {
      return DEFAULT_TEXT.MAX_POSITION;
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
    maxSize() {
      return DEFAULT_TEXT.MAX_SIZE;
    },
    minWidth() {
      return this.selectObjectProp('minWidth') || DEFAULT_TEXT.MIN_SIZE;
    },
    minHeight() {
      return this.selectObjectProp('minHeight') || DEFAULT_TEXT.MIN_SIZE;
    }
  },
  watch: {
    selectedId() {
      this.setSelectedBorder();
    }
  },
  data() {
    return {
      borderOptions: [
        {
          name: 'No border',
          value: 'noBorder'
        },
        {
          name: 'Line',
          value: 'line'
        }
      ],
      selectedBorder: {
        name: 'No border',
        value: 'noBorder'
      }
    };
  },
  methods: {
    ...mapMutations({
      setColorPicker: MUTATES.SET_COLOR_PICKER_COLOR
    }),
    /**
     * Close color picker (if opening) when change tab
     */
    onChangeTabMenu(data) {
      if (data === 'style') {
        this.setSelectedBorder();
      }
      this.setColorPicker({
        tabActive: data
      });
    },
    /**
     * Set default selected border
     */
    setSelectedBorder() {
      const border = this.selectObjectProp('border');
      this.selectedBorder = this.borderOptions[border?.isBorder ? 1 : 0];
    },
    /**
     * Get border option selected and emit to text properties
     * @param {Object} data Border option selected
     */
    changeBorderOption(data) {
      const border = {
        isBorder: data.value !== 'noBorder',
        stroke: DEFAULT_TEXT.BORDER.STROKE,
        strokeDashArray: DEFAULT_TEXT.BORDER.STROKE_DASH_ARRAY,
        strokeLineCap: DEFAULT_TEXT.BORDER.STROKE_LINE_CAP,
        strokeWidth:
          data.value === 'noBorder' ? DEFAULT_TEXT.BORDER.STROKE_WIDTH : 1
      };
      this.$root.$emit('printChangeTextProperties', {
        border
      });
      this.selectedBorder = data;
    },
    /**
     * Handle update flip for Text object
     * @param {String} actionName action name
     */
    changeFlip(actionName) {
      const flip = this.selectObjectProp('flip');
      this.$root.$emit('printChangeTextProperties', {
        flip: {
          [actionName]: !flip[actionName]
        }
      });
    },
    /**
     * Handle update size, position or rotate for Text object
     * @param {Object} object object containing the value of update size, position or rotate
     */
    onChange(object) {
      this.$root.$emit('printChangeTextProperties', object);
    },

    /**
     * Handle update constrain property for Text object
     * @param {Boolean} isConstrain value for isConstrain property of Text object
     */
    onChangeConstrain(isConstrain) {
      this.$root.$emit('printChangeTextProperties', {
        isConstrain
      });
    }
  }
};
