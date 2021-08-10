import PpCombobox from '@/components/Selectors/Combobox';

import { useElementProperties } from '@/hooks';
import { ICON_LOCAL } from '@/common/constants';
import {
  activeCanvas,
  getSelectedOption,
  getValueInput,
  isEmpty,
  pxToIn,
  validateInputOption
} from '@/common/utils';

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
  setup() {
    const { getProperty } = useElementProperties();

    return {
      getProperty
    };
  },
  data() {
    return {
      appendedIcon: ICON_LOCAL.APPENDED_ICON,
      prependedIcon: ICON_LOCAL.PREPENDED_FONT_SIZE
    };
  },
  computed: {
    selectedSize() {
      const selectedSize = this.getProperty('fontSize') || 60;

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
