import PpInput from '@/components/InputProperty';
import PpSelect from '@/components/Selectors/Select';
import PpCombobox from '@/components/Selectors/Combobox';

import { ICON_LOCAL } from '@/common/constants';
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
    }
  },
  data() {
    return {
      appendedIcon: ICON_LOCAL.APPENDED_ICON,
      directionOptions: DIRECTION_OPTIONS,
      applyOptions: TEXT_APPLY_OPTIONS,
      selectedApplyOption: null,
      defaultDuration: 0.8,
      defaultScale: 50,
      defaultStyle: NONE_OPTION,
      defaultDirection: DIRECTION_OPTIONS[0],
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
    title() {
      return this.type === CONTROL_TYPE.PLAY_IN ? 'Play In' : 'Play Out';
    },
    styleOptions() {
      return this.type === CONTROL_TYPE.PLAY_IN
        ? PLAY_IN_OPTIONS
        : PLAY_OUT_OPTIONS;
    },
    orderOptions() {
      return Object.keys(this.listObjects).map((_, i) => ({
        name: i + 1,
        value: i + 1
      }));
    },
    isShowOptions() {
      return this.selectedStyle?.value !== NONE_OPTION.value;
    },
    selectedStyle() {
      if (!this.config.style) return this.defaultStyle;

      const style = this.styleOptions.find(
        style => style.value === this.config.style
      );
      return style || this.defaultStyle;
    },
    selectedDirection() {
      if (!this.config.direction) return this.defaultDirection;

      const direction = this.directionOptions.find(
        dir => dir.value === this.config.direction
      );
      return direction;
    },
    durationValue() {
      return this.config.duration || this.defaultDuration;
    },
    scaleValue() {
      return this.config.scale || this.defaultScale;
    },
    selectedOrder() {
      const order = this.orderOptions.find(o => o.value === this.config?.order);
      return order || this.orderOptions[0];
    }
  },
  methods: {
    /**
     * Fire when user change a play in /play out style
     * @param {Object} val A style option
     */
    onChangeStyle(style) {
      if (style.value !== NONE_OPTION.value) this.showApplyOptions = true;

      const data = {
        style: style.value,
        controlType: this.type,
        duration: this.defaultDuration,
        direction: this.defaultDirection.value,
        scale: this.defaultScale
      };

      this.$emit('change', { ...data });
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
      if (val >= 0 && val <= 100) this.emitEvent({ scale: val });
      else this.forceUpdate();
    },
    /**
     * Fire when user change the duration input
     * @param {Object} val Order option
     */
    onChangeDuration(val) {
      if (Number(val) >= 0 && Number(val) <= 5)
        this.emitEvent({ duration: Number(val) });
      else this.forceUpdate();
    },
    /**
     * Fire when user change the direction
     * @param {Object} val Direction option
     */
    onChangeDirection(val) {
      this.emitEvent({ direction: val.value });
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
      if (this.config.style === NONE_OPTION.value) return;

      const animateData = {
        ...this.config,
        duration: this.config.duration * 1000,
        scale: this.config.scale / 100
      };

      this.$emit('preview', animateData);
    },

    /**
     * Fore render component
     */
    forceUpdate() {
      this.componentKey = !this.componentKey;
    },
    onChangeApplyOption(val) {
      this.selectedApplyOption = val;
      this.showApplyButton = true;
    },
    onClickApply() {
      this.selectedApplyOption = null;
      this.showApplyOptions = false;
      this.showApplyButton = false;
    }
  }
};
