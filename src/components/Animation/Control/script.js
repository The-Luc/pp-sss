import PpInput from '@/components/InputProperty';
import PpSelect from '@/components/Selectors/Select';
import PpCombobox from '@/components/Selectors/Combobox';

import { EVENT_TYPE, ICON_LOCAL } from '@/common/constants';
import {
  CONTROL_TYPE,
  DIRECTION_OPTIONS,
  NONE_OPTION,
  PLAY_IN_OPTIONS,
  PLAY_OUT_OPTIONS,
  VIDEO_ORDER
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
      defaultDuration: 0.8,
      defaultScale: 50,
      defaultStyle: NONE_OPTION,
      selectedOrder: VIDEO_ORDER[0],
      defaultDirection: DIRECTION_OPTIONS[0],
      componentKey: true
    };
  },
  setup() {
    const { listObjects } = useObjectProperties();
    return {
      listObjects
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
    }
  },
  methods: {
    /**
     * Fire when user change a play in /play out style
     * @param {Object} val A style option
     */
    onChangeStyle(style) {
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

      this.selectedOrder = item;

      const updateData =
        this.type === CONTROL_TYPE.PLAY_IN
          ? {
              playInOrder: item.value,
              dirty: true
            }
          : {
              playOutOrder: item.value,
              dirty: true
            };

      this.$root.$emit(EVENT_TYPE.CHANGE_TEXT_PROPERTIES, updateData);
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
      if (val >= 0 && val <= 5) this.emitEvent({ duration: val });
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
    }
  },
  mounted() {
    if (!this.selectedOrder) this.selectedOrder = this.orderOptions[0];
  }
};
