import PropertiesManager from '@/containers/PropertiesManager';
import ToolPopoverManager from '@/containers/ToolPopoverManager';
import PpCombobox from '@/components/Selectors/Combobox';

import { useInfoBar } from '@/hooks';
import {
  isEmpty,
  splitNumberByDecimal,
  getSelectedOption,
  getValueInput,
  validateInputOption
} from '@/common/utils';

import { ICON_LOCAL, ZOOM_VALUE, ZOOM_CONFIG } from '@/common/constants';

export default {
  components: {
    PropertiesManager,
    ToolPopoverManager,
    PpCombobox
  },
  data() {
    return {
      componentKey: true,
      appendedIcon: ICON_LOCAL.APPENDED_ICON_ZOOM,
      zoomOptions: ZOOM_VALUE
    };
  },
  props: {
    isOpenMenuProperties: {
      type: Boolean,
      default: false
    },
    selectedToolName: {
      type: String,
      default: ''
    }
  },
  setup() {
    const { infoBar } = useInfoBar();

    return { infoBar };
  },
  computed: {
    size() {
      const w = this.infoBar.w;
      const h = this.infoBar.h;

      return {
        width: isEmpty(w) || w === 0 ? '- - -' : splitNumberByDecimal(w),
        height: isEmpty(h) || h === 0 ? '- - -' : splitNumberByDecimal(h)
      };
    },
    zoom() {
      const { zoom } = this.infoBar;

      const selectedOption = ZOOM_VALUE.find(({ value }) => value === zoom);

      // when enter some number (ex: 14), zoom * 100 will become 14.000000002
      return getSelectedOption(
        selectedOption || Math.floor(zoom * 100, 0),
        '%'
      );
    }
  },
  methods: {
    /**
     * Emit zoom to parent
     *
     * @param {Object|String} data  selected data
     */
    changeZoom(data) {
      if (isEmpty(data)) {
        this.onEsc();
      }

      const selectedValue = isNaN(data) ? data : data / 100;

      const { isValid, value, isForce } = validateInputOption(
        getValueInput(selectedValue),
        ZOOM_CONFIG.MIN,
        ZOOM_CONFIG.MAX,
        ZOOM_CONFIG.DECIMAL_PLACE,
        ZOOM_VALUE,
        '%'
      );

      if (!isValid) {
        this.onEsc();

        return;
      }

      this.$emit('zoom', { zoom: value });

      if (isForce) {
        this.forceRenderComponent();
      }
    },
    /**
     * Trigger render component by changing component key
     * Maybe improve later for performance
     */
    forceRenderComponent() {
      this.componentKey = !this.componentKey;
    },
    /**
     * Revert to previous data and unfocus input element
     */
    onEsc() {
      this.forceRenderComponent();
    }
  }
};
