import { mapGetters } from 'vuex';

import PpCombobox from '@/components/Selectors/Combobox';
import { ICON_LOCAL } from '@/common/constants';
import {
  activeCanvas,
  getSelectedOption,
  getValueInput,
  isEmpty,
  pxToIn,
  validateInputOption
} from '@/common/utils';

import { GETTERS as APP_GETTERS } from '@/store/modules/app/const';
import { EVENT_TYPE } from '@/common/constants/eventType';
import { getTextSizeWithPadding } from '@/common/fabricObjects';

export default {
  components: {
    PpCombobox
  },
  props: {
    items: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      appendedIcon: ICON_LOCAL.APPENDED_ICON,
      prependedIcon: ICON_LOCAL.PREPENDED_FONT_SIZE
    };
  },
  computed: {
    ...mapGetters({
      selectedFontSize: APP_GETTERS.SELECT_PROP_CURRENT_OBJECT,
      triggerChange: APP_GETTERS.TRIGGER_TEXT_CHANGE
    }),
    selectedSize() {
      if (this.triggerChange) {
        // just for trigger the change
      }

      const selectedSize = this.selectedFontSize('fontSize') || 60;

      const selected = this.items.find(item => item.value === selectedSize);

      return getSelectedOption(selected || selectedSize, 'pt');
    }
  },
  methods: {
    /**
     * Set size for object text
     * @param {Any} val size of text (string or object)
     */
    onChange(data) {
      const { isValid, value } = validateInputOption(
        getValueInput(data),
        1,
        500,
        0,
        this.items,
        'pt'
      );

      const activeObj = activeCanvas?.getActiveObject();

      const { x, y } = activeObj?.aCoords?.tl || {};
      const updateData = isValid ? { fontSize: value } : {};

      this.$root.$emit(EVENT_TYPE.CHANGE_TEXT_PROPERTIES, updateData);

      const newDimentionData = {};

      const textObject = activeObj?._objects?.[1];

      if (x && y) {
        newDimentionData.coord = {
          x: pxToIn(x),
          y: pxToIn(y)
        };
      }

      if (textObject) {
        const { minBoundingWidth, minBoundingHeight } = getTextSizeWithPadding(
          textObject
        );
        newDimentionData.minWidth = pxToIn(minBoundingWidth);
        newDimentionData.minHeight = pxToIn(minBoundingHeight);
      }

      if (!isEmpty(newDimentionData)) {
        this.$root.$emit(EVENT_TYPE.CHANGE_TEXT_PROPERTIES, newDimentionData);
      }
    }
  }
};
