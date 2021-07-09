import { mapGetters } from 'vuex';

import Properties from '@/components/Properties/BoxProperties';
import TabPropertiesMenu from '@/containers/TabPropertiesMenu';
import GeneralContent from './GeneralContent';
import StyleContent from './Style';
import ArrangeContent from '@/components/Arrange';

import { GETTERS as APP_GETTERS } from '@/store/modules/app/const';
import { DEFAULT_TEXT } from '@/common/constants';
import { computedObjectSize, activeCanvas } from '@/common/utils';
import { EVENT_TYPE } from '@/common/constants/eventType';
import { BORDER_TYPE } from '@/common/constants/borderType';

export default {
  components: {
    Properties,
    GeneralContent,
    StyleContent,
    ArrangeContent,
    TabPropertiesMenu
  },
  computed: {
    ...mapGetters({
      currentObject: APP_GETTERS.CURRENT_OBJECT,
      selectObjectProp: APP_GETTERS.SELECT_PROP_CURRENT_OBJECT,
      triggerChange: APP_GETTERS.TRIGGER_TEXT_CHANGE
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

      const activeObj = activeCanvas?.getActiveObject();

      return !!activeObj?.isEditing;
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
  data() {
    return {
      borderOptions: BORDER_TYPE,
      selectedBorder: {
        name: 'No border',
        value: 'noBorder'
      }
    };
  },
  mounted() {
    this.setSelectedBorder();
  },
  methods: {
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
      this.$root.$emit(EVENT_TYPE.CHANGE_TEXT_PROPERTIES, {
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
      this.$root.$emit(EVENT_TYPE.CHANGE_TEXT_PROPERTIES, {
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
      const key = Object.keys(object);
      if (key.includes('size')) {
        const size = computedObjectSize(
          object.size,
          { width: this.sizeWidth, height: this.sizeHeight },
          DEFAULT_TEXT.MIN_SIZE,
          DEFAULT_TEXT.MAX_SIZE,
          this.isConstrain
        );
        object.size = size;
      }
      this.$root.$emit(EVENT_TYPE.CHANGE_TEXT_PROPERTIES, object);
    },

    /**
     * Handle update constrain property for Text object
     * @param {Boolean} isConstrain value for isConstrain property of Text object
     */
    onChangeConstrain(isConstrain) {
      this.$root.$emit(EVENT_TYPE.CHANGE_TEXT_PROPERTIES, {
        isConstrain
      });
    }
  }
};
