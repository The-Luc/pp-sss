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
  VIDEO_ORDER
} from '@/common/constants/animationProperty';
import { useObjectProperties } from '@/hooks';

export default {
  components: { PpSelect, PpInput, PpCombobox },
  props: {
    type: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      appendedIcon: ICON_LOCAL.APPENDED_ICON,
      directionOptions: DIRECTION_OPTIONS,
      orderOptions: VIDEO_ORDER,
      durationValue: 0.8,
      scaleValue: 50,
      selectedStyle: NONE_OPTION,
      selectedOrder: VIDEO_ORDER[0],
      selectedDirection: DIRECTION_OPTIONS[0]
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
    isShowOptions() {
      return this.selectedStyle.value !== NONE_OPTION.value;
    }
  },
  methods: {
    /**
     * Fire when user change a play in /play out style
     * @param {Object} val A style option
     */
    onChangeStyle(val) {
      this.selectedStyle = val;
    },
    /**
     * Fire when user change the order combobox
     * @param {Object} val Order option
     */
    onChangeOrder(val) {
      this.selectedOrder = val;
    },
    /**
     * Fire when user change scale input
     * @param {Object} val Order option
     */
    onChangeScale(val) {
      this.scaleValue = val;
    },
    /**
     * Fire when user change the duration input
     * @param {Object} val Order option
     */
    onChangeDuration(val) {
      this.durationValue = val;
    },
    /**
     * Fire when user change the direction
     * @param {Object} val Direction option
     */
    onChangeDirection(val) {
      this.selectedDirection = val;
    },
    /**
     * Fire when click preview button
     */
    onClickPreview() {
      const config = {
        type: this.type,
        style: this.selectedStyle.value,
        duration: this.durationValue,
        direction: this.selectedDirection.value,
        scale: this.scaleValue
      };
      this.$emit('preview', config);
    }
  }
};
