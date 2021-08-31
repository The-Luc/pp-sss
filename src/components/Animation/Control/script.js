import PpInput from '@/components/InputProperty';
import PpSelect from '@/components/Selectors/Select';
import PpCombobox from '@/components/Selectors/Combobox';

import { EVENT_TYPE, ICON_LOCAL } from '@/common/constants';
import {
  CONTROL_TYPE,
  DIRECTION_OPTIONS,
  NONE_OPTION,
  PLAY_IN_OPTIONS,
  PLAY_OUT_OPTIONS
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
      durationValue: 0.8,
      scaleValue: 50,
      selectedStyle: NONE_OPTION,
      selectedOrder: null,
      selectedDirection: DIRECTION_OPTIONS[0],
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
      if (val >= 0 && val <= 100) this.scaleValue = val;
      else this.forceUpdate();
    },
    /**
     * Fire when user change the duration input
     * @param {Object} val Order option
     */
    onChangeDuration(val) {
      if (val >= 0 && val <= 5) this.durationValue = val;
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
