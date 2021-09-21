import PpInput from '@/components/Input/InputProperty';
import PpSelect from '@/components/Selectors/Select';
import PpCombobox from '@/components/Selectors/Combobox';

import { isEmpty } from '@/common/utils';

import { ICON_LOCAL } from '@/common/constants';
import {
  CONTROL_TYPE,
  DIRECTION_OPTIONS,
  NONE_OPTION,
  PLAY_IN_OPTIONS,
  PLAY_OUT_OPTIONS,
  DEFAULT_ANIMATION
} from '@/common/constants/animationProperty';

export default {
  components: { PpSelect, PpInput, PpCombobox },
  props: {
    type: {
      type: String,
      default: ''
    },
    config: {
      type: Object,
      default: () => ({})
    },
    order: {
      type: Number,
      default: 1
    },
    isDisabledPreview: {
      type: Boolean
    },
    disabled: {
      type: Boolean
    },
    isOrderDisabled: {
      type: Boolean
    },
    applyOptions: {
      type: Array
    },
    orderOptions: {
      type: Array
    }
  },
  data() {
    const styleOptions =
      this.type === CONTROL_TYPE.PLAY_IN ? PLAY_IN_OPTIONS : PLAY_OUT_OPTIONS;

    const title = this.type === CONTROL_TYPE.PLAY_IN ? 'Play In' : 'Play Out';

    return {
      appendedIcon: ICON_LOCAL.APPENDED_ICON,
      title,
      styleOptions,
      directionOptions: DIRECTION_OPTIONS,
      selectedStyle: NONE_OPTION,
      selectedApplyOption: null,
      selectedDirection: DIRECTION_OPTIONS[0],
      durationValue: 0.8,
      scaleValue: 50,
      showApplyOptions: false,
      showApplyButton: false,
      componentKey: true
    };
  },
  computed: {
    selectedOrder() {
      if (isEmpty(this.order)) return this.orderOptions[0];

      const order = this.orderOptions.find(o => o.value === this.order);

      return order || { name: this.order, value: this.order };
    },
    isShowOptions() {
      return this.selectedStyle?.value !== NONE_OPTION.value;
    }
  },
  methods: {
    /**
     * Fire when user change a play in /play out style
     * @param {Object} val A style option
     */
    onChangeStyle(style) {
      if (style.value !== this.selectedStyle.value) {
        this.showApplyOptions = true;
      }

      this.selectedStyle = style;

      this.resetConfig();
    },
    /**
     * Fire when user change the order combobox
     * @param {Object} val Order option
     */
    onChangeOrder(val) {
      const item = this.orderOptions.find(
        opt => opt === val || opt.value === val
      );
      if (!item) {
        this.forceUpdate();
        return;
      }

      this.$emit('changeOrder', val.value);
    },
    /**
     * Fire when user change scale input
     * @param {Object} val Order option
     */
    onChangeScale(val) {
      if (Number(val) < 0 || Number(val) > 100) {
        this.forceUpdate();

        return;
      }

      if (val !== this.scaleValue) {
        this.showApplyOptions = true;
      }

      this.scaleValue = val;
    },
    /**
     * Fire when user change the duration input
     * @param {Object} val Order option
     */
    onChangeDuration(val) {
      if (Number(val) < 0 || Number(val) > 5) {
        this.forceUpdate();

        return;
      }

      if (val !== this.durationValue) {
        this.showApplyOptions = true;
      }

      this.durationValue = val;
    },
    /**
     * Fire when user change the direction
     * @param {Object} val Direction option
     */
    onChangeDirection(val) {
      if (val.value !== this.selectedDirection.value) {
        this.showApplyOptions = true;
      }

      this.selectedDirection = val;
    },
    /**
     * Fire when click preview button
     */
    onClickPreview() {
      if (this.selectedStyle.value === NONE_OPTION.value) return;

      const animateData = {
        controlType: this.type,
        style: this.selectedStyle.value,
        duration: this.durationValue * 1000,
        scale: this.scaleValue / 100,
        direction: this.selectedDirection.value
      };

      this.$emit('preview', { config: animateData });
    },

    /**
     * Fore render component
     */
    forceUpdate() {
      this.componentKey = !this.componentKey;
    },
    /**
     * Fire when user change the apply option
     * @param {Object} val apply option
     */
    onChangeApplyOption(val) {
      this.selectedApplyOption = val;
      this.showApplyButton = true;
    },

    /**
     * Fire when user click apply button
     */
    onClickApply() {
      const animateData = {
        style: this.selectedStyle.value,
        duration: this.durationValue,
        scale: this.scaleValue,
        direction: this.selectedDirection.value
      };

      this.$emit('apply', this.selectedApplyOption.value, animateData);

      this.selectedApplyOption = null;
      this.showApplyOptions = false;
      this.showApplyButton = false;
    },
    /**
     * Reset config to default
     */
    resetConfig() {
      this.selectedDirection = this.directionOptions[0];
      this.durationValue = DEFAULT_ANIMATION.DURATION;
      this.scaleValue = DEFAULT_ANIMATION.SCALE;

      this.onChangeOrder(this.orderOptions[0]);
    },

    /**
     * Load saved config for animation
     * @param {Object} config config for animation
     */
    setConfigData(config) {
      this.selectedDirection =
        this.directionOptions.find(opt => opt.value === config.direction) ||
        this.directionOptions[0];
      this.selectedStyle =
        this.styleOptions.find(opt => opt.value === config.style) ||
        NONE_OPTION;
      this.durationValue = config.duration || DEFAULT_ANIMATION.DURATION;
      this.scaleValue = config.scale || DEFAULT_ANIMATION.SCALE;
    }
  },
  created() {
    this.setConfigData(this.config);
  },
  watch: {
    config(val) {
      this.setConfigData(val);
      this.showApplyOptions = false;
    }
  }
};
