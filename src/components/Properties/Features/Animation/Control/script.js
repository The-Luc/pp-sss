import PpInput from '@/components/Input/InputProperty';
import PpSelect from '@/components/Selectors/Select';
import PpCombobox from '@/components/Selectors/Combobox';

import { ICON_LOCAL, OBJECT_TYPE } from '@/common/constants';
import {
  CONTROL_TYPE,
  DIRECTION_OPTIONS,
  NONE_OPTION,
  PLAY_IN_OPTIONS,
  PLAY_OUT_OPTIONS,
  TEXT_APPLY_OPTIONS
} from '@/common/constants/animationProperty';
import { useObjectProperties } from '@/hooks';

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
    isDisabledPreview: {
      type: Boolean
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
      applyOptions: TEXT_APPLY_OPTIONS,
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
  setup() {
    const { listObjects, currentObject } = useObjectProperties();
    return {
      listObjects,
      currentObject
    };
  },
  computed: {
    orderOptions() {
      return Object.values(this.listObjects)
        .filter(obj => obj?.type && obj.type !== OBJECT_TYPE.BACKGROUND)
        .map((_, i) => ({
          name: i + 1,
          value: i + 1
        }));
    },
    selectedOrder() {
      const order = this.orderOptions.find(o => o.value === this.config?.order);
      return order || this.orderOptions[0];
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

      this.emitEvent({ order: val.value });
    },
    /**
     * Fire when user change scale input
     * @param {Object} val Order option
     */
    onChangeScale(val) {
      if (val >= 0 && val <= 100) this.scaleValue = val;
      else this.forceUpdate();
    },
    /**
     * Fire when user change the duration input
     * @param {Object} val Order option
     */
    onChangeDuration(val) {
      if (Number(val) >= 0 && Number(val) <= 5) this.durationValue = val;
      else this.forceUpdate();
    },
    /**
     * Fire when user change the direction
     * @param {Object} val Direction option
     */
    onChangeDirection(val) {
      this.selectedDirection = val;
    },
    /**
     * To emit animation config to parent component
     * @param {Object} val config that change by user
     */
    emitEvent(val) {
      this.$emit('change', { ...this.config, ...val });
    },
    /**
     * Fire when click preview button
     */
    onClickPreview() {
      if (this.selectedStyle.value === NONE_OPTION.value) return;

      const animateData = {
        duration: this.durationValue * 1000,
        scale: this.scaleValue / 100,
        direction: this.selectedDirection.value
      };

      this.$emit('preview', animateData);
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
        duration: this.durationValue * 1000,
        scale: this.scaleValue / 100,
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
      this.durationValue = 0.8;
      this.scaleValue = 50;
    }
  }
};
