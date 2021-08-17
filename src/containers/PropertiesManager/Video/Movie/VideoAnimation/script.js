import PpCombobox from '@/components/Selectors/Combobox';
import Select from '@/components/Selectors/Select';
import PpInput from '@/components/InputProperty';

import { ICON_LOCAL } from '@/common/constants';
import {
  NONE_OPTION,
  PLAY_IN_OUT_OPTIONS,
  VIDEO_ORDER
} from '@/common/constants/videoAnimation';

export default {
  components: { Select, PpCombobox, PpInput },
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      appendedIcon: ICON_LOCAL.APPENDED_ICON,
      orderOptions: VIDEO_ORDER,
      styleOptions: PLAY_IN_OUT_OPTIONS,
      durationValue: 0.8,
      scaleValue: 50,
      playInOutStyle: NONE_OPTION
    };
  },
  computed: {
    isShowOptions() {
      return this.playInOutStyle.value !== NONE_OPTION.value;
    },
    selectedOrder() {
      return this.orderOptions[0];
    },
    selectedStyle() {
      return this.styleOptions[0];
    }
  },
  methods: {
    /**
     * Fire when user change a play in /play out style
     * @param {Object} val A style option
     */
    onChangeStyle(val) {
      this.playInOutStyle = val;
    },
    /**
     * Fire when user change the order combobox
     * @param {Object} val Order option
     */
    onChangeOrder(val) {
      console.log('order ' + val);
    },
    /**
     * Fire when user change scale input
     * @param {Object} val Order option
     */
    onChangeScale(val) {
      console.log('scale ' + val);
    },
    /**
     * Fire when user change the duration input
     * @param {Object} val Order option
     */
    onChangeDuration(val) {
      console.log('duration ' + val);
    }
  }
};
