import PropertiesManager from '@/containers/PropertiesManager';
import ToolPopoverManager from '@/containers/ToolPopoverManager';
import PpCombobox from '@/components/Selectors/Combobox';

import { useInfoBar, useObjectProperties, useToolBar } from '@/hooks';
import {
  isEmpty,
  splitNumberByDecimal,
  getSelectedOption,
  getValueInput,
  validateInputOption,
  getValueWithoutUnit
} from '@/common/utils';

import { ICON_LOCAL, ZOOM_VALUE, ZOOM_CONFIG } from '@/common/constants';

export default {
  components: {
    PropertiesManager,
    ToolPopoverManager,
    PpCombobox
  },
  props: {
    isDigital: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    const { infoBar } = useInfoBar();
    const { currentObject } = useObjectProperties();
    const { propertiesType, selectedToolName } = useToolBar();

    return { infoBar, currentObject, propertiesType, selectedToolName };
  },
  data() {
    return {
      componentKey: true,
      appendedIcon: ICON_LOCAL.APPENDED_ICON_ZOOM,
      zoomOptions: ZOOM_VALUE
    };
  },
  computed: {
    size() {
      return {
        width: this.getDisplaySize(this.currentObject?.size?.width),
        height: this.getDisplaySize(this.currentObject?.size?.height)
      };
    },
    zoom() {
      const { zoom } = this.infoBar;

      const selectedOption = ZOOM_VALUE.find(({ value }) => value === zoom);

      // when enter some number (ex: 14), zoom * 100 will become 14.000000002
      return getSelectedOption(
        selectedOption || zoom,
        '',
        `${Math.floor(zoom * 100, 0)}%`
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

        return;
      }

      const useData =
        typeof data === 'object' ? data : getValueWithoutUnit(data, '%');

      const selectedValue = isNaN(useData) ? useData : useData / 100;

      const { isValid, value, isForce } = validateInputOption(
        getValueInput(selectedValue),
        ZOOM_CONFIG.MIN,
        ZOOM_CONFIG.MAX,
        ZOOM_CONFIG.DECIMAL_PLACE,
        ZOOM_VALUE,
        '%',
        false,
        false
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
    },
    /**
     * Get display of size
     *
     * @param   {Number}  size  chosen size
     * @returns {String}        display of size
     */
    getDisplaySize(size) {
      return isEmpty(size) || size === 0
        ? '- - -'
        : `${splitNumberByDecimal(size)}???`;
    }
  }
};
